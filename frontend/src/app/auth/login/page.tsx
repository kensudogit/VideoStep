'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import Header from '@/components/Header'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // まずlocalStorageから保存された認証情報を確認
      const storedAuth = localStorage.getItem('auth-storage')
      const storedCredentials = localStorage.getItem('login-credentials')
      
      if (storedAuth && storedCredentials) {
        try {
          const authData = JSON.parse(storedAuth)
          const credentials = JSON.parse(storedCredentials)
          const storedEmail = credentials.email
          const storedPassword = credentials.password

          // メールアドレスとパスワードが一致する場合、localStorageの認証情報を使用
          if (storedEmail === email && storedPassword === password) {
            // localStorageの認証情報を使用
            if (authData.state?.token && authData.state?.userId) {
              setAuth(
                authData.state.token,
                authData.state.userId,
                authData.state.email,
                authData.state.name || ''
              )
              router.push('/')
              setLoading(false)
              return
            }
          }
        } catch (parseError) {
          // localStorageの解析に失敗した場合は通常のログイン処理を続行
          console.warn('Failed to parse stored auth data:', parseError)
        }
      }

      // API経由でログイン
      // サードパーティCookie廃止対応: 同一オリジンのみCookieを送信
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
      const isSameOrigin = typeof globalThis.window !== 'undefined' && 
        (apiUrl === '' || new URL(apiUrl, globalThis.window.location.origin).origin === globalThis.window.location.origin)
      const credentials = isSameOrigin ? 'same-origin' : 'omit'

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        credentials,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // localStorageが利用可能かチェック
        const isLocalStorageAvailable = (): boolean => {
          try {
            if (typeof globalThis.window === 'undefined') return false
            const test = '__localStorage_test__'
            localStorage.setItem(test, test)
            localStorage.removeItem(test)
            return true
          } catch {
            return false
          }
        }

        if (!isLocalStorageAvailable()) {
          console.error('❌ localStorage is not available')
          setError('ブラウザの設定により、認証情報を保存できません。')
          setLoading(false)
          return
        }

        // ログイン情報をlocalStorageに保存（パスワードも含む）- 最初に保存
        try {
          const authData = {
            email,
            password, // 比較チェック用にパスワードも保存
            token: data.data.token,
            userId: data.data.userId,
            name: data.data.name,
          }
          
          // 同期的に保存を試行
          localStorage.setItem('login-credentials', JSON.stringify(authData))
          
          // 保存を確認
          const verified = localStorage.getItem('login-credentials')
          if (verified) {
            const parsed = JSON.parse(verified)
            if (parsed.email === email && parsed.token === data.data.token) {
              console.log('✅ Login credentials saved to localStorage successfully:', { email, userId: data.data.userId })
            } else {
              console.error('❌ Login credentials saved but verification failed')
            }
          } else {
            console.error('❌ Failed to verify login credentials in localStorage')
          }
        } catch (storageError: any) {
          console.error('❌ Failed to save login credentials to localStorage:', storageError)
          console.error('Error details:', {
            name: storageError?.name,
            message: storageError?.message,
            code: storageError?.code,
          })
        }

        // 認証情報をZustandストアに設定（これでauth-storageに保存される）
        setAuth(
          data.data.token,
          data.data.userId,
          data.data.email,
          data.data.name
        )

        // Zustandの保存を確認し、失敗した場合は手動で保存
        setTimeout(() => {
          const authStorage = localStorage.getItem('auth-storage')
          if (authStorage) {
            try {
              const parsed = JSON.parse(authStorage)
              if (parsed.state?.token === data.data.token) {
                console.log('✅ Auth storage saved to localStorage successfully')
              } else {
                console.warn('⚠️ Auth storage found but token mismatch, saving manually...')
                // 手動で保存
                const manualAuthData = {
                  state: {
                    token: data.data.token,
                    userId: data.data.userId,
                    email: data.data.email,
                    name: data.data.name,
                    isAuthenticated: true,
                  },
                  version: 0,
                }
                localStorage.setItem('auth-storage', JSON.stringify(manualAuthData))
                console.log('✅ Auth storage manually saved to localStorage')
              }
            } catch (e) {
              console.warn('⚠️ Failed to parse auth storage, saving manually...')
              // 手動で保存
              const manualAuthData = {
                state: {
                  token: data.data.token,
                  userId: data.data.userId,
                  email: data.data.email,
                  name: data.data.name,
                  isAuthenticated: true,
                },
                version: 0,
              }
              localStorage.setItem('auth-storage', JSON.stringify(manualAuthData))
              console.log('✅ Auth storage manually saved to localStorage')
            }
          } else {
            console.warn('⚠️ Auth storage not found in localStorage, saving manually...')
            // 手動で保存を試みる
            try {
              const manualAuthData = {
                state: {
                  token: data.data.token,
                  userId: data.data.userId,
                  email: data.data.email,
                  name: data.data.name,
                  isAuthenticated: true,
                },
                version: 0,
              }
              localStorage.setItem('auth-storage', JSON.stringify(manualAuthData))
              console.log('✅ Auth storage manually saved to localStorage')
            } catch (e) {
              console.error('❌ Failed to manually save auth storage:', e)
            }
          }
        }, 300)

        router.push('/')
      } else {
        setError(data.error || 'ログインに失敗しました')
      }
    } catch (err) {
      setError('ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className="glass-effect rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Image
                  src="/utsubo_image1.png"
                  alt="VideoStep Logo"
                  width={96}
                  height={96}
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ログイン</h1>
              <p className="text-gray-600 dark:text-gray-400">VideoStepへようこそ</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl animate-slide-up">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="example@videostep.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  パスワード
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ログイン中...
                  </span>
                ) : (
                  'ログイン'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              アカウントをお持ちでない方は{' '}
              <Link href="/auth/register" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                新規登録
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
