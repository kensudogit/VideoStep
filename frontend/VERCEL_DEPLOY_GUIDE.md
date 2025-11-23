# Vercel完全公開デプロイガイド

このガイドでは、VideoStepフロントエンドをVercelに完全公開モードでデプロイする手順を説明します。

## 前提条件

1. Vercelアカウント（[https://vercel.com](https://vercel.com) で無料アカウント作成）
2. Node.js 18以上がインストールされていること
3. Gitリポジトリが設定されていること（推奨）

## 方法1: Vercel CLIを使用したデプロイ（推奨）

### ステップ1: Vercel CLIのインストール

```bash
npm install -g vercel
```

### ステップ2: Vercelにログイン

```bash
vercel login
```

ブラウザが開き、Vercelアカウントでログインします。

### ステップ3: プロジェクトディレクトリに移動

```bash
cd C:\devlop\VideoStep\frontend
```

### ステップ4: 環境変数の設定

VercelダッシュボードまたはCLIで以下の環境変数を設定します：

```bash
# Vercel CLIで環境変数を設定
vercel env add NEXT_PUBLIC_API_BASE_URL production
# プロンプトが表示されたら、RailwayのAPI URLを入力
# 例: https://your-api.railway.app

# 開発環境用（オプション）
vercel env add NEXT_PUBLIC_API_BASE_URL development
# 開発環境のURLを入力（例: http://localhost:8080）

# Mockデータを強制的に使用する場合（オプション）
vercel env add NEXT_PUBLIC_USE_MOCK_DATA production
# 値: true または false
```

### ステップ5: 初回デプロイ

```bash
vercel --prod
```

初回デプロイ時は、以下の質問に答えます：

- **Set up and deploy "~/devlop/VideoStep/frontend"?** → `Y`
- **Which scope do you want to deploy to?** → あなたのアカウントを選択
- **Link to existing project?** → `N`（新規プロジェクトの場合）
- **What's your project's name?** → `videostep-frontend`（または任意の名前）
- **In which directory is your code located?** → `./`（現在のディレクトリ）

### ステップ6: デプロイの確認

デプロイが完了すると、以下のようなURLが表示されます：

```
✅ Production: https://your-project.vercel.app
```

## 方法2: GitHub連携を使用したデプロイ

### ステップ1: GitHubリポジトリにプッシュ

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### ステップ2: Vercelダッシュボードでプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. **Add New...** → **Project** をクリック
3. GitHubリポジトリを選択
4. **Import** をクリック

### ステップ3: プロジェクト設定

- **Framework Preset**: Next.js（自動検出されるはず）
- **Root Directory**: `frontend`（リポジトリのルートが`frontend`の場合）
- **Build Command**: `npm run build`（自動設定されるはず）
- **Output Directory**: `.next`（自動設定されるはず）

### ステップ4: 環境変数の設定

**Settings** → **Environment Variables** で以下を追加：

| 名前 | 値 | 環境 |
|------|-----|------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-api.railway.app` | Production, Preview, Development |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `false` | Production（本番環境では通常false） |

### ステップ5: デプロイ

**Deploy** ボタンをクリックしてデプロイを開始します。

## 環境変数の説明

### NEXT_PUBLIC_API_BASE_URL

バックエンドAPIのベースURLを設定します。

- **本番環境**: RailwayのAPI URL（例: `https://your-api.railway.app`）
- **開発環境**: `http://localhost:8080`

### NEXT_PUBLIC_USE_MOCK_DATA

Mockデータを強制的に使用するかどうかを設定します。

- `true`: 常にmockデータを使用（開発・デモ用）
- `false`: APIが利用可能な場合はAPIを使用（本番環境推奨）

## デプロイ後の確認事項

1. **サイトが正常に表示されるか確認**
   - デプロイされたURLにアクセス
   - エラーがないか確認

2. **API接続の確認**
   - ログイン機能が動作するか確認
   - 動画一覧が表示されるか確認

3. **パフォーマンスの確認**
   - Vercelダッシュボードでパフォーマンスメトリクスを確認
   - ページ読み込み速度を確認

## トラブルシューティング

### ビルドエラーが発生する場合

```bash
# ローカルでビルドをテスト
npm run build
```

エラーが発生する場合は、エラーメッセージを確認して修正してください。

### 環境変数が反映されない場合

1. Vercelダッシュボードで環境変数が正しく設定されているか確認
2. 環境変数の名前が`NEXT_PUBLIC_`で始まっているか確認（Next.jsの公開環境変数は`NEXT_PUBLIC_`プレフィックスが必要）
3. デプロイを再実行

### 画像が表示されない場合

`next.config.js`の`remotePatterns`に画像ホストを追加してください。

## カスタムドメインの設定（オプション）

1. Vercelダッシュボードでプロジェクトを開く
2. **Settings** → **Domains** を選択
3. カスタムドメインを追加
4. DNS設定を更新（Vercelの指示に従う）

## 継続的デプロイ（CI/CD）

GitHub連携を使用している場合、`main`ブランチへのプッシュで自動的にデプロイされます。

- **Production**: `main`ブランチへのマージ
- **Preview**: プルリクエストや他のブランチへのプッシュ

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

