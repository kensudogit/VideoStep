'use client'

interface VideoSortProps {
  sortBy: string
  onSortChange: (sortBy: string) => void
}

export default function VideoSort({ sortBy, onSortChange }: VideoSortProps) {
  const sortOptions = [
    { value: 'latest', label: '最新順' },
    { value: 'popular', label: '人気順' },
    { value: 'views', label: '視聴回数順' },
    { value: 'likes', label: 'いいね順' },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">並び替え:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white text-sm font-medium"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

