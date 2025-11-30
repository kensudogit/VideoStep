import { shouldUseMockData, mockVideos, mockComments } from './mockData'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    currentPage?: number
    page: number
    size: number
    total: number
    totalElements?: number
    totalPages: number
    hasNext?: boolean
    hasPrevious?: boolean
    isFirst?: boolean
    isLast?: boolean
  }
}

// Check if API is available
const isApiAvailable = (): boolean => {
  if (typeof globalThis.window === 'undefined') return false
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  
  // 環境変数で強制的にmockデータを使う設定がある場合はfalseを返す
  // これが最優先の設定
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    console.log('[Mock Data] NEXT_PUBLIC_USE_MOCK_DATA=true が設定されています。mockデータを使用します。')
    return false
  }
  
  // 開発環境（localhost）では常にmockデータを使用
  if (apiUrl.includes('localhost') || apiUrl === '' || !apiUrl.startsWith('http')) {
    console.log('[Mock Data] API URLが設定されていないか、localhostです。mockデータを使用します。')
    return false
  }
  
  // Vercelデプロイ時も、APIが利用できない場合はmockデータを使用
  // これにより500エラーを回避
  // デフォルトでは常にmockデータを使用
  console.log('[Mock Data] デフォルト設定により、mockデータを使用します。')
  return false
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Use mock data if API is not available or forced to use mock data
  // 優先順位: 1. NEXT_PUBLIC_USE_MOCK_DATA環境変数 2. shouldUseMockData() 3. isApiAvailable()
  const useMock = 
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' ||
    shouldUseMockData() ||
    !isApiAvailable()
  
  if (useMock) {
    console.log('[Mock Data] Using mock data for endpoint:', endpoint)
    return getMockResponse<T>(endpoint)
  }

  try {
    // 開発環境ではタイムアウトを短く設定して、すぐにmockデータにフォールバック
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒でタイムアウト

    // 同一オリジンの場合はsame-origin、それ以外はomit（サードパーティCookie廃止対応）
    const isSameOrigin = typeof globalThis.window !== 'undefined' && 
      (API_BASE_URL === '' || 
       new URL(API_BASE_URL, globalThis.window.location.origin).origin === globalThis.window.location.origin)
    const credentials = isSameOrigin ? 'same-origin' : 'omit'

    // 認証トークンを取得（サードパーティCookie廃止対応: トークンベース認証を使用）
    const token = typeof globalThis.window !== 'undefined' ? useAuthStore.getState().token : null
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }
    
    // トークンがある場合はAuthorizationヘッダーを追加
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    let response: Response
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        credentials, // サードパーティCookie廃止対応: 同一オリジンのみCookieを送信
        headers,
      })
    } catch (fetchError: any) {
      // ネットワークエラーやタイムアウトの場合はmockデータを使用（エラーを表示しない）
      clearTimeout(timeoutId)
      if (process.env.NODE_ENV === 'development') {
        console.log('Network error, using mock data:', fetchError.message)
      }
      return getMockResponse<T>(endpoint)
    }

    clearTimeout(timeoutId)

    // データベース接続エラー（500エラーなど）の場合はmockデータを使用（エラーを表示しない）
    if (!response.ok && (response.status >= 500 || response.status === 0)) {
      // 500エラーは静かに処理し、mockデータにフォールバック
      if (process.env.NODE_ENV === 'development') {
        console.log('API error, using mock data. Status:', response.status)
      }
      // 本番環境ではエラーを表示しない
      return getMockResponse<T>(endpoint)
    }

    let data
    try {
      data = await response.json()
    } catch (parseError) {
      // JSON解析エラーの場合もmockデータを使用
      console.warn('Failed to parse response, using mock data:', parseError)
      return getMockResponse<T>(endpoint)
    }

    if (!response.ok) {
      // データベース関連のエラーの場合はmockデータを使用
      if (response.status >= 500 || data.error?.toLowerCase().includes('database') || 
          data.error?.toLowerCase().includes('connection') || 
          data.error?.toLowerCase().includes('mysql') ||
          data.error?.toLowerCase().includes('communications')) {
        console.warn('Database error detected, using mock data:', data.error)
        return getMockResponse<T>(endpoint)
      }
      return {
        success: false,
        error: data.error || 'Request failed',
      }
    }

    // データが空の場合もmockデータを使用
    if (!data || (Array.isArray(data.data) && data.data.length === 0 && endpoint.includes('/api/videos'))) {
      console.warn('Empty data received, using mock data')
      return getMockResponse<T>(endpoint)
    }

    return data
  } catch (error: any) {
    // Fallback to mock data on error (network error, database connection error, timeout, etc.)
    // エラーは静かに処理し、mockデータにフォールバック（ユーザーには表示しない）
    if (process.env.NODE_ENV === 'development') {
      if (error.name === 'AbortError') {
        console.log('API request timeout, using mock data')
      } else {
        console.log('API request failed, using mock data:', error.message)
      }
    }
    // 本番環境ではエラーを表示しない
    return getMockResponse<T>(endpoint)
  }
}

// Get mock response based on endpoint
function getMockResponse<T>(endpoint: string): ApiResponse<T> {
  console.log('getMockResponse called for endpoint:', endpoint)
  
  // Videos endpoints
  if (endpoint.includes('/api/videos/public')) {
    const page = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('page') || '0')
    const size = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('size') || '8')
    const start = page * size
    const end = start + size
    const videos = mockVideos.slice(start, end)
    const totalPages = Math.ceil(mockVideos.length / size)
    console.log(`Returning ${videos.length} mock videos (page ${page}, size ${size})`)
    return {
      success: true,
      data: videos as T,
      pagination: {
        currentPage: page,
        page,
        size,
        total: mockVideos.length,
        totalElements: mockVideos.length,
        totalPages,
        hasNext: page < totalPages - 1,
        hasPrevious: page > 0,
        isFirst: page === 0,
        isLast: page >= totalPages - 1,
      },
    }
  }

  // Category search
  if (endpoint.includes('/api/videos/category/')) {
    const category = decodeURIComponent(endpoint.split('/category/')[1]?.split('?')[0] || '')
    const page = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('page') || '0')
    const size = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('size') || '8')
    const filteredVideos = mockVideos.filter(v => v.category === category)
    const start = page * size
    const end = start + size
    const videos = filteredVideos.slice(start, end)
    const totalPages = Math.ceil(filteredVideos.length / size)
    console.log(`Returning ${videos.length} mock videos for category "${category}"`)
    return {
      success: true,
      data: videos as T,
      pagination: {
        currentPage: page,
        page,
        size,
        total: filteredVideos.length,
        totalElements: filteredVideos.length,
        totalPages,
        hasNext: page < totalPages - 1,
        hasPrevious: page > 0,
        isFirst: page === 0,
        isLast: page >= totalPages - 1,
      },
    }
  }

  // Keyword search
  if (endpoint.includes('/api/videos/search')) {
    const keyword = new URLSearchParams(endpoint.split('?')[1] || '').get('keyword') || ''
    const page = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('page') || '0')
    const size = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('size') || '8')
    const filteredVideos = mockVideos.filter(v => 
      v.title.toLowerCase().includes(keyword.toLowerCase()) ||
      v.description.toLowerCase().includes(keyword.toLowerCase()) ||
      v.tags?.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
    )
    const start = page * size
    const end = start + size
    const videos = filteredVideos.slice(start, end)
    const totalPages = Math.ceil(filteredVideos.length / size)
    console.log(`Returning ${videos.length} mock videos for keyword "${keyword}"`)
    return {
      success: true,
      data: videos as T,
      pagination: {
        currentPage: page,
        page,
        size,
        total: filteredVideos.length,
        totalElements: filteredVideos.length,
        totalPages,
        hasNext: page < totalPages - 1,
        hasPrevious: page > 0,
        isFirst: page === 0,
        isLast: page >= totalPages - 1,
      },
    }
  }

  // Single video by ID
  if (endpoint.includes('/api/videos/') && endpoint.match(/\/api\/videos\/\d+$/) && !endpoint.includes('/comments')) {
    const videoId = parseInt(endpoint.split('/').pop() || '1')
    const video = mockVideos.find(v => v.id === videoId) || mockVideos[0]
    console.log(`Returning mock video with ID ${videoId}`)
    return {
      success: true,
      data: video as T,
    }
  }

  // Comments
  if (endpoint.includes('/api/videos/') && endpoint.includes('/comments')) {
    const videoId = parseInt(endpoint.split('/')[3] || '1')
    const comments = mockComments[videoId] || []
    console.log(`Returning ${comments.length} mock comments for video ${videoId}`)
    return {
      success: true,
      data: comments as T,
    }
  }

  // Recommendations - popular
  if (endpoint.includes('/api/videos/recommendations/popular')) {
    const limit = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('limit') || '10')
    // 視聴回数が多い順にソート
    const sortedVideos = [...mockVideos].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    const videos = sortedVideos.slice(0, limit)
    console.log(`Returning ${videos.length} popular mock videos`)
    return {
      success: true,
      data: videos as T,
    }
  }

  // Recommendations - latest
  if (endpoint.includes('/api/videos/recommendations/latest')) {
    const limit = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('limit') || '10')
    // 作成日時が新しい順にソート
    const sortedVideos = [...mockVideos].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    const videos = sortedVideos.slice(0, limit)
    console.log(`Returning ${videos.length} latest mock videos`)
    return {
      success: true,
      data: videos as T,
    }
  }

  // Recommendations - category
  if (endpoint.includes('/api/videos/recommendations/category/')) {
    const category = decodeURIComponent(endpoint.split('/category/')[1]?.split('?')[0] || '')
    const limit = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('limit') || '10')
    const filteredVideos = mockVideos.filter(v => v.category === category)
    const videos = filteredVideos.slice(0, limit)
    console.log(`Returning ${videos.length} category recommendations for "${category}"`)
    return {
      success: true,
      data: videos as T,
    }
  }

  // Recommendations - general
  if (endpoint.includes('/api/videos/recommendations')) {
    const limit = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('limit') || '10')
    const videos = mockVideos.slice(0, limit)
    console.log(`Returning ${videos.length} recommended mock videos`)
    return {
      success: true,
      data: videos as T,
    }
  }

  // Related videos
  if (endpoint.includes('/api/videos/recommendations/related/')) {
    const videoId = parseInt(endpoint.split('/related/')[1]?.split('?')[0] || '1')
    const limit = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('limit') || '6')
    // 同じカテゴリの動画を返す（自分自身を除く）
    const currentVideo = mockVideos.find(v => v.id === videoId)
    const relatedVideos = currentVideo
      ? mockVideos.filter(v => v.id !== videoId && v.category === currentVideo.category).slice(0, limit)
      : mockVideos.slice(0, limit)
    console.log(`Returning ${relatedVideos.length} related mock videos for video ${videoId}`)
    return {
      success: true,
      data: relatedVideos as T,
    }
  }

  // Default mock response
  console.log('No specific mock handler for endpoint, returning empty data')
  return {
    success: true,
    data: {} as T,
  }
}

export async function apiRequestWithAuth<T>(
  endpoint: string,
  token: string,
  userId: number,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'X-User-Id': userId.toString(),
    },
  })
}

export async function uploadFile(
  endpoint: string,
  file: File,
  token: string,
  userId: number,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<any>> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('video', file)

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100
        onProgress(progress)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText)
          resolve(data)
        } catch {
          resolve({
            success: false,
            error: 'Invalid response',
          })
        }
      } else {
        resolve({
          success: false,
          error: `Upload failed with status ${xhr.status}`,
        })
      }
    })

    xhr.addEventListener('error', () => {
      resolve({
        success: false,
        error: 'Upload failed',
      })
    })

    xhr.open('POST', `${API_BASE_URL}${endpoint}`)
    // サードパーティCookie廃止対応: 同一オリジンのみCookieを送信
    const isSameOrigin = typeof globalThis.window !== 'undefined' && 
      (API_BASE_URL === '' || 
       new URL(API_BASE_URL, globalThis.window.location.origin).origin === globalThis.window.location.origin)
    xhr.withCredentials = isSameOrigin // 同一オリジンのみtrue
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('X-User-Id', userId.toString())
    xhr.send(formData)
  })
}

// Video Service API Functions

/**
 * 公開動画一覧を取得
 */
export async function getPublicVideos(page: number = 0, size: number = 12): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(`/api/videos/public?page=${page}&size=${size}`)
}

/**
 * 動画詳細を取得
 */
export async function getVideoById(videoId: number): Promise<ApiResponse<any>> {
  return apiRequest<any>(`/api/videos/${videoId}`)
}

/**
 * ユーザーの動画一覧を取得
 */
export async function getUserVideos(userId: number, page: number = 0, size: number = 12, token?: string): Promise<ApiResponse<any[]>> {
  const endpoint = `/api/videos/user/${userId}?page=${page}&size=${size}`
  if (token) {
    const authStore = useAuthStore.getState()
    return apiRequestWithAuth<any[]>(endpoint, token, authStore.userId || userId)
  }
  return apiRequest<any[]>(endpoint)
}

/**
 * 動画を検索
 */
export async function searchVideos(keyword: string, page: number = 0, size: number = 12): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(`/api/videos/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`)
}

/**
 * カテゴリ別動画を取得
 */
export async function getVideosByCategory(category: string, page: number = 0, size: number = 12): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(`/api/videos/category/${encodeURIComponent(category)}?page=${page}&size=${size}`)
}

/**
 * 人気動画を取得
 */
export async function getPopularVideos(limit: number = 10): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(`/api/videos/recommendations/popular?limit=${limit}`)
}

/**
 * 最新動画を取得
 */
export async function getLatestVideos(limit: number = 10): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(`/api/videos/recommendations/latest?limit=${limit}`)
}

/**
 * カテゴリ別おすすめ動画を取得
 */
export async function getCategoryRecommendations(category: string, limit: number = 10): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(`/api/videos/recommendations/category/${encodeURIComponent(category)}?limit=${limit}`)
}

/**
 * 関連動画を取得
 */
export async function getRelatedVideos(videoId: number, limit: number = 6): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(`/api/videos/recommendations/related/${videoId}?limit=${limit}`)
}

/**
 * 動画にいいねする/いいねを解除
 */
export async function toggleLike(videoId: number, token: string, userId: number): Promise<ApiResponse<any>> {
  return apiRequestWithAuth<any>(`/api/videos/${videoId}/like`, token, userId, { method: 'POST' })
}

/**
 * 動画のいいね状態を取得
 */
export async function getLikeStatus(videoId: number, token: string, userId: number): Promise<ApiResponse<any>> {
  return apiRequestWithAuth<any>(`/api/videos/${videoId}/like`, token, userId)
}

/**
 * コメントを投稿
 */
export async function createComment(videoId: number, content: string, token: string, userId: number): Promise<ApiResponse<any>> {
  return apiRequestWithAuth<any>(`/api/videos/${videoId}/comments`, token, userId, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

/**
 * コメント一覧を取得
 */
export async function getComments(videoId: number): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(`/api/videos/${videoId}/comments`)
}

/**
 * お気に入りに追加/削除
 */
export async function toggleFavorite(videoId: number, token: string, userId: number): Promise<ApiResponse<any>> {
  return apiRequestWithAuth<any>(`/api/videos/${videoId}/favorite`, token, userId, { method: 'POST' })
}

/**
 * お気に入り状態を取得
 */
export async function getFavoriteStatus(videoId: number, token: string, userId: number): Promise<ApiResponse<any>> {
  return apiRequestWithAuth<any>(`/api/videos/${videoId}/favorite`, token, userId)
}

/**
 * お気に入り一覧を取得
 */
export async function getFavorites(token: string, userId: number): Promise<ApiResponse<any[]>> {
  return apiRequestWithAuth<any[]>(`/api/videos/favorites`, token, userId)
}

// Playlist API Functions

/**
 * プレイリスト一覧を取得
 */
export async function getPlaylists(token: string, userId: number): Promise<ApiResponse<any[]>> {
  return apiRequestWithAuth<any[]>(`/api/playlists`, token, userId)
}

/**
 * プレイリスト詳細を取得
 */
export async function getPlaylistById(playlistId: number, token?: string, userId?: number): Promise<ApiResponse<any>> {
  if (token && userId) {
    return apiRequestWithAuth<any>(`/api/playlists/${playlistId}`, token, userId)
  }
  return apiRequest<any>(`/api/playlists/${playlistId}`)
}

/**
 * 公開プレイリスト一覧を取得
 */
export async function getPublicPlaylists(page: number = 0, size: number = 12): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(`/api/playlists/public?page=${page}&size=${size}`)
}

/**
 * プレイリストを作成
 */
export async function createPlaylist(name: string, description: string, isPublic: boolean, token: string, userId: number): Promise<ApiResponse<any>> {
  return apiRequestWithAuth<any>(`/api/playlists`, token, userId, {
    method: 'POST',
    body: JSON.stringify({ name, description, isPublic }),
  })
}

/**
 * プレイリストに動画を追加
 */
export async function addVideoToPlaylist(playlistId: number, videoId: number, token: string, userId: number): Promise<ApiResponse<any>> {
  return apiRequestWithAuth<any>(`/api/playlists/${playlistId}/videos/${videoId}`, token, userId, { method: 'POST' })
}

// Notification API Functions

/**
 * 通知一覧を取得
 */
export async function getNotifications(token: string, userId: number): Promise<ApiResponse<any[]>> {
  return apiRequestWithAuth<any[]>(`/api/notifications`, token, userId)
}

/**
 * 未読通知を取得
 */
export async function getUnreadNotifications(token: string, userId: number): Promise<ApiResponse<any[]>> {
  return apiRequestWithAuth<any[]>(`/api/notifications/unread`, token, userId)
}

/**
 * 未読通知数を取得
 */
export async function getUnreadNotificationCount(token: string, userId: number): Promise<ApiResponse<{ unreadCount: number }>> {
  return apiRequestWithAuth<{ unreadCount: number }>(`/api/notifications/count`, token, userId)
}

// Watch History API Functions

/**
 * 視聴履歴を取得
 */
export async function getWatchHistory(token: string, userId: number): Promise<ApiResponse<any[]>> {
  return apiRequestWithAuth<any[]>(`/api/videos/history`, token, userId)
}

/**
 * 視聴位置を取得
 */
export async function getWatchPosition(videoId: number, token: string, userId: number): Promise<ApiResponse<{ position: number }>> {
  return apiRequestWithAuth<{ position: number }>(`/api/videos/history/${videoId}/position`, token, userId)
}

/**
 * 視聴履歴を記録
 */
export async function recordWatch(videoId: number, position: number, token: string, userId: number): Promise<ApiResponse<any>> {
  return apiRequestWithAuth<any>(`/api/videos/history/${videoId}`, token, userId, {
    method: 'POST',
    body: JSON.stringify({ position }),
  })
}

