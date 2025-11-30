'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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

export default function VideoSearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const keyword = searchParams.get('keyword') || ''
  const [searchKeyword, setSearchKeyword] = useState(keyword)

  const fetchVideos = useCallback(async (page: number, size: number) => {
    if (!searchKeyword.trim()) {
      return { data: [], pagination: { page, size, total: 0, totalPages: 0 } }
    }

    const { apiRequest } = await import('@/utils/api')
    const endpoint = `/api/videos/search?keyword=${encodeURIComponent(searchKeyword)}&page=${page}&size=${size}`
    
    console.log('Fetching search videos from endpoint:', endpoint)
    const data = await apiRequest<any[]>(endpoint)
    console.log('Fetched search videos data:', data)
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
  }, [searchKeyword])

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
    if (keyword) {
      setSearchKeyword(keyword)
      refresh()
    }
  }, [keyword, refresh])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchKeyword.trim()) {
      router.push(`/videos/search?keyword=${encodeURIComponent(searchKeyword)}`)
      goToPage(1)
    }
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            動画検索
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="動画を検索..."
                  className="w-full px-6 py-4 glass-effect rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                検索
              </button>
            </div>
          </form>

          {keyword && (
            <p className="text-gray-600 dark:text-gray-400">
              「{keyword}」の検索結果: {videos.length > 0 ? `${videos.length}件の動画` : '見つかりませんでした'}
            </p>
          )}
        </div>

        {!keyword ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">検索キーワードを入力してください</h3>
            <p className="text-gray-600 dark:text-gray-400">動画のタイトル、説明、タグから検索できます</p>
          </div>
        ) : loading ? (
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">検索結果が見つかりませんでした</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">別のキーワードで検索してみてください</p>
                <Link 
                  href="/videos"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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

