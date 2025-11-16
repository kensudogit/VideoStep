import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('初期値を即座に返す', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('値が変更されても指定時間内は古い値を返す', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated' })
    expect(result.current).toBe('initial') // まだ古い値

    vi.advanceTimersByTime(499)
    expect(result.current).toBe('initial') // まだ古い値

    vi.advanceTimersByTime(1)
    expect(result.current).toBe('updated') // 新しい値
  })

  it('連続して値が変更された場合、最後の値のみが反映される', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'first' } }
    )

    rerender({ value: 'second' })
    vi.advanceTimersByTime(200)

    rerender({ value: 'third' })
    vi.advanceTimersByTime(200)

    rerender({ value: 'fourth' })
    vi.advanceTimersByTime(500)

    expect(result.current).toBe('fourth')
  })

  it('カスタムディレイ時間を正しく処理', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 1000),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })
    vi.advanceTimersByTime(999)
    expect(result.current).toBe('initial')

    vi.advanceTimersByTime(1)
    expect(result.current).toBe('updated')
  })
})

