import { shouldUseMockData, mockVideos, mockComments } from './mockData'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    size: number
    total: number
    totalPages: number
  }
}

// Check if API is available
const isApiAvailable = (): boolean => {
  if (typeof window === 'undefined') return false
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  // 環境変数で強制的にmockデータを使う設定がある場合はfalseを返す
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return false
  }
  // 開発環境（localhost）では常にmockデータを使用
  if (apiUrl.includes('localhost') || apiUrl === '' || !apiUrl.startsWith('http')) {
    return false
  }
  return true
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Use mock data if API is not available or forced to use mock data
  const useMock = !isApiAvailable() || shouldUseMockData() || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
  if (useMock) {
    console.log('Using mock data for endpoint:', endpoint)
    return getMockResponse<T>(endpoint)
  }

  try {
    // 開発環境ではタイムアウトを短く設定して、すぐにmockデータにフォールバック
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒でタイムアウト

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      credentials: 'include', // サードパーティCookie廃止対応: Cookieを自動送信
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    // データベース接続エラー（500エラーなど）の場合はmockデータを使用
    if (!response.ok && (response.status >= 500 || response.status === 0)) {
      console.warn('Database connection error, using mock data. Status:', response.status)
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
    if (error.name === 'AbortError') {
      console.warn('API request timeout, using mock data')
    } else {
      console.warn('API request failed, using mock data:', error.message)
    }
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

  // Recommendations
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
    xhr.withCredentials = true // サードパーティCookie廃止対応: Cookieを自動送信
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('X-User-Id', userId.toString())
    xhr.send(formData)
  })
}

