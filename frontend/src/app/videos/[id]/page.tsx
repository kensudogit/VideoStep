'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Header from '@/components/Header'
import VideoActions from '@/components/VideoActions'
import CommentSection from '@/components/CommentSection'
import ShareButton from '@/components/ShareButton'
import RelatedVideos from '@/components/RelatedVideos'
import VideoPlayer from '@/components/VideoPlayer'
import Link from 'next/link'

interface Video {
  id: number
  title: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  viewCount: number
  likeCount: number
  userId: number
  createdAt: string
  category?: string
  tags?: string
  duration?: number
}

export default function VideoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, userId } = useAuthStore()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [translations, setTranslations] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState('ja')

  useEffect(() => {
    if (params.id) {
      fetchVideo()
      fetchTranslations()
    }
  }, [params.id])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setVideo(data.data)
      } else {
        setError('動画が見つかりませんでした')
      }
    } catch (error) {
      console.error('Failed to fetch video:', error)
      setError('動画の読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const fetchTranslations = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/translations/video/${params.id}?targetLanguage=${selectedLanguage}`)
      const data = await response.json()
      if (data.success) {
        setTranslations(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この動画を削除しますか？')) return

    try {
      const token = useAuthStore.getState().token
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/${params.id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': userId?.toString() || '',
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        router.push('/videos')
      } else {
        alert('削除に失敗しました')
      }
    } catch (error) {
      console.error('Failed to delete video:', error)
      alert('削除に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 dark:bg-gray-700 rounded-2xl h-96 mb-6"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{error || '動画が見つかりませんでした'}</h3>
            <Link href="/videos" className="text-blue-600 dark:text-blue-400 hover:underline">
              動画一覧に戻る
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl overflow-hidden shadow-2xl mb-6">
              {video.videoUrl ? (
                <VideoPlayer
                  url={video.videoUrl}
                  videoId={video.id}
                  title={video.title}
                  className="w-full"
                />
              ) : (
                <div className="aspect-video bg-black flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {video.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{video.viewCount.toLocaleString()} 回視聴</span>
                    <span>{new Date(video.createdAt).toLocaleDateString('ja-JP')}</span>
                  </div>
                </div>
                {isAuthenticated && userId === video.userId && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    削除
                  </button>
                )}
              </div>

              {video.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                  {video.description}
                </p>
              )}

              {/* Video Actions */}
              <div className="mb-4 flex items-center justify-between">
                <VideoActions
                  videoId={video.id}
                  initialLikeCount={video.likeCount || 0}
                  initialIsLiked={false}
                  initialIsFavorited={false}
                />
                <ShareButton videoId={video.id} title={video.title} />
              </div>

              {(video.category || video.tags) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {video.category && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {video.category}
                    </span>
                  )}
                  {video.tags && video.tags.split(',').map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Translation Section */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">翻訳</h2>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value)
                  fetchTranslations()
                }}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white mb-4"
              >
                <option value="ja">日本語</option>
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="ko">한국어</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
              {translations.length > 0 ? (
                <div className="space-y-2">
                  {translations.map((translation: any) => (
                    <div key={translation.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{translation.sourceText}</p>
                      <p className="text-gray-900 dark:text-white">{translation.translatedText}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm">翻訳がありません</p>
              )}
            </div>

            {/* Related Videos */}
            <RelatedVideos videoId={video.id} />
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection videoId={video.id} />
        </div>
      </main>
    </div>
  )
}

