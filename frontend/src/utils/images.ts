/**
 * サンプル画像のURLを生成するユーティリティ
 */

/**
 * 動画IDに基づいてサンプル画像URLを生成
 * Picsum Photosを使用（無料のプレースホルダー画像サービス）
 */
export function getSampleThumbnail(videoId?: number, width: number = 640, height: number = 360): string {
  const seed = videoId || Math.floor(Math.random() * 1000)
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

/**
 * カテゴリに基づいたサンプル画像URLを生成
 */
export function getCategoryThumbnail(category?: string, width: number = 640, height: number = 360): string {
  const categories: Record<string, number> = {
    '技術': 100,
    '教育': 200,
    '料理': 300,
    '音楽': 400,
    'スポーツ': 500,
    '旅行': 600,
    'ビジネス': 700,
    'エンターテイメント': 800,
  }
  const seed = category ? categories[category] || 100 : 100
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

/**
 * 動画のサムネイルURLを取得（サムネイルがない場合はサンプル画像を返す）
 */
export function getVideoThumbnail(video: { thumbnailUrl?: string; id?: number; category?: string }): string {
  if (video.thumbnailUrl) {
    return video.thumbnailUrl
  }
  // カテゴリがある場合はカテゴリベース、ない場合はIDベース
  if (video.category) {
    return getCategoryThumbnail(video.category)
  }
  return getSampleThumbnail(video.id)
}

