'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import VideoList from '@/components/VideoList'
import CategoryFilter from '@/components/CategoryFilter'

export default function RecommendedPage() {
  const [popularVideos, setPopularVideos] = useState([])
  const [latestVideos, setLatestVideos] = useState([])
  const [selectedTab, setSelectedTab] = useState<'popular' | 'latest'>('popular')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchVideos()
    extractCategories()
  }, [selectedTab, selectedCategory])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      let url = ''
      if (selectedTab === 'popular') {
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/recommendations/popular?limit=20`
      } else {
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/recommendations/latest?limit=20`
      }

      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        let videos = data.data
        if (selectedCategory) {
          videos = videos.filter((video: any) => video.category === selectedCategory)
        }
        if (selectedTab === 'popular') {
          setPopularVideos(videos)
        } else {
          setLatestVideos(videos)
        }
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const extractCategories = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/public`)
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

  const currentVideos = selectedTab === 'popular' ? popularVideos : latestVideos

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            おすすめ動画
          </h1>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedTab('popular')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedTab === 'popular'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              人気動画
            </button>
            <button
              onClick={() => setSelectedTab('latest')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedTab === 'latest'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              最新動画
            </button>
          </div>

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
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentVideos.length > 0 ? (
          <VideoList videos={currentVideos} />
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">動画がありません</h3>
            <p className="text-gray-600 dark:text-gray-400">動画をアップロードしてみましょう</p>
          </div>
        )}
      </main>
    </div>
  )
}

