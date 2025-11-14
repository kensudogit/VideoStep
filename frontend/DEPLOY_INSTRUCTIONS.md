# Vercelデプロイ手順（Mockデータ使用）

## ✅ 準備完了

Mockデータを使用した完全公開モードでのデプロイ準備が完了しました。

## 実装内容

1. **Mockデータ**: 8つのサンプル動画データを実装
2. **自動フォールバック**: APIが利用できない場合、自動的にmockデータを使用
3. **完全公開モード**: バックエンドAPIなしで動作

## デプロイ手順

### 方法1: Vercel CLI（推奨）

```bash
cd C:\devlop\VideoStep\frontend
vercel --prod --yes
```

### 方法2: Vercelダッシュボード

1. https://vercel.com にアクセス
2. ログイン
3. プロジェクト `frontend` を選択
4. "Deployments" タブを開く
5. 最新のデプロイメントの "..." メニューから "Redeploy" をクリック
6. または、GitHubにプッシュすると自動デプロイされます

### 方法3: GitHub連携（自動デプロイ）

1. 変更をGitHubにプッシュ
2. Vercelが自動的に検出してデプロイ

## 重要な設定

### 環境変数

**重要**: Mockデータを使用する場合は、`NEXT_PUBLIC_API_BASE_URL`環境変数を**設定しないでください**。

もし設定されている場合は、Vercelダッシュボードで削除してください：
1. Settings → Environment Variables
2. `NEXT_PUBLIC_API_BASE_URL` を削除
3. 再デプロイ

## Mockデータの動作

Mockデータは以下の条件で自動的に使用されます：

1. `NEXT_PUBLIC_API_BASE_URL`が設定されていない
2. `NEXT_PUBLIC_API_BASE_URL`が`localhost`を含む
3. APIリクエストが失敗した場合（フォールバック）

## サポートされている機能

- ✅ 動画一覧表示（8つのサンプル動画）
- ✅ 動画詳細表示
- ✅ コメント表示（一部の動画）
- ✅ サムネイル画像（自動生成）

## デプロイ後の確認

1. デプロイURLにアクセス
2. ホームページで動画一覧が表示されることを確認
3. 動画をクリックして詳細ページが表示されることを確認
4. Mockデータが正常に表示されることを確認

## トラブルシューティング

### Mockデータが表示されない

1. ブラウザの開発者ツール（F12）を開く
2. Consoleタブでエラーを確認
3. NetworkタブでAPIリクエストの状態を確認
4. `NEXT_PUBLIC_API_BASE_URL`が設定されていないことを確認

### ビルドエラー

1. ローカルでビルドを実行：
   ```bash
   cd frontend
   npm run build
   ```
2. エラーを確認して修正
3. 再度デプロイ

## 次のステップ

バックエンドAPIを接続する場合：

1. Railway/Render/Fly.ioなどにバックエンドAPIをデプロイ
2. Vercelの環境変数で`NEXT_PUBLIC_API_BASE_URL`を設定
3. 再デプロイ

詳細は`RAILWAY_DEPLOY.md`を参照してください。

