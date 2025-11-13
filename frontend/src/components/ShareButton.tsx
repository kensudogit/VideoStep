'use client'

import { useState } from 'react'

interface ShareButtonProps {
  videoId: number
  title: string
}

export default function ShareButton({ videoId, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/videos/${videoId}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `VideoStepで動画を見る: ${title}`,
          url: url,
        })
      } catch (error) {
        // ユーザーが共有をキャンセルした場合など
        console.log('Share cancelled')
      }
    } else {
      // フォールバック: クリップボードにコピー
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      <span>{copied ? 'コピーしました！' : '共有'}</span>
    </button>
  )
}

