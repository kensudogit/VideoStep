'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Header from '@/components/Header'
import VideoList from '@/components/VideoList'
import Link from 'next/link'

interface Playlist {
  id: number
  userId: number
  name: string
  description?: string
  videoCount: number
  isPublic: boolean
  videos: any[]
}

export default function PlaylistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, userId, token } = useAuthStore()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    fetchPlaylist()
  }, [params.id, isAuthenticated, userId])

  const fetchPlaylist = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/playlists/${params.id}`,
        {
          headers: {
            'X-User-Id': userId?.toString() || '',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (data.success) {
        setPlaylist(data.data)
      } else {
        setError(data.error || 'プレイリストが見つかりません')
      }
    } catch (error) {
      console.error('Failed to fetch playlist:', error)
      setError('プレイリストの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveVideo = async (videoId: number) => {
    if (!confirm('この動画をプレイリストから削除しますか？')) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/playlists/${params.id}/videos/${videoId}`,
        {
          method: 'DELETE',
          headers: {
            'X-User-Id': userId?.toString() || '',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (data.success) {
        fetchPlaylist()
      }
    } catch (error) {
      console.error('Failed to remove video:', error)
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/playlists/${params.id}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || 'プレイリストが見つかりません'}
            </h3>
            <Link href="/playlists" className="text-blue-600 dark:text-blue-400 hover:underline">
              プレイリスト一覧に戻る
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const isOwner = playlist.userId === userId

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/playlists" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
            ← プレイリスト一覧に戻る
          </Link>
          <div className="glass-effect rounded-2xl p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {playlist.name}
                </h1>
                {playlist.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {playlist.description}
                  </p>
                )}
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {playlist.videoCount} 動画
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    playlist.isPublic
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}>
                    {playlist.isPublic ? '公開' : '非公開'}
                  </span>
                  {playlist.isPublic && (
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {shareCopied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          コピーしました
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          共有
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {playlist.videos && playlist.videos.length > 0 ? (
          <div>
            <VideoList videos={playlist.videos} />
            {isOwner && (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                * 動画カードをクリックして詳細ページから削除できます
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">動画がありません</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">動画を追加してプレイリストを作成しましょう</p>
            <Link
              href="/videos"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              動画を探す
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
