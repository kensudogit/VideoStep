import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('デフォルトサイズでレンダリングされる', () => {
    render(<LoadingSpinner />)
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-8', 'h-8')
  })

  it('smallサイズでレンダリングされる', () => {
    render(<LoadingSpinner size="sm" />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('w-4', 'h-4')
  })

  it('largeサイズでレンダリングされる', () => {
    render(<LoadingSpinner size="lg" />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('w-12', 'h-12')
  })

  it('カスタムクラス名が適用される', () => {
    render(<LoadingSpinner className="custom-class" />)
    const container = document.querySelector('.custom-class')
    expect(container).toBeInTheDocument()
  })

  it('スピナーアニメーションが適用される', () => {
    render(<LoadingSpinner />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('animate-spin')
  })
})

