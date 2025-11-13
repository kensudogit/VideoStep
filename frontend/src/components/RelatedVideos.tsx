'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatViews, formatRelativeTime } from '@/utils/format'

interface Video {
  id: number
  title: string
  thumbnailUrl?: string
  viewCount: number
  createdAt: string
}

interface RelatedVideosProps {
  videoId: number
}

export default function RelatedVideos({ videoId }: RelatedVideosProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedVideos()
  }, [videoId])

  const fetchRelatedVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/recommendations/related/${videoId}?limit=6`
      )
      const data = await response.json()
      if (data.success) {
        setVideos(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch related videos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">関連動画</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-40 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">関連動画</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">関連動画がありません</p>
      </div>
    )
  }

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">関連動画</h2>
      <div className="space-y-4">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/videos/${video.id}`}
            className="flex gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-2 transition-colors"
          >
            <div className="relative w-40 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                {video.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{formatViews(video.viewCount)} 回視聴</span>
                <span>•</span>
                <span>{formatRelativeTime(video.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

