# Mockデータを使用したVercelデプロイ

## 概要

バックエンドAPIがなくても動作するように、mockデータを実装しました。これにより、Vercelに完全公開モードでデプロイできます。

## 実装内容

### 1. Mockデータの実装

- **ファイル**: `src/utils/mockData.ts`
- **内容**: 
  - 8つのサンプル動画データ
  - ユーザーデータ
  - コメントデータ

### 2. APIリクエストの修正

- **ファイル**: `src/utils/api.ts`
- **変更点**:
  - APIが利用できない場合、自動的にmockデータを返す
  - `NEXT_PUBLIC_API_BASE_URL`が設定されていない、または`localhost`の場合はmockデータを使用

### 3. ページの修正

以下のページで`apiRequest`を使用するように修正：
- `src/app/page.tsx` (ホームページ)
- `src/app/videos/page.tsx` (動画一覧)
- `src/app/videos/[id]/page.tsx` (動画詳細)

## デプロイ手順

### 方法1: Vercel CLIを使用

```bash
cd frontend
vercel --prod --yes
```

### 方法2: Vercelダッシュボードを使用

1. https://vercel.com にアクセス
2. プロジェクトを選択
3. "Deployments" タブで "Redeploy" をクリック

## Mockデータの動作

### 条件

Mockデータは以下の条件で使用されます：

1. `NEXT_PUBLIC_API_BASE_URL`環境変数が設定されていない
2. `NEXT_PUBLIC_API_BASE_URL`が`localhost`を含む
3. APIリクエストが失敗した場合（フォールバック）

### サポートされているエンドポイント

- `GET /api/videos/public` - 公開動画一覧
- `GET /api/videos/:id` - 動画詳細
- `GET /api/videos/:id/comments` - コメント一覧

## 環境変数の設定

**重要**: Mockデータを使用する場合は、`NEXT_PUBLIC_API_BASE_URL`環境変数を**設定しない**でください。

もし後でバックエンドAPIを接続する場合は：

1. Vercelダッシュボードで環境変数を設定
2. `NEXT_PUBLIC_API_BASE_URL`にバックエンドAPIのURLを設定
3. 再デプロイ

## デプロイ後の確認

1. デプロイURLにアクセス
2. ホームページで動画一覧が表示されることを確認
3. 動画詳細ページが正常に動作することを確認
4. Mockデータが表示されることを確認

## トラブルシューティング

### Mockデータが表示されない

- ブラウザのコンソールでエラーを確認
- `NEXT_PUBLIC_API_BASE_URL`が設定されていないことを確認
- ネットワークタブでAPIリクエストが失敗していることを確認

### ビルドエラー

- `npm run build`をローカルで実行してエラーを確認
- TypeScriptの型エラーを修正

## 次のステップ

バックエンドAPIを接続する場合：

1. Railway/Render/Fly.ioなどにバックエンドAPIをデプロイ
2. Vercelの環境変数で`NEXT_PUBLIC_API_BASE_URL`を設定
3. 再デプロイ

詳細は`RAILWAY_DEPLOY.md`を参照してください。

