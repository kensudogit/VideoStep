import { shouldUseMockData, mockVideos, mockComments } from './mockData'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Check if API is available
const isApiAvailable = (): boolean => {
  if (typeof window === 'undefined') return false
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  return apiUrl !== '' && !apiUrl.includes('localhost') && apiUrl.startsWith('http')
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Use mock data if API is not available
  if (!isApiAvailable() || shouldUseMockData()) {
    return getMockResponse<T>(endpoint)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // サードパーティCookie廃止対応: Cookieを自動送信
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Request failed',
      }
    }

    return data
  } catch (error: any) {
    // Fallback to mock data on error
    console.warn('API request failed, using mock data:', error.message)
    return getMockResponse<T>(endpoint)
  }
}

// Get mock response based on endpoint
function getMockResponse<T>(endpoint: string): ApiResponse<T> {
  // Videos endpoints
  if (endpoint.includes('/api/videos/public')) {
    const page = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('page') || '0')
    const size = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('size') || '8')
    const start = page * size
    const end = start + size
    return {
      success: true,
      data: mockVideos.slice(start, end) as T,
    }
  }

  if (endpoint.includes('/api/videos/') && endpoint.match(/\/api\/videos\/\d+$/)) {
    const videoId = parseInt(endpoint.split('/').pop() || '1')
    const video = mockVideos.find(v => v.id === videoId) || mockVideos[0]
    return {
      success: true,
      data: video as T,
    }
  }

  if (endpoint.includes('/api/videos/') && endpoint.includes('/comments')) {
    const videoId = parseInt(endpoint.split('/')[3] || '1')
    const comments = mockComments[videoId] || []
    return {
      success: true,
      data: comments as T,
    }
  }

  // Default mock response
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

