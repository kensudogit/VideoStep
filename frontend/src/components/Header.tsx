'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import NotificationBadge from './NotificationBadge'

export default function Header() {
  const { isAuthenticated, name, clearAuth } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      // APIにログアウトリクエストを送信（オプション）
      const token = useAuthStore.getState().token
      if (token) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          })
        } catch (apiError) {
          // API呼び出しに失敗してもログアウト処理は続行
          console.warn('Logout API call failed:', apiError)
        }
      }
    } catch (error) {
      console.warn('Logout error:', error)
    } finally {
      // 認証情報をクリア
      clearAuth()
      // ホームページにリダイレクト
      router.push('/')
    }
  }

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-white/20 dark:border-gray-700/50 shadow-lg backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
            onClick={(e) => {
              // 現在のページがホームページの場合は、ページをリロード
              if (pathname === '/') {
                e.preventDefault()
                router.refresh()
              }
            }}
          >
            <div className="relative">
              <div className="w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <Image
                  src="/utsubo_image1.png"
                  alt="VideoStep Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div>
              <span className="text-2xl font-extrabold gradient-text block">VideoStep</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">知識を未来へ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/videos" 
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-200"
            >
              動画一覧
            </Link>
            <Link 
              href="/playlists/public" 
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-200"
            >
              公開プレイリスト
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  href="/videos/upload" 
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-200"
                >
                  アップロード
                </Link>
                <Link 
                  href="/editing" 
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-200"
                >
                  編集
                </Link>
                <Link 
                  href="/profile" 
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-200"
                >
                  プロフィール
                </Link>
                <Link 
                  href="/favorites" 
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-200"
                >
                  お気に入り
                </Link>
                <Link 
                  href="/history" 
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-200"
                >
                  履歴
                </Link>
                <Link 
                  href="/playlists" 
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-200"
                >
                  プレイリスト
                </Link>
                <div className="flex items-center space-x-4">
                  <NotificationBadge />
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {name}さん
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors duration-200"
                  >
                    ログアウト
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/register"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  新規登録
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4 animate-slide-up">
            <Link 
              href="/videos" 
              className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              動画一覧
            </Link>
            <Link 
              href="/playlists/public" 
              className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              公開プレイリスト
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  href="/videos/upload" 
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  アップロード
                </Link>
                <Link 
                  href="/editing" 
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  編集
                </Link>
                <Link 
                  href="/profile" 
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  プロフィール
                </Link>
                <Link 
                  href="/favorites" 
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  お気に入り
                </Link>
                <Link 
                  href="/history" 
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  履歴
                </Link>
                <Link 
                  href="/playlists" 
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  プレイリスト
                </Link>
                <Link 
                  href="/notifications" 
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  通知
                </Link>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {name}さん
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left text-red-600 dark:text-red-400 font-medium py-2"
                  >
                    ログアウト
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full text-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  新規登録
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
