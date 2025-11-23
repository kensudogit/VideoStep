'use client'

import { useEffect } from 'react'

// グローバルエラーハンドラー: 500エラーとDeprecated API警告を抑制
export function ErrorHandler() {
  useEffect(() => {
    // ブラウザのネイティブエラーを抑制
    const handleError = (event: ErrorEvent) => {
      const message = event.message || ''
      const source = event.filename || ''
      
      // 500エラー、ネットワークエラー、fetchエラーを抑制
      if (
        message.includes('500') ||
        message.includes('Failed to load resource') ||
        message.includes('NetworkError') ||
        message.includes('fetch') ||
        message.includes('Network request failed') ||
        source.includes('api') ||
        source.includes('vercel')
      ) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    // 未処理のPromise拒否を抑制
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || event.reason?.toString() || ''
      
      // 500エラー、ネットワークエラーを抑制
      if (
        reason.includes('500') ||
        reason.includes('Failed to load resource') ||
        reason.includes('NetworkError') ||
        reason.includes('fetch') ||
        reason.includes('Network request failed')
      ) {
        event.preventDefault()
        return false
      }
    }

    // 500エラーのコンソール表示を抑制
    const originalError = console.error
    console.error = (...args: any[]) => {
      const message = args.join(' ')
      if (
        message.includes('500') ||
        message.includes('Failed to load resource') ||
        message.includes('NetworkError') ||
        message.includes('fetch') ||
        message.includes('Network request failed') ||
        message.includes('status of 500')
      ) {
        return // エラーを表示しない
      }
      originalError.apply(console, args)
    }

    // Deprecated API警告を抑制
    const originalWarn = console.warn
    console.warn = (...args: any[]) => {
      const message = args.join(' ')
      if (
        message.includes('Deprecated API') ||
        message.includes('PerformanceObserver') ||
        message.includes('entry type') ||
        message.includes('Deprecated API for given entry type')
      ) {
        return // 警告を表示しない
      }
      originalWarn.apply(console, args)
    }

    // Preload警告を抑制
    const originalLog = console.log
    console.log = (...args: any[]) => {
      const message = args.join(' ')
      if (
        message.includes('preload') ||
        message.includes('was preloaded') ||
        message.includes('not used within') ||
        message.includes('was preloaded using link preload')
      ) {
        return // 警告を表示しない
      }
      originalLog.apply(console, args)
    }

    // イベントリスナーを登録
    window.addEventListener('error', handleError, true)
    window.addEventListener('unhandledrejection', handleRejection, true)

    return () => {
      window.removeEventListener('error', handleError, true)
      window.removeEventListener('unhandledrejection', handleRejection, true)
      console.error = originalError
      console.warn = originalWarn
      console.log = originalLog
    }
  }, [])

  return null
}

