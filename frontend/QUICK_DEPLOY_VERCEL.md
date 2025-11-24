# Vercel完全公開モードデプロイ - クイックガイド

## 実行手順

### ステップ1: デプロイスクリプトを実行

以下のいずれかのスクリプトを実行してください：

**オプションA: 自動デプロイスクリプト（推奨）**
```cmd
deploy-vercel-public-mock.bat
```

**オプションB: 既存のデプロイスクリプト**
```cmd
deploy-vercel-public.bat
```

### ステップ2: Vercelダッシュボードで環境変数を設定

デプロイ後、必ず以下を設定してください：

1. Vercelダッシュボード（https://vercel.com）にログイン
2. プロジェクトを選択
3. Settings > Environment Variables に移動
4. 以下の環境変数を追加：
   - **Name**: `NEXT_PUBLIC_USE_MOCK_DATA`
   - **Value**: `true`
   - **Environment**: Production, Preview, Development すべてにチェック
5. "Save"をクリック
6. 再デプロイ（Deploymentsタブから最新のデプロイを選択し、"Redeploy"をクリック）

### ステップ3: 動作確認

デプロイ完了後：
1. デプロイURLにアクセス
2. ブラウザの開発者ツール（F12）を開く
3. Consoleタブで以下を確認：
   ```
   [Mock Data] NEXT_PUBLIC_USE_MOCK_DATA=true が設定されています。mockデータを使用します。
   [Mock Data] Using mock data for endpoint: /api/videos/public
   ```

## トラブルシューティング

### Vercel CLIがインストールされていない場合

```cmd
npm install -g vercel
vercel login
```

### ビルドエラーが発生する場合

```cmd
cd C:\devlop\VideoStep\frontend
rmdir /s /q .next
npm install
npm run build
```

### 環境変数が反映されない場合

- 環境変数を設定した後、必ず再デプロイしてください
- Production, Preview, Developmentすべてに設定されているか確認してください

## デプロイ後のURL

デプロイが完了すると、以下のようなURLが表示されます：
- Production: `https://your-project.vercel.app`
- Preview: `https://your-project-xxx.vercel.app`

このURLは誰でもアクセス可能です（完全公開モード）。

