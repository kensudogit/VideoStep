# 🚀 Vercel完全公開モードデプロイ - 実行手順

## 方法1: 自動デプロイスクリプト（推奨）

### ステップ1: デプロイスクリプトを実行

```cmd
cd C:\devlop\VideoStep\frontend
EXECUTE_DEPLOY.bat
```

または

```cmd
cd C:\devlop\VideoStep\frontend
deploy-vercel-public-mock.bat
```

### ステップ2: 環境変数を設定（必須）

デプロイが完了したら、**必ず**以下を実行してください：

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/dashboard
   - ログイン（必要に応じて）

2. **プロジェクトを選択**
   - デプロイしたプロジェクトをクリック

3. **環境変数を設定**
   - 左メニューから **Settings** をクリック
   - **Environment Variables** をクリック
   - **Add New** をクリック
   - 以下を入力：
     - **Name**: `NEXT_PUBLIC_USE_MOCK_DATA`
     - **Value**: `true`
     - **Environment**: 
       - ✅ Production
       - ✅ Preview
       - ✅ Development
   - **Save** をクリック

4. **再デプロイ**
   - 左メニューから **Deployments** をクリック
   - 最新のデプロイを選択
   - **...** メニューから **Redeploy** をクリック

## 方法2: Vercelダッシュボードで手動デプロイ

### ステップ1: プロジェクトをインポート

1. Vercelダッシュボード（https://vercel.com）にアクセス
2. **Add New Project** をクリック
3. GitHubリポジトリを選択（またはインポート）

### ステップ2: プロジェクト設定

以下の設定を入力：

- **Framework Preset**: Next.js
- **Root Directory**: `frontend` ⚠️ 重要
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### ステップ3: 環境変数を設定

**デプロイ前に**環境変数を追加：

1. **Environment Variables** セクションで以下を追加：
   - **Name**: `NEXT_PUBLIC_USE_MOCK_DATA`
   - **Value**: `true`
   - **Environment**: Production, Preview, Development すべて

### ステップ4: デプロイ

**Deploy** ボタンをクリック

## 動作確認

デプロイ完了後：

1. **デプロイURLにアクセス**
   - Vercelダッシュボードで表示されるURL
   - 例: `https://your-project.vercel.app`

2. **ブラウザの開発者ツールで確認**
   - F12キーで開発者ツールを開く
   - **Console** タブを開く
   - 以下が表示されれば成功：
     ```
     [Mock Data] NEXT_PUBLIC_USE_MOCK_DATA=true が設定されています。mockデータを使用します。
     [Mock Data] Using mock data for endpoint: /api/videos/public
     ```

3. **ページの動作確認**
   - ✅ トップページ: 動画一覧が表示される
   - ✅ 動画詳細: 動画が再生される
   - ✅ 検索機能: キーワード検索が動作する
   - ✅ カテゴリフィルター: カテゴリ別表示が動作する

## トラブルシューティング

### Vercel CLIがインストールされていない

```cmd
npm install -g vercel
vercel login
```

### ビルドエラーが発生する

```cmd
cd C:\devlop\VideoStep\frontend
rmdir /s /q .next
npm install
npm run build
```

### 環境変数が反映されない

- 環境変数を設定した後、**必ず再デプロイ**してください
- Production, Preview, Developmentすべてに設定されているか確認
- ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）

### Root Directoryエラー

- Vercelダッシュボードで **Settings** > **General**
- **Root Directory** を `frontend` に設定
- 再デプロイ

## 完了！

デプロイが完了すると、誰でもアクセス可能な完全公開モードのサイトが利用できます。

Mockサンプル動画データ（20個）が自動的に表示されます。
