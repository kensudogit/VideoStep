'use client'

import ReactPlayer from 'react-player'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'

interface VideoPlayerProps {
  url: string
  videoId?: number
  title?: string
  className?: string
  onProgress?: (progress: { played: number; playedSeconds: number }) => void
}

export default function VideoPlayer({ 
  url, 
  videoId, 
  title, 
  className = '',
  onProgress 
}: VideoPlayerProps) {
  const { isAuthenticated, userId, token } = useAuthStore()
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [lastPosition, setLastPosition] = useState(0)
  const watchStartTime = useRef<number | null>(null)
  const watchDuration = useRef<number>(0)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (videoId && isAuthenticated && userId) {
      fetchLastPosition()
    }
  }, [videoId, isAuthenticated, userId])

  useEffect(() => {
    return () => {
      // コンポーネントがアンマウントされる際に視聴履歴を記録
      if (videoId && isAuthenticated && userId && watchDuration.current > 0) {
        recordWatchHistory()
      }
    }
  }, [videoId, isAuthenticated, userId])

  const fetchLastPosition = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/history/${videoId}/position`,
        {
          headers: {
            'X-User-Id': userId?.toString() || '',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (data.success && data.position > 0) {
        setLastPosition(data.position)
      }
    } catch (error) {
      console.error('Failed to fetch last position:', error)
    }
  }

  const recordWatchHistory = async () => {
    if (!videoId || !isAuthenticated || !userId) return

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/history/${videoId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId.toString(),
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            watchDuration: watchDuration.current,
            lastPosition: lastPosition,
          }),
        }
      )
    } catch (error) {
      console.error('Failed to record watch history:', error)
    }
  }

  const handlePlay = () => {
    setPlaying(true)
    watchStartTime.current = Date.now()
  }

  const handlePause = () => {
    setPlaying(false)
    if (watchStartTime.current) {
      const duration = Math.floor((Date.now() - watchStartTime.current) / 1000)
      watchDuration.current += duration
      watchStartTime.current = null
    }
    // 一時停止時に履歴を記録
    if (videoId && isAuthenticated && userId) {
      recordWatchHistory()
    }
  }

  const handleProgress = (progress: { played: number; playedSeconds: number }) => {
    setLastPosition(Math.floor(progress.playedSeconds))
    if (onProgress) {
      onProgress(progress)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="aspect-video bg-black rounded-2xl overflow-hidden">
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          muted={muted}
          controls
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
          progressInterval={5000} // 5秒ごとに進捗を更新
        />
      </div>
    </div>
  )
}

