import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'

describe('authStore', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    useAuthStore.getState().clearAuth()
    localStorage.clear()
  })

  it('初期状態が正しい', () => {
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.userId).toBeNull()
    expect(state.email).toBeNull()
    expect(state.name).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('setAuthで認証情報を設定できる', () => {
    const { setAuth } = useAuthStore.getState()
    setAuth('test-token', 1, 'test@example.com', 'Test User')

    const state = useAuthStore.getState()
    expect(state.token).toBe('test-token')
    expect(state.userId).toBe(1)
    expect(state.email).toBe('test@example.com')
    expect(state.name).toBe('Test User')
    expect(state.isAuthenticated).toBe(true)
  })

  it('clearAuthで認証情報をクリアできる', () => {
    const { setAuth, clearAuth } = useAuthStore.getState()
    setAuth('test-token', 1, 'test@example.com', 'Test User')
    
    clearAuth()

    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.userId).toBeNull()
    expect(state.email).toBeNull()
    expect(state.name).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('認証情報がlocalStorageに永続化される', () => {
    const { setAuth } = useAuthStore.getState()
    setAuth('test-token', 1, 'test@example.com', 'Test User')

    const stored = localStorage.getItem('auth-storage')
    expect(stored).toBeTruthy()
    
    if (stored) {
      const parsed = JSON.parse(stored)
      expect(parsed.state.token).toBe('test-token')
      expect(parsed.state.userId).toBe(1)
      expect(parsed.state.isAuthenticated).toBe(true)
    }
  })
})

