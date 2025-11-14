'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Header from '@/components/Header'

export const dynamic = 'force-dynamic'

export default function UploadPage() {
  const router = useRouter()
  const { isAuthenticated, userId, token } = useAuthStore()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    isPublic: true,
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (!mounted || !isAuthenticated) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Create video record
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId?.toString() || '',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        const videoId = data.data.id

        // Upload video file if selected
        if (file && token && userId) {
          const formDataFile = new FormData()
          formDataFile.append('video', file)

          const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/${videoId}/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-User-Id': userId.toString(),
            },
            body: formDataFile,
          })

          const uploadData = await uploadResponse.json()
          if (!uploadData.success) {
            throw new Error(uploadData.error || '動画のアップロードに失敗しました')
          }
          
          setUploadProgress(100)
        }

        router.push(`/videos/${videoId}`)
      } else {
        setError(data.error || '動画の作成に失敗しました')
      }
    } catch (err: any) {
      setError(err.message || 'アップロードに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="glass-effect rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">動画をアップロード</h1>
            <p className="text-gray-600 dark:text-gray-400">あなたの知識を世界と共有しましょう</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                placeholder="動画のタイトルを入力"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                説明
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white resize-none"
                placeholder="動画の説明を入力"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  カテゴリ
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                  placeholder="例: 製造業"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  タグ（カンマ区切り）
                </label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                  placeholder="例: 技術, 教育, ノウハウ"
                />
              </div>
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                動画ファイル
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file" className="cursor-pointer">
                  {file ? (
                    <div>
                      <svg className="w-12 h-12 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-900 dark:text-white font-medium">{file.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400">クリックしてファイルを選択</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">またはドラッグ＆ドロップ</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                公開する
              </label>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {uploadProgress > 0 ? `アップロード中... ${Math.round(uploadProgress)}%` : 'アップロード中...'}
                </span>
              ) : (
                'アップロード'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

