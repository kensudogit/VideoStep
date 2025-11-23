import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userId: number | null
  email: string | null
  name: string | null
  isAuthenticated: boolean
  setAuth: (token: string, userId: number, email: string, name: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      email: null,
      name: null,
      isAuthenticated: false,
      setAuth: (token, userId, email, name) => {
        console.log('🔐 Setting auth data:', { userId, email, name })
        
        // 状態を設定（Zustandのpersistが自動的にlocalStorageに保存する）
        set({
          token,
          userId,
          email,
          name,
          isAuthenticated: true,
        })

        // 確実にlocalStorageに保存されるように手動でも保存
        if (typeof globalThis.window !== 'undefined') {
          try {
            // 手動でauth-storageを保存（Zustandの形式に合わせる）
            const manualAuthData = {
              state: {
                token,
                userId,
                email,
                name,
                isAuthenticated: true,
              },
              version: 0,
            }
            localStorage.setItem('auth-storage', JSON.stringify(manualAuthData))
            console.log('✅ Auth data manually saved to localStorage')
          } catch (error) {
            console.error('❌ Failed to manually save auth data:', error)
          }

          // 保存を確認
          setTimeout(() => {
            try {
              const stored = localStorage.getItem('auth-storage')
              if (stored) {
                const parsed = JSON.parse(stored)
                if (parsed.state?.token === token && parsed.state?.userId === userId) {
                  console.log('✅ Auth data confirmed in localStorage:', { userId, email })
                } else {
                  console.warn('⚠️ Auth data in localStorage but content mismatch')
                }
              } else {
                console.error('❌ Auth data not found in localStorage')
              }
            } catch (error) {
              console.error('❌ Error checking auth storage:', error)
            }
          }, 100)
        }
      },
      clearAuth: () => {
        // localStorageからlogin-credentialsも削除
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('login-credentials')
            localStorage.removeItem('auth-storage')
            console.log('Auth data cleared from localStorage')
          } catch (error) {
            console.warn('Failed to remove auth data from localStorage:', error)
          }
        }
        set({
          token: null,
          userId: null,
          email: null,
          name: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof globalThis.window === 'undefined') {
          // サーバーサイドでは空のストレージを返す
          const noopStorage: Storage = {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
            clear: () => {},
            key: () => null,
            length: 0,
          }
          return noopStorage
        }
        return localStorage
      }),
      skipHydration: false,
    }
  )
)

