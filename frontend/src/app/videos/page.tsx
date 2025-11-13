'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import VideoList from '@/components/VideoList'
import Header from '@/components/Header'
import CategoryFilter from '@/components/CategoryFilter'
import Pagination from '@/components/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import Link from 'next/link'

export default function VideosPage() {
  const { isAuthenticated } = useAuthStore()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  const fetchVideos = useCallback(async (page: number, size: number) => {
    let url = ''
    if (selectedCategory) {
      url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/category/${encodeURIComponent(selectedCategory)}?page=${page}&size=${size}`
    } else if (searchKeyword) {
      url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/search?keyword=${encodeURIComponent(searchKeyword)}&page=${page}&size=${size}`
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/public?page=${page}&size=${size}`
    }
    
    const response = await fetch(url)
    const data = await response.json()
    if (data.success) {
      return {
        data: data.data,
        pagination: data.pagination,
      }
    }
    throw new Error(data.error || 'Failed to fetch videos')
  }, [searchKeyword, selectedCategory])

  const {
    data: videos,
    loading,
    currentPage,
    totalPages,
    goToPage,
    refresh,
  } = useServerPagination({
    pageSize: 12,
    fetchFunction: fetchVideos,
  })

  useEffect(() => {
    refresh()
  }, [searchKeyword, selectedCategory, refresh])

  useEffect(() => {
    extractCategories()
  }, [])

  const extractCategories = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/public?page=0&size=100`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const uniqueCategories = Array.from(
            new Set(data.data.map((video: any) => video.category).filter(Boolean))
          ) as string[]
          setCategories(uniqueCategories)
        }
      })
      .catch(err => console.error('Failed to extract categories:', err))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    goToPage(1) // 検索時は最初のページに戻る
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            動画一覧
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

          {/* Action Buttons */}
          {isAuthenticated && (
            <div className="flex gap-4 mb-6">
              <Link
                href="/videos/upload"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                動画をアップロード
              </Link>
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 0 && (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}
        </div>

        {/* Video List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {searchKeyword ? '検索結果が見つかりませんでした' : '動画がありません'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchKeyword ? '別のキーワードで検索してみてください' : '最初の動画をアップロードしてみましょう'}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
