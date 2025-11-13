'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Header from '@/components/Header'
import Link from 'next/link'

interface EditSlide {
  id: number
  projectId: number
  sequence: number
  slideUrl: string
  title: string
  text: string
  startTime: number
  endTime: number
  transitionType: string
}

interface EditProject {
  id: number
  videoId: number
  name: string
  description: string
  status: string
}

export default function EditingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, userId, token } = useAuthStore()
  const [project, setProject] = useState<EditProject | null>(null)
  const [slides, setSlides] = useState<EditSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddSlideModal, setShowAddSlideModal] = useState(false)
  const [newSlide, setNewSlide] = useState({
    sequence: slides.length + 1,
    slideUrl: '',
    title: '',
    text: '',
    startTime: 0,
    endTime: 0,
    transitionType: 'FADE',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    if (params.id) {
      fetchProject()
      fetchSlides()
    }
  }, [params.id, isAuthenticated])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/editing/projects/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setProject(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSlides = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/editing/projects/${params.id}/slides`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setSlides(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch slides:', error)
    }
  }

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/editing/projects/${params.id}/slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSlide),
      })

      const data = await response.json()
      if (data.success) {
        setShowAddSlideModal(false)
        setNewSlide({
          sequence: slides.length + 2,
          slideUrl: '',
          title: '',
          text: '',
          startTime: 0,
          endTime: 0,
          transitionType: 'FADE',
        })
        fetchSlides()
      }
    } catch (error) {
      console.error('Failed to add slide:', error)
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/editing/projects/${params.id}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        fetchProject()
      }
    } catch (error) {
      console.error('Failed to complete project:', error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/editing" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
            ← 編集プロジェクト一覧に戻る
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {project?.name}
              </h1>
              {project?.description && (
                <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddSlideModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                スライドを追加
              </button>
              {project?.status !== 'COMPLETED' && (
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  完了
                </button>
              )}
            </div>
          </div>
        </div>

        {slides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="glass-effect rounded-2xl p-6 shadow-lg card-hover"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      スライド {slide.sequence}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                      {slide.transitionType}
                    </span>
                  </div>
                  {slide.slideUrl ? (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-3">
                      <img
                        src={slide.slideUrl}
                        alt={slide.title || `Slide ${slide.sequence}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                {slide.title && (
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {slide.title}
                  </h3>
                )}
                {slide.text && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                    {slide.text}
                  </p>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {slide.startTime > 0 && (
                    <span>開始: {Math.floor(slide.startTime / 1000)}秒</span>
                  )}
                  {slide.endTime > 0 && (
                    <span className="ml-4">終了: {Math.floor(slide.endTime / 1000)}秒</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">スライドがありません</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">最初のスライドを追加しましょう</p>
            <button
              onClick={() => setShowAddSlideModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              スライドを追加
            </button>
          </div>
        )}

        {/* Add Slide Modal */}
        {showAddSlideModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-effect rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">スライドを追加</h2>
              <form onSubmit={handleAddSlide} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      順序
                    </label>
                    <input
                      type="number"
                      value={newSlide.sequence}
                      onChange={(e) => setNewSlide({ ...newSlide, sequence: parseInt(e.target.value) })}
                      required
                      min={1}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      トランジション
                    </label>
                    <select
                      value={newSlide.transitionType}
                      onChange={(e) => setNewSlide({ ...newSlide, transitionType: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    >
                      <option value="FADE">FADE</option>
                      <option value="SLIDE">SLIDE</option>
                      <option value="NONE">NONE</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    スライドURL
                  </label>
                  <input
                    type="url"
                    value={newSlide.slideUrl}
                    onChange={(e) => setNewSlide({ ...newSlide, slideUrl: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    placeholder="https://example.com/slide.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    タイトル
                  </label>
                  <input
                    type="text"
                    value={newSlide.title}
                    onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    placeholder="スライドのタイトル"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    テキスト
                  </label>
                  <textarea
                    value={newSlide.text}
                    onChange={(e) => setNewSlide({ ...newSlide, text: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                    placeholder="スライドのテキスト"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      開始時間 (ms)
                    </label>
                    <input
                      type="number"
                      value={newSlide.startTime}
                      onChange={(e) => setNewSlide({ ...newSlide, startTime: parseInt(e.target.value) })}
                      min={0}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      終了時間 (ms)
                    </label>
                    <input
                      type="number"
                      value={newSlide.endTime}
                      onChange={(e) => setNewSlide({ ...newSlide, endTime: parseInt(e.target.value) })}
                      min={0}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddSlideModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    追加
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

