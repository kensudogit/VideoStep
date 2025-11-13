const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
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
    return {
      success: false,
      error: error.message || 'Network error',
    }
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
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('X-User-Id', userId.toString())
    xhr.send(formData)
  })
}

