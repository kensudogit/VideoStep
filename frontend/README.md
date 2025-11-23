# VideoStep Frontend

VideoStepは、熟練技術者のノウハウ継承や外国人教育を支援する次世代動画共有プラットフォームです。

## 技術スタック

- **Framework**: Next.js 14.0.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Video Player**: react-player
- **Testing**: Vitest

## セットアップ

### 必要な環境

- Node.js 18.0.0以上
- npm 9.0.0以上

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## ビルド

```bash
npm run build
```

## デプロイ

### Vercelへのデプロイ

詳細な手順は以下のドキュメントを参照してください：

- **クイックスタート**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- **詳細ガイド**: [VERCEL_DEPLOY_GUIDE.md](./VERCEL_DEPLOY_GUIDE.md)

#### 最短手順

1. Vercel CLIをインストール
   ```bash
   npm install -g vercel
   ```

2. ログイン
   ```bash
   vercel login
   ```

3. 環境変数を設定
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL production
   # RailwayのAPI URLを入力
   ```

4. デプロイ
   ```bash
   vercel --prod
   ```

または、Windowsの場合は：

```bash
deploy-vercel.bat
```

## 環境変数

### 必須

- `NEXT_PUBLIC_API_BASE_URL`: バックエンドAPIのベースURL
  - 本番環境: `https://your-api.railway.app`
  - 開発環境: `http://localhost:8080`

### オプション

- `NEXT_PUBLIC_USE_MOCK_DATA`: Mockデータを強制的に使用するか
  - `true`: 常にmockデータを使用
  - `false`: APIが利用可能な場合はAPIを使用（デフォルト）

## プロジェクト構造

```
frontend/
├── src/
│   ├── app/              # Next.js App Router ページ
│   ├── components/       # React コンポーネント
│   ├── hooks/            # カスタムフック
│   ├── store/            # Zustand ストア
│   └── utils/            # ユーティリティ関数
├── public/               # 静的ファイル
├── vercel.json           # Vercel設定
└── package.json
```

## 主な機能

- ✅ 動画のアップロード・再生
- ✅ ユーザー認証（ログイン・登録）
- ✅ 動画一覧・検索・フィルタリング
- ✅ ページネーション
- ✅ お気に入り・プレイリスト
- ✅ コメント機能
- ✅ 多言語翻訳対応
- ✅ レスポンシブデザイン

## テスト

```bash
# テスト実行
npm test

# テスト（UI付き）
npm run test:ui

# カバレッジ
npm run test:coverage
```

## ライセンス

Private

## サポート

問題が発生した場合は、以下のドキュメントを参照してください：

- [VERCEL_DEPLOY_GUIDE.md](./VERCEL_DEPLOY_GUIDE.md)
- [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md)

