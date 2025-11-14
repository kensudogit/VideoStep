'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import VideoList from '@/components/VideoList'
import Header from '@/components/Header'

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const { apiRequest } = await import('@/utils/api')
      const data = await apiRequest<any[]>('/api/videos/public?page=0&size=8')
      if (data.success && data.data) {
        // サムネイルがない動画にサンプル画像を設定
        const videosWithThumbnails = data.data.map((video: any) => ({
          ...video,
          // サムネイルがない場合は、後でVideoCardコンポーネントで自動的に設定される
        }))
        setVideos(videosWithThumbnails)
      } else {
        // Fallback to empty array if no data
        setVideos([])
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
      // エラー時は空配列を表示（apiRequestがmockデータを返す）
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-fade-in">
            <div className="inline-block mb-6 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 rounded-full backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 animate-slide-up">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">知識を未来へ、世界へ</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 gradient-text animate-slide-up leading-tight">
              動画で人々の知を
              <br />
              未来と世界へ繋ぐ
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 mb-12 leading-relaxed animate-slide-up max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
              VideoStepは、熟練技術者のノウハウ継承や外国人教育を支援する
              <br className="hidden md:block" />
              次世代動画共有プラットフォームです
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Link
                  href="/auth/register"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 overflow-hidden text-lg"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    無料で始める
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/auth/login"
                  className="px-8 py-4 glass-effect text-gray-700 dark:text-gray-300 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500/50 dark:hover:border-blue-400/50 text-lg"
                >
                  ログイン
                </Link>
              </div>
            )}

            {/* Feature Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-20 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="group glass-effect p-8 rounded-3xl card-hover border border-white/20 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">スライド編集</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">直感的なスライド型動画編集機能で、誰でも簡単にプロフェッショナルな動画を作成できます</p>
              </div>
              
              <div className="group glass-effect p-8 rounded-3xl card-hover border border-white/20 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-600/50 transition-all duration-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">24言語対応</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">自動翻訳機能により、世界中の誰もがあなたの知識にアクセスできます</p>
              </div>
              
              <div className="group glass-effect p-8 rounded-3xl card-hover border border-white/20 dark:border-gray-700/50 hover:border-pink-300/50 dark:hover:border-pink-600/50 transition-all duration-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">知識継承</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">熟練技術者の貴重なノウハウを次世代へ、そして世界へ継承します</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 gradient-text">
              人気の動画
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl">
              世界中の技術者が共有する知識とノウハウ
            </p>
          </div>
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span>すべて見る</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...new Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full aspect-video bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <VideoList videos={videos.slice(0, 8)} />
        )}
      </section>
    </div>
  )
}
