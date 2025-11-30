'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import VideoList from '@/components/VideoList'
import Header from '@/components/Header'
import Pagination from '@/components/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
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

export default function CategoryVideosPage() {
  const params = useParams()
  const category = params.category ? decodeURIComponent(params.category as string) : null

  const fetchVideos = useCallback(async (page: number, size: number) => {
    if (!category) {
      return { data: [], pagination: { page, size, total: 0, totalPages: 0 } }
    }

    const { apiRequest } = await import('@/utils/api')
    const endpoint = `/api/videos/category/${encodeURIComponent(category)}?page=${page}&size=${size}`
    
    console.log('Fetching category videos from endpoint:', endpoint)
    const data = await apiRequest<any[]>(endpoint)
    console.log('Fetched category videos data:', data)
    if (data.success && data.data && Array.isArray(data.data)) {
      const totalPages = Math.ceil((data as any).pagination?.total || data.data.length / size)
      return {
        data: data.data,
        pagination: (data as any).pagination || { 
          currentPage: page,
          page, 
          size, 
          total: data.data.length,
          totalElements: data.data.length,
          totalPages,
          hasNext: page < totalPages - 1,
          hasPrevious: page > 0,
          isFirst: page === 0,
          isLast: page >= totalPages - 1,
        },
      }
    }
    return {
      data: [],
      pagination: { page, size, total: 0, totalPages: 0 },
    }
  }, [category])

  const {
    data: videos,
    loading,
    currentPage,
    totalPages,
    goToPage,
    refresh,
  } = useServerPagination<Video>({
    pageSize: 12,
    fetchFunction: fetchVideos,
  })

  useEffect(() => {
    if (category) {
      refresh()
    }
  }, [category, refresh])

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">カテゴリが無効です</h3>
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
            {category} カテゴリの動画
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {videos.length > 0 ? `${videos.length}件の動画` : '動画がありません'}
          </p>
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
              <>
                <VideoList videos={videos} />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">動画がありません</h3>
                <p className="text-gray-600 dark:text-gray-400">このカテゴリにはまだ動画がありません</p>
                <Link 
                  href="/videos"
                  className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
                >
                  動画一覧に戻る
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

