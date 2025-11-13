'use client'

import { useEffect } from 'react'

interface NotificationToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export default function NotificationToast({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000,
}: NotificationToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const bgColors = {
    success: 'bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    info: 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`${bgColors[type]} border rounded-xl shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md`}>
        <div className="flex-1">{message}</div>
        <button
          onClick={onClose}
          className="text-current hover:opacity-70 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

