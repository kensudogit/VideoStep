// Mock data for development and demo purposes

export interface MockVideo {
  id: number
  title: string
  description: string
  thumbnailUrl?: string
  videoUrl?: string
  category?: string
  tags?: string[]
  views: number
  likes: number
  viewCount?: number
  likeCount?: number
  duration: number
  createdAt: string
  userId: number
  userName: string
  isPublic: boolean
}

export interface MockUser {
  id: number
  name: string
  email: string
}

export interface MockComment {
  id: number
  content: string
  userId: number
  userName: string
  createdAt: string
  likes: number
}

// Mock videos data
export const mockVideos: MockVideo[] = [
  {
    id: 1,
    title: '製造業の基礎技術 - 溶接の基本',
    description: '熟練技術者が教える溶接の基本技術と安全対策について詳しく解説します。',
    category: '製造業',
    tags: ['技術', '溶接', '安全'],
    views: 1250,
    likes: 45,
    duration: 1200,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 1,
    userName: '技術者 太郎',
    isPublic: true,
    viewCount: 1250,
    likeCount: 45,
  },
  {
    id: 2,
    title: '多言語対応の重要性 - 外国人労働者への教育',
    description: '多様な言語背景を持つ労働者への効果的な教育方法を紹介します。',
    category: '教育',
    tags: ['教育', '多言語', 'コミュニケーション'],
    views: 890,
    likes: 32,
    duration: 900,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 2,
    userName: '教育者 花子',
    isPublic: true,
    viewCount: 890,
    likeCount: 32,
  },
  {
    id: 3,
    title: '品質管理のベストプラクティス',
    description: '製造現場での品質管理の実践的な方法を解説します。',
    category: '製造業',
    tags: ['品質管理', '製造', 'ベストプラクティス'],
    views: 2100,
    likes: 78,
    duration: 1500,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 3,
    userName: '品質管理者 次郎',
    isPublic: true,
    viewCount: 2100,
    likeCount: 78,
  },
  {
    id: 4,
    title: '安全作業の基本 - 個人保護具の正しい使い方',
    description: '作業現場での安全を守るための個人保護具の正しい使用方法を説明します。',
    category: '安全',
    tags: ['安全', '個人保護具', '作業'],
    views: 1560,
    likes: 56,
    duration: 800,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 1,
    userName: '技術者 太郎',
    isPublic: true,
    viewCount: 1560,
    likeCount: 56,
  },
  {
    id: 5,
    title: '機械メンテナンスの基礎',
    description: '製造機械の日常メンテナンスとトラブルシューティングの方法を解説します。',
    category: '製造業',
    tags: ['メンテナンス', '機械', 'トラブルシューティング'],
    views: 980,
    likes: 41,
    duration: 1100,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 4,
    userName: 'メンテナンス技師 三郎',
    isPublic: true,
    viewCount: 980,
    likeCount: 41,
  },
  {
    id: 6,
    title: 'コミュニケーションスキル - チームワークの向上',
    description: '多様な背景を持つチームでの効果的なコミュニケーション方法を学びます。',
    category: '教育',
    tags: ['コミュニケーション', 'チームワーク', 'スキル'],
    views: 720,
    likes: 28,
    duration: 950,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 2,
    userName: '教育者 花子',
    isPublic: true,
    viewCount: 720,
    likeCount: 28,
  },
  {
    id: 7,
    title: '効率的な作業フローの設計',
    description: '製造現場での作業効率を向上させるフロー設計のポイントを解説します。',
    category: '製造業',
    tags: ['効率化', 'フロー設計', '製造'],
    views: 1340,
    likes: 52,
    duration: 1300,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 3,
    userName: '品質管理者 次郎',
    isPublic: true,
    viewCount: 1340,
    likeCount: 52,
  },
  {
    id: 8,
    title: '環境に配慮した製造プロセス',
    description: '持続可能な製造プロセスの実現に向けた取り組みを紹介します。',
    category: '環境',
    tags: ['環境', '持続可能性', '製造'],
    views: 650,
    likes: 24,
    duration: 1000,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 5,
    userName: '環境管理者 四郎',
    isPublic: true,
    viewCount: 650,
    likeCount: 24,
  },
]

// Mock users data
export const mockUsers: MockUser[] = [
  { id: 1, name: '技術者 太郎', email: 'taro@example.com' },
  { id: 2, name: '教育者 花子', email: 'hanako@example.com' },
  { id: 3, name: '品質管理者 次郎', email: 'jiro@example.com' },
  { id: 4, name: 'メンテナンス技師 三郎', email: 'saburo@example.com' },
  { id: 5, name: '環境管理者 四郎', email: 'shiro@example.com' },
]

// Mock comments data
export const mockComments: Record<number, MockComment[]> = {
  1: [
    {
      id: 1,
      content: 'とても参考になりました！',
      userId: 2,
      userName: '教育者 花子',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 5,
    },
    {
      id: 2,
      content: '実践的な内容で助かります。',
      userId: 3,
      userName: '品質管理者 次郎',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 3,
    },
  ],
  2: [
    {
      id: 3,
      content: '多言語対応の重要性がよくわかりました。',
      userId: 1,
      userName: '技術者 太郎',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 4,
    },
  ],
}

// Check if we should use mock data
export const shouldUseMockData = (): boolean => {
  if (typeof window === 'undefined') return false
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
  // Use mock data if API URL is not set or is localhost in production
  return !apiUrl || apiUrl.includes('localhost') || apiUrl === ''
}

