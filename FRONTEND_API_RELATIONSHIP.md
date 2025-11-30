# フロントエンド画面とAPIの関係

## 概要

このドキュメントでは、`npm run dev`で起動するフロントエンド画面と、バックエンドAPI（Video Service）の関係を説明します。

## アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────┐
│  ブラウザ (ユーザー)                                         │
│  http://localhost:3000                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPリクエスト
                     │ (fetch API)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js フロントエンド (npm run dev)                       │
│  http://localhost:3000                                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 画面コンポーネント (page.tsx)                        │  │
│  │ - /videos/page.tsx                                   │  │
│  │ - /videos/[id]/page.tsx                             │  │
│  │ - /videos/search/page.tsx                            │  │
│  │ - /videos/popular/page.tsx                          │  │
│  │ - /favorites/page.tsx                               │  │
│  │ - /playlists/page.tsx                               │  │
│  │ - /notifications/page.tsx                            │  │
│  │ - /history/page.tsx                                  │  │
│  └──────────────┬──────────────────────────────────────┘  │
│                 │                                          │
│                 │ apiRequest() 呼び出し                    │
│                 ▼                                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ APIユーティリティ (utils/api.ts)                    │  │
│  │ - apiRequest()                                       │  │
│  │ - getPublicVideos()                                  │  │
│  │ - getVideoById()                                     │  │
│  │ - searchVideos()                                     │  │
│  │ - getPopularVideos()                                 │  │
│  │ - getFavorites()                                     │  │
│  │ - getPlaylists()                                     │  │
│  │ - getNotifications()                                 │  │
│  │ - getWatchHistory()                                  │  │
│  └──────────────┬──────────────────────────────────────┘  │
└─────────────────┼─────────────────────────────────────────┘
                  │
                  │ HTTPリクエスト
                  │ API_BASE_URL + endpoint
                  │ (デフォルト: http://localhost:8080)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  API Gateway (Spring Cloud Gateway)                        │
│  http://localhost:8080                                      │
│                                                             │
│  /api/videos/** → Video Service                            │
│  /api/playlists/** → Video Service                         │
│  /api/notifications/** → Video Service                     │
└────────────────────┬───────────────────────────────────────┘
                     │
                     │ サービスディスカバリー (Eureka)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Video Service (Spring Boot)                               │
│  http://localhost:8082                                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ REST API エンドポイント                             │  │
│  │ - GET  /videos/public                               │  │
│  │ - GET  /videos/{id}                                 │  │
│  │ - GET  /videos/search?keyword={keyword}             │  │
│  │ - GET  /videos/recommendations/popular              │  │
│  │ - GET  /videos/favorites                            │  │
│  │ - GET  /playlists                                   │  │
│  │ - GET  /notifications                               │  │
│  │ - GET  /videos/history                              │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 画面とAPIの対応関係

### 1. 公開動画一覧ページ

**画面**: `/videos/page.tsx`  
**URL**: `http://localhost:3000/videos`  
**APIエンドポイント**: `GET /api/videos/public?page={page}&size={size}`

```typescript
// 画面での使用例
const fetchVideos = async (page: number, size: number) => {
  const { apiRequest } = await import('@/utils/api')
  const data = await apiRequest<any[]>(`/api/videos/public?page=${page}&size=${size}`)
  // データを画面に表示
}
```

**フロー**:
1. ユーザーが `/videos` にアクセス
2. 画面コンポーネントが `apiRequest('/api/videos/public')` を呼び出し
3. APIユーティリティが `http://localhost:8080/api/videos/public` にリクエスト
4. API GatewayがリクエストをVideo Serviceに転送
5. Video Serviceがデータを返す
6. 画面に動画一覧を表示

### 2. 動画詳細ページ

**画面**: `/videos/[id]/page.tsx`  
**URL**: `http://localhost:3000/videos/1`  
**APIエンドポイント**: `GET /api/videos/{id}`

```typescript
// 画面での使用例
const fetchVideo = async () => {
  const { apiRequest } = await import('@/utils/api')
  const data = await apiRequest<any>(`/api/videos/${params.id}`)
  // 動画詳細を表示
}
```

### 3. 動画検索ページ

**画面**: `/videos/search/page.tsx`  
**URL**: `http://localhost:3000/videos/search?keyword=検索語`  
**APIエンドポイント**: `GET /api/videos/search?keyword={keyword}&page={page}&size={size}`

```typescript
// 画面での使用例
const fetchVideos = async (page: number, size: number) => {
  const { apiRequest } = await import('@/utils/api')
  const endpoint = `/api/videos/search?keyword=${encodeURIComponent(searchKeyword)}&page=${page}&size=${size}`
  const data = await apiRequest<any[]>(endpoint)
  // 検索結果を表示
}
```

### 4. 人気動画ページ

**画面**: `/videos/popular/page.tsx`  
**URL**: `http://localhost:3000/videos/popular`  
**APIエンドポイント**: `GET /api/videos/recommendations/popular?limit={limit}`

```typescript
// 画面での使用例
const fetchPopularVideos = async () => {
  const { apiRequest } = await import('@/utils/api')
  const data = await apiRequest<Video[]>(`/api/videos/recommendations/popular?limit=50`)
  // 人気動画を表示
}
```

### 5. お気に入り一覧ページ

**画面**: `/favorites/page.tsx`  
**URL**: `http://localhost:3000/favorites`  
**APIエンドポイント**: `GET /api/videos/favorites` (認証必要)

```typescript
// 画面での使用例
const fetchFavorites = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/videos/favorites`,
    {
      headers: {
        'X-User-Id': userId?.toString() || '',
        'Authorization': `Bearer ${token}`,
      },
    }
  )
  // お気に入り動画を表示
}
```

### 6. プレイリスト一覧ページ

**画面**: `/playlists/page.tsx`  
**URL**: `http://localhost:3000/playlists`  
**APIエンドポイント**: `GET /api/playlists` (認証必要)

### 7. 通知一覧ページ

**画面**: `/notifications/page.tsx`  
**URL**: `http://localhost:3000/notifications`  
**APIエンドポイント**: `GET /api/notifications` (認証必要)

### 8. 視聴履歴ページ

**画面**: `/history/page.tsx`  
**URL**: `http://localhost:3000/history`  
**APIエンドポイント**: `GET /api/videos/history` (認証必要)

## APIリクエストの流れ

### 1. 画面コンポーネントでの呼び出し

```typescript
// 例: /videos/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { apiRequest } from '@/utils/api'

export default function VideosPage() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    // APIユーティリティを使用してデータを取得
    const data = await apiRequest<any[]>('/api/videos/public?page=0&size=12')
    if (data.success && data.data) {
      setVideos(data.data)
    }
  }

  return (
    <div>
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
```

### 2. APIユーティリティでの処理

```typescript
// utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  // 1. Mockデータを使用するか判定
  const useMock = shouldUseMockData() || !isApiAvailable()
  
  if (useMock) {
    // Mockデータを返す
    return getMockResponse<T>(endpoint)
  }

  // 2. 実際のAPIにリクエスト
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    // エラー時はMockデータにフォールバック
    return getMockResponse<T>(endpoint)
  }
}
```

### 3. API Gateway経由でのリクエスト

```
フロントエンド → API Gateway (localhost:8080) → Video Service (localhost:8082)
```

**リクエスト例**:
```
GET http://localhost:8080/api/videos/public?page=0&size=12
```

**API Gatewayのルーティング**:
- `/api/videos/**` → Video Service (`http://localhost:8082/videos/**`)
- `/api/playlists/**` → Video Service (`http://localhost:8082/playlists/**`)
- `/api/notifications/**` → Video Service (`http://localhost:8082/notifications/**`)

## 環境変数の設定

### フロントエンドの環境変数

**`.env.local`** (開発環境):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_DATA=false
```

**設定の優先順位**:
1. `NEXT_PUBLIC_USE_MOCK_DATA=true` → 常にMockデータを使用
2. `NEXT_PUBLIC_API_BASE_URL` が未設定または `localhost` → Mockデータを使用
3. それ以外 → 実際のAPIを使用（タイムアウト時はMockデータにフォールバック）

### APIベースURLの設定

```typescript
// utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
```

**デフォルト値**: `http://localhost:8080` (API Gateway)

## Mockデータのフォールバック

### 動作の流れ

1. **APIリクエスト実行**
   - `apiRequest()` が実際のAPIにリクエストを送信

2. **タイムアウトまたはエラー**
   - 3秒以内に応答がない場合
   - ネットワークエラーが発生した場合
   - 500エラーが返された場合

3. **Mockデータにフォールバック**
   - `getMockResponse()` が呼び出される
   - エンドポイントに応じたMockデータを返す
   - ユーザーにはエラーを表示しない

### Mockデータの例

```typescript
// utils/api.ts
function getMockResponse<T>(endpoint: string): ApiResponse<T> {
  // 公開動画一覧
  if (endpoint.includes('/api/videos/public')) {
    return {
      success: true,
      data: mockVideos as T,
      pagination: { page: 0, size: 12, total: mockVideos.length, totalPages: 1 }
    }
  }
  
  // 動画詳細
  if (endpoint.includes('/api/videos/') && endpoint.match(/\/api\/videos\/\d+$/)) {
    const videoId = parseInt(endpoint.split('/').pop() || '1')
    const video = mockVideos.find(v => v.id === videoId) || mockVideos[0]
    return {
      success: true,
      data: video as T
    }
  }
  
  // その他のエンドポイント...
}
```

## 認証が必要なAPI

### 認証トークンの使用

```typescript
// 認証が必要なAPIリクエスト
const { apiRequestWithAuth } = await import('@/utils/api')
const token = useAuthStore.getState().token
const userId = useAuthStore.getState().userId

const data = await apiRequestWithAuth<any[]>(
  '/api/videos/favorites',
  token || '',
  userId || 0
)
```

### 認証ヘッダー

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'X-User-Id': userId.toString(),
}
```

## 画面とAPIの完全対応表

| 画面パス | 画面ファイル | APIエンドポイント | 認証 | ページネーション |
|---------|------------|------------------|------|----------------|
| `/videos` | `videos/page.tsx` | `GET /api/videos/public` | ❌ | ✅ |
| `/videos/[id]` | `videos/[id]/page.tsx` | `GET /api/videos/{id}` | ❌ | ❌ |
| `/videos/search` | `videos/search/page.tsx` | `GET /api/videos/search` | ❌ | ✅ |
| `/videos/user/[userId]` | `videos/user/[userId]/page.tsx` | `GET /api/videos/user/{userId}` | ⚠️ | ✅ |
| `/videos/category/[category]` | `videos/category/[category]/page.tsx` | `GET /api/videos/category/{category}` | ❌ | ✅ |
| `/videos/popular` | `videos/popular/page.tsx` | `GET /api/videos/recommendations/popular` | ❌ | ❌ |
| `/videos/latest` | `videos/latest/page.tsx` | `GET /api/videos/recommendations/latest` | ❌ | ❌ |
| `/videos/recommendations/category/[category]` | `videos/recommendations/category/[category]/page.tsx` | `GET /api/videos/recommendations/category/{category}` | ❌ | ❌ |
| `/videos/related/[videoId]` | `videos/related/[videoId]/page.tsx` | `GET /api/videos/recommendations/related/{videoId}` | ❌ | ❌ |
| `/favorites` | `favorites/page.tsx` | `GET /api/videos/favorites` | ✅ | ❌ |
| `/playlists` | `playlists/page.tsx` | `GET /api/playlists` | ✅ | ❌ |
| `/playlists/[id]` | `playlists/[id]/page.tsx` | `GET /api/playlists/{id}` | ⚠️ | ❌ |
| `/playlists/public` | `playlists/public/page.tsx` | `GET /api/playlists/public` | ❌ | ✅ |
| `/notifications` | `notifications/page.tsx` | `GET /api/notifications` | ✅ | ❌ |
| `/history` | `history/page.tsx` | `GET /api/videos/history` | ✅ | ❌ |

**凡例**:
- ❌ = 不要
- ✅ = 必要
- ⚠️ = オプション（認証時は追加情報を取得可能）

## 開発時の動作

### 1. フロントエンドのみ起動

```bash
cd frontend
npm run dev
```

**動作**:
- フロントエンド: `http://localhost:3000` で起動
- API: 未起動のため、すべてMockデータを使用
- 画面は正常に表示される（Mockデータで動作）

### 2. フロントエンド + API Gateway + Video Service起動

```bash
# Docker Composeで全サービス起動
docker-compose up -d

# フロントエンド起動
cd frontend
npm run dev
```

**動作**:
- フロントエンド: `http://localhost:3000` で起動
- API Gateway: `http://localhost:8080` で起動
- Video Service: `http://localhost:8082` で起動
- 画面は実際のAPIからデータを取得して表示

### 3. 環境変数の設定

**`.env.local`** を作成:
```env
# 実際のAPIを使用
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_DATA=false
```

または

```env
# 強制的にMockデータを使用
NEXT_PUBLIC_USE_MOCK_DATA=true
```

## まとめ

1. **画面コンポーネント** (`page.tsx`) がユーザーインターフェースを提供
2. **APIユーティリティ** (`utils/api.ts`) がAPIリクエストを処理
3. **API Gateway** (`localhost:8080`) がリクエストをルーティング
4. **Video Service** (`localhost:8082`) が実際のデータを返す
5. **Mockデータ** がAPIが利用できない場合のフォールバックとして機能

このアーキテクチャにより、フロントエンドはAPIが利用できない場合でも動作し、開発を継続できます。

