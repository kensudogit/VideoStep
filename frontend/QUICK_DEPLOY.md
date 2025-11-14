# Vercel クイックデプロイ手順

## 現在の状態

✅ Mockデータ実装済み
✅ サードパーティCookie廃止対応済み
✅ 完全公開モード対応済み

## デプロイ方法

### 方法1: Vercel CLI（推奨）

```bash
cd C:\devlop\VideoStep\frontend
vercel --prod --yes
```

### 方法2: Vercelダッシュボード

1. https://vercel.com にアクセス
2. プロジェクト `frontend` を選択
3. "Deployments" タブを開く
4. 最新のデプロイメントの "..." メニューから "Redeploy" をクリック

### 方法3: GitHub連携（自動デプロイ）

変更をGitHubにプッシュすると、Vercelが自動的にデプロイします。

## デプロイ後の確認

デプロイが完了したら、以下のURLにアクセス：

**本番URL**: https://frontend-n22egn6e9-kensudogits-projects.vercel.app

### 確認項目

- ✅ ホームページで8つのサンプル動画が表示される
- ✅ 動画詳細ページが正常に動作する
- ✅ Mockデータが正常に表示される

## トラブルシューティング

### デプロイが失敗する場合

1. ローカルでビルドを確認：
   ```bash
   cd frontend
   npm run build
   ```

2. エラーを修正してから再デプロイ

### Mockデータが表示されない場合

- `NEXT_PUBLIC_API_BASE_URL`環境変数が設定されていないことを確認
- ブラウザの開発者ツールでエラーを確認

