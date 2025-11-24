# Vercel完全公開モードデプロイ（Mockデータ有効）

## 概要
このドキュメントでは、mockサンプル動画データを使用してVercelに完全公開モードでデプロイする方法を説明します。

## 前提条件
- Node.js 18以上がインストールされていること
- npm 9以上がインストールされていること
- Vercelアカウントがあること

## デプロイ方法

### 方法1: 自動デプロイスクリプト（推奨）

1. `deploy-vercel-public-mock.bat`を実行：
   ```cmd
   deploy-vercel-public-mock.bat
   ```

2. プロンプトに従って操作

### 方法2: Vercel CLIを使用（手動）

1. Vercel CLIをインストール（未インストールの場合）：
   ```bash
   npm install -g vercel
   ```

2. Vercelにログイン：
   ```bash
   vercel login
   ```

3. プロジェクトディレクトリに移動：
   ```cmd
   cd C:\devlop\VideoStep\frontend
   ```

4. ビルドテスト：
   ```bash
   npm run build
   ```

5. デプロイ：
   ```bash
   vercel --prod
   ```

6. 環境変数を設定：
   - Vercelダッシュボードにアクセス
   - プロジェクトのSettings > Environment Variables
   - 以下を追加：
     - Name: `NEXT_PUBLIC_USE_MOCK_DATA`
     - Value: `true`
     - Environment: Production, Preview, Development すべてにチェック

7. 再デプロイ（環境変数を反映）：
   ```bash
   vercel --prod
   ```

### 方法3: Vercelダッシュボード（GitHub連携）

1. Vercelダッシュボード（https://vercel.com）にログイン

2. "Add New Project"をクリック

3. GitHubリポジトリを選択（またはインポート）

4. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. 環境変数を追加：
   - "Environment Variables"セクションで以下を追加：
     - Name: `NEXT_PUBLIC_USE_MOCK_DATA`
     - Value: `true`
     - Environment: Production, Preview, Development すべてにチェック

6. "Deploy"をクリック

## 重要な設定

### 環境変数
以下の環境変数が必須です：

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `NEXT_PUBLIC_USE_MOCK_DATA` | `true` | Mockデータを有効化 |

### Vercel設定（vercel.json）
現在の`vercel.json`の設定：
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Clean URLs: 有効
- セキュリティヘッダー: 設定済み

## デプロイ後の確認

1. **デプロイURLにアクセス**
   - VercelダッシュボードでデプロイURLを確認
   - 例: `https://your-project.vercel.app`

2. **ブラウザの開発者ツールで確認**
   - F12キーで開発者ツールを開く
   - Consoleタブで以下を確認：
     ```
     [Mock Data] NEXT_PUBLIC_USE_MOCK_DATA=true が設定されています。mockデータを使用します。
     [Mock Data] Using mock data for endpoint: /api/videos/public
     ```

3. **ページの動作確認**
   - トップページ: 動画一覧が表示される
   - 動画詳細ページ: 動画が再生される
   - 検索機能: キーワード検索が動作する
   - カテゴリフィルター: カテゴリ別表示が動作する

## トラブルシューティング

### ビルドエラーが発生する場合

1. **依存関係の再インストール**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **キャッシュのクリア**
   ```bash
   rm -rf .next
   npm run build
   ```

3. **Node.jsバージョンの確認**
   - `package.json`で指定されているNode.jsバージョン（18以上）を使用

### Mockデータが表示されない場合

1. **環境変数の確認**
   - Vercelダッシュボードで`NEXT_PUBLIC_USE_MOCK_DATA=true`が設定されているか確認
   - Production, Preview, Developmentすべてに設定されているか確認

2. **再デプロイ**
   - 環境変数を変更した場合は、再デプロイが必要です

3. **ブラウザのキャッシュをクリア**
   - Ctrl+Shift+Deleteでキャッシュをクリア
   - ハードリロード（Ctrl+F5）

### デプロイが失敗する場合

1. **Root Directoryの確認**
   - VercelダッシュボードでRoot Directoryが`frontend`に設定されているか確認

2. **ビルドログの確認**
   - VercelダッシュボードのDeploymentsタブでビルドログを確認
   - エラーメッセージを確認して対応

3. **Vercel CLIでローカルデプロイテスト**
   ```bash
   vercel
   ```

## 完全公開モードの確認

完全公開モードとは、以下の条件を満たす状態です：

- ✅ 認証なしでアクセス可能
- ✅ すべてのページが公開されている
- ✅ Mockデータが使用されている
- ✅ APIエラーが発生しない

## 注意事項

- Mockデータは開発・デモ目的で使用します
- 本番環境で実際のAPIを使用する場合は、環境変数を変更してください
- Mockデータの動画URLは外部のサンプル動画サービスを使用しています
- インターネット接続が必要です

## 次のステップ

デプロイが完了したら：
1. デプロイURLを共有
2. 動作確認を実施
3. 必要に応じてカスタマイズ

