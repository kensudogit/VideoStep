'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

interface VideoActionsProps {
  videoId: number
  initialLikeCount: number
  initialIsLiked?: boolean
  initialIsFavorited?: boolean
}

export default function VideoActions({
  videoId,
  initialLikeCount,
  initialIsLiked = false,
  initialIsFavorited = false,
}: VideoActionsProps) {
  const { isAuthenticated, userId, token } = useAuthStore()
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && userId) {
      checkLikeStatus()
      checkFavoriteStatus()
    }
  }, [isAuthenticated, userId, videoId])

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/${videoId}/like`,
        {
          headers: {
            'X-User-Id': userId?.toString() || '',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (data.success) {
        setIsLiked(data.isLiked)
      }
    } catch (error) {
      console.error('Failed to check like status:', error)
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/${videoId}/favorite`,
        {
          headers: {
            'X-User-Id': userId?.toString() || '',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (data.success) {
        setIsFavorited(data.isFavorited)
      }
    } catch (error) {
      console.error('Failed to check favorite status:', error)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) return

    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/${videoId}/like`,
        {
          method: 'POST',
          headers: {
            'X-User-Id': userId?.toString() || '',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (data.success) {
        setIsLiked(data.isLiked)
        setLikeCount(prev => data.isLiked ? prev + 1 : Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!isAuthenticated) return

    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/${videoId}/favorite`,
        {
          method: 'POST',
          headers: {
            'X-User-Id': userId?.toString() || '',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (data.success) {
        setIsFavorited(data.isFavorited)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleLike}
        disabled={!isAuthenticated || loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
          isLiked
            ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg
          className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
          fill={isLiked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span className="font-semibold">{likeCount}</span>
      </button>

      <button
        onClick={handleFavorite}
        disabled={!isAuthenticated || loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
          isFavorited
            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg
          className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`}
          fill={isFavorited ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <span className="font-semibold">お気に入り</span>
      </button>
    </div>
  )
}

