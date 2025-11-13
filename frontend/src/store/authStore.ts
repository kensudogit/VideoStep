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
      setAuth: (token, userId, email, name) =>
        set({
          token,
          userId,
          email,
          name,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          token: null,
          userId: null,
          email: null,
          name: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

