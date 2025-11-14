# Vercelデプロイ手順

## デプロイ完了

✅ Mockデータを使用した完全公開モードでデプロイ準備完了

- **公開モード**: 完全公開モード
- **Mockデータ**: 実装済み（バックエンドAPIなしで動作）
- **ビルドステータス**: 準備完了

### デプロイ方法

**Vercel CLI:**
```bash
cd frontend
vercel --prod --yes
```

**Vercelダッシュボード:**
1. https://vercel.com にアクセス
2. プロジェクトを選択
3. "Deployments" → "Redeploy"

## ✅ Mockデータ実装済み

**重要**: Mockデータを使用するため、`NEXT_PUBLIC_API_BASE_URL`環境変数は**設定しないでください**。

バックエンドAPIなしで動作します。8つのサンプル動画データが表示されます。

### バックエンドAPIを接続する場合

後でバックエンドAPIを接続する場合は、以下の手順で環境変数を設定してください：

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

