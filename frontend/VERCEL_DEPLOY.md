# Vercelデプロイ手順

## デプロイ完了

✅ デプロイが完了しました！（完全公開モード）

- **本番URL**: https://frontend-dph1otmw8-kensudogits-projects.vercel.app
- **公開モード**: 完全公開モードでデプロイ済み
- **ビルドステータス**: ✅ 成功（404エラーとビルドエラーを修正済み）

## ⚠️ 重要: 環境変数の設定が必要です

現在、`NEXT_PUBLIC_API_BASE_URL`環境変数が設定されていません。VercelからバックエンドAPIにアクセスできるように、公開されたバックエンドAPIのURLを設定する必要があります。

### 方法1: Vercelダッシュボードで設定

1. https://vercel.com/kensudogits-projects/frontend にアクセス
2. Settings → Environment Variables に移動
3. `NEXT_PUBLIC_API_BASE_URL` を追加/編集
4. 値に公開されたバックエンドAPIのURLを設定（例: `https://your-api-domain.com`）
5. 環境を `Production`, `Preview`, `Development` すべてに設定
6. Save をクリック
7. 再デプロイを実行

### 方法2: Vercel CLIで設定

```bash
cd frontend
vercel env add NEXT_PUBLIC_API_BASE_URL production
# プロンプトで公開されたバックエンドAPIのURLを入力
vercel --prod
```

## バックエンドAPIの公開

バックエンドAPIがまだ公開されていない場合、以下のいずれかの方法で公開してください：

1. **クラウドプロバイダーにデプロイ** (AWS, GCP, Azureなど)
2. **Railway, Render, Fly.ioなどのPaaSを使用**
3. **Vercel Serverless Functionsを使用** (API GatewayをVercelに移行)

## 再デプロイ

環境変数を変更した後、再デプロイを実行：

```bash
cd frontend
vercel --prod
```

または、Vercelダッシュボードから「Redeploy」をクリック

