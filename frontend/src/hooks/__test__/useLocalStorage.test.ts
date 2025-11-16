import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('初期値が正しく設定される', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('localStorageに保存された値が読み込まれる', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('stored-value')
  })

  it('値が更新されるとlocalStorageに保存される', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('updated-value')
    })

    expect(result.current[0]).toBe('updated-value')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated-value'))
  })

  it('オブジェクトを正しく保存・読み込みできる', () => {
    const initialValue = { name: 'Test', age: 25 }
    const { result } = renderHook(() => useLocalStorage('test-key', initialValue))
    
    expect(result.current[0]).toEqual(initialValue)

    const newValue = { name: 'Updated', age: 30 }
    act(() => {
      result.current[1](newValue)
    })

    expect(result.current[0]).toEqual(newValue)
    expect(JSON.parse(localStorage.getItem('test-key')!)).toEqual(newValue)
  })

  it('配列を正しく保存・読み込みできる', () => {
    const initialValue = [1, 2, 3]
    const { result } = renderHook(() => useLocalStorage('test-key', initialValue))
    
    expect(result.current[0]).toEqual(initialValue)

    const newValue = [4, 5, 6]
    act(() => {
      result.current[1](newValue)
    })

    expect(result.current[0]).toEqual(newValue)
    expect(JSON.parse(localStorage.getItem('test-key')!)).toEqual(newValue)
  })

  it('無効なJSONがlocalStorageにある場合は初期値を使用', () => {
    localStorage.setItem('test-key', 'invalid-json')
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })
})

