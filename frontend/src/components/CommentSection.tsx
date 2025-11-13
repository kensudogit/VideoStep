'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { formatRelativeTime } from '@/utils/format'

interface Comment {
  id: number
  userId: number
  userName: string | null
  content: string
  likeCount: number
  createdAt: string
  replies?: Comment[]
}

interface CommentSectionProps {
  videoId: number
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const { isAuthenticated, userId, token } = useAuthStore()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [videoId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/${videoId}/comments`
      )
      const data = await response.json()
      if (data.success) {
        setComments(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !isAuthenticated) return

    setSubmitting(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/${videoId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId?.toString() || '',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      )
      const data = await response.json()
      if (data.success) {
        setNewComment('')
        fetchComments()
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!confirm('このコメントを削除しますか？')) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/comments/${commentId}`,
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
        fetchComments()
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        コメント ({comments.length})
      </h2>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを入力..."
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? '送信中...' : '投稿'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {comment.userName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {comment.userName || 'ユーザー'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 ml-10">{comment.content}</p>
                </div>
                {isAuthenticated && userId === comment.userId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                  >
                    削除
                  </button>
                )}
              </div>
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-10 mt-4 space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {reply.userName?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            {reply.userName || 'ユーザー'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatRelativeTime(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 ml-8">{reply.content}</p>
                      </div>
                      {isAuthenticated && userId === reply.userId && (
                        <button
                          onClick={() => handleDelete(reply.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          コメントがありません。最初のコメントを投稿しましょう！
        </div>
      )}
    </div>
  )
}

