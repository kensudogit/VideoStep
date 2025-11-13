'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

interface Playlist {
  id: number
  name: string
  videoCount: number
}

interface AddToPlaylistButtonProps {
  videoId: number
}

export default function AddToPlaylistButton({ videoId }: AddToPlaylistButtonProps) {
  const { isAuthenticated, userId, token } = useAuthStore()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && showModal) {
      fetchPlaylists()
    }
  }, [isAuthenticated, showModal])

  const fetchPlaylists = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/playlists`,
        {
          headers: {
            'X-User-Id': userId?.toString() || '',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (data.success) {
        setPlaylists(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch playlists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/playlists/${playlistId}/videos/${videoId}`,
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
        setShowModal(false)
        alert('プレイリストに追加しました')
      } else {
        alert(data.error || '追加に失敗しました')
      }
    } catch (error) {
      console.error('Failed to add to playlist:', error)
      alert('追加に失敗しました')
    }
  }

  if (!isAuthenticated) return null

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>プレイリストに追加</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-2xl p-6 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">プレイリストに追加</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : playlists.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    className="w-full text-left px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">{playlist.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{playlist.videoCount} 動画</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">プレイリストがありません</p>
                <a
                  href="/playlists"
                  className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl"
                >
                  プレイリストを作成
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

