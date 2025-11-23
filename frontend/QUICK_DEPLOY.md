# クイックデプロイガイド

## 最短5分でVercelにデプロイ

### ステップ1: Vercel CLIのインストール（初回のみ）

```bash
npm install -g vercel
```

### ステップ2: ログイン

```bash
vercel login
```

### ステップ3: プロジェクトディレクトリに移動

```bash
cd C:\devlop\VideoStep\frontend
```

### ステップ4: 環境変数の設定（本番環境）

```bash
# API URLを設定（RailwayのAPI URLに置き換えてください）
vercel env add NEXT_PUBLIC_API_BASE_URL production
# プロンプトでAPI URLを入力（例: https://your-api.railway.app）

# Mockデータの使用設定（オプション）
vercel env add NEXT_PUBLIC_USE_MOCK_DATA production
# プロンプトで false を入力（本番環境では通常false）
```

### ステップ5: デプロイ実行

```bash
# 本番環境にデプロイ
vercel --prod
```

または、Windowsの場合は：

```bash
deploy-vercel.bat
```

## デプロイ後の確認

デプロイが完了すると、以下のようなURLが表示されます：

```
✅ Production: https://your-project.vercel.app
```

このURLにアクセスして、サイトが正常に表示されるか確認してください。

## トラブルシューティング

### ビルドエラーが発生する場合

```bash
# ローカルでビルドをテスト
npm run build
```

### 環境変数が反映されない場合

1. Vercelダッシュボード（https://vercel.com/dashboard）にアクセス
2. プロジェクトを選択
3. **Settings** → **Environment Variables** で確認

詳細は `VERCEL_DEPLOY_GUIDE.md` を参照してください。
