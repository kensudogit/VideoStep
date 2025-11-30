'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import VideoList from '@/components/VideoList'
import Header from '@/components/Header'
import Link from 'next/link'

interface Video {
  id: number
  title: string
  description?: string
  thumbnailUrl?: string
  viewCount: number
  userId?: number
  createdAt: string
  duration?: number
  likeCount?: number
  category?: string
}

export default function RelatedVideosPage() {
  const params = useParams()
  const router = useRouter()
  const videoId = params.videoId ? parseInt(params.videoId as string) : null
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [originalVideo, setOriginalVideo] = useState<Video | null>(null)

  useEffect(() => {
    if (videoId) {
      fetchRelatedVideos()
      fetchOriginalVideo()
    }
  }, [videoId])

  const fetchOriginalVideo = async () => {
    if (!videoId) return
    
    try {
      const { apiRequest } = await import('@/utils/api')
      const data = await apiRequest<Video>(`/api/videos/${videoId}`)
      if (data.success && data.data) {
        setOriginalVideo(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch original video:', error)
    }
  }

  const fetchRelatedVideos = async () => {
    if (!videoId) return

    try {
      setLoading(true)
      const { apiRequest } = await import('@/utils/api')
      const data = await apiRequest<Video[]>(`/api/videos/recommendations/related/${videoId}?limit=50`)
      
      console.log('Fetched related videos data:', data)
      if (data.success && data.data && Array.isArray(data.data)) {
        setVideos(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch related videos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!videoId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">動画IDが無効です</h3>
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
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {originalVideo && (
              <Link 
                href={`/videos/${videoId}`}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {originalVideo.title}
              </Link>
            )}
            <Link 
              href="/videos"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              動画一覧に戻る
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            関連動画
          </h1>
          {originalVideo && (
            <p className="text-gray-600 dark:text-gray-400">
              「{originalVideo.title}」に関連する動画
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...new Array(12)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {videos.length > 0 ? (
              <VideoList videos={videos} />
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">関連動画がありません</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">この動画に関連する動画が見つかりませんでした</p>
                {originalVideo && (
                  <Link 
                    href={`/videos/${videoId}`}
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    元の動画に戻る
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

