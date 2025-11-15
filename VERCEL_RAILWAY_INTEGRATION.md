# VercelとRailway連携設定ガイド

## 概要

フロントエンド（Vercel）がバックエンド（Railway）のAPIにアクセスできるように、環境変数を設定する必要があります。

## 必要な設定

### ステップ1: API Gatewayの公開URLを取得

1. **Railwayダッシュボードにアクセス**
   - https://railway.app にログイン

2. **API Gatewayサービスを開く**

3. **"Settings" → "Networking" を開く**

4. **公開URLを取得**
   - "Generate Domain" をクリック（まだ生成されていない場合）
   - 公開URLをコピー（例: `https://api-gateway-production.up.railway.app`）

### ステップ2: Vercelの環境変数を設定

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン

2. **プロジェクト `frontend` を選択**

3. **"Settings" タブを開く**

4. **"Environment Variables" セクションを開く**

5. **環境変数を追加/編集**
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: RailwayのAPI Gatewayの公開URL（例: `https://api-gateway-production.up.railway.app`）
   - **Environment**: `Production`, `Preview`, `Development` すべてにチェック

6. **"Save" をクリック**

7. **再デプロイを実行**
   - "Deployments" タブを開く
   - 最新のデプロイメントの "..." メニューから "Redeploy" を選択

## 環境変数の設定例

### Vercel環境変数

```
NEXT_PUBLIC_API_BASE_URL=https://api-gateway-production.up.railway.app
```

**重要**: 
- `NEXT_PUBLIC_` プレフィックスが必要（Next.jsでクライアント側からアクセス可能にするため）
- URLの末尾に `/` は付けない（`/api` などのパスは `api.ts` で追加される）

## CORS設定の確認

### API GatewayのCORS設定

API Gatewayの `application.yml` で、Vercelのドメインを許可する必要があります。

現在の設定（`allowedOrigins: ["*"]`）は開発環境では動作しますが、本番環境では具体的なドメインを指定することを推奨します。

#### 推奨設定（本番環境）

```yaml
globalcors:
  corsConfigurations:
    '[/**]':
      allowedOrigins:
        - https://your-frontend-domain.vercel.app
        - https://your-custom-domain.com
      allowedMethods:
        - GET
        - POST
        - PUT
        - DELETE
        - OPTIONS
        - PATCH
      allowedHeaders:
        - "*"
      allowCredentials: true
      exposedHeaders:
        - Set-Cookie
        - Authorization
      maxAge: 3600
```

#### 現在の設定（開発環境用）

現在の設定（`allowedOrigins: ["*"]`）でも動作しますが、セキュリティ上の理由から、本番環境では具体的なドメインを指定することを推奨します。

## 動作確認

### 1. フロントエンドからAPIにアクセス

1. **Vercelのフロントエンドにアクセス**
   - デプロイされたフロントエンドのURLにアクセス

2. **ブラウザの開発者ツールを開く**
   - F12キーを押す
   - "Network" タブを開く

3. **APIリクエストを確認**
   - フロントエンドでAPIを呼び出す操作を実行
   - Networkタブで、RailwayのAPI Gatewayへのリクエストが送信されているか確認
   - ステータスコードが200であることを確認

### 2. CORSエラーの確認

もしCORSエラーが発生する場合：

1. **ブラウザのコンソールを確認**
   - CORSエラーメッセージが表示されていないか確認

2. **API GatewayのCORS設定を確認**
   - `allowedOrigins` にVercelのドメインが含まれているか確認

3. **環境変数を確認**
   - `NEXT_PUBLIC_API_BASE_URL` が正しく設定されているか確認

## トラブルシューティング

### APIにアクセスできない場合

1. **環境変数を確認**
   - Vercelダッシュボードで `NEXT_PUBLIC_API_BASE_URL` が設定されているか確認
   - 値が正しいか確認（RailwayのAPI Gatewayの公開URL）

2. **再デプロイを実行**
   - 環境変数を変更した後、必ず再デプロイを実行

3. **API Gatewayが起動しているか確認**
   - RailwayダッシュボードでAPI Gatewayのログを確認
   - 正常に起動しているか確認

4. **ネットワーク設定を確認**
   - RailwayダッシュボードでAPI Gatewayの公開URLが生成されているか確認

### CORSエラーが発生する場合

1. **API GatewayのCORS設定を確認**
   - `allowedOrigins` にVercelのドメインが含まれているか確認
   - または、`["*"]` が設定されているか確認（開発環境）

2. **`allowCredentials: true` が設定されているか確認**
   - Cookieを使用する場合、`allowCredentials: true` が必要

3. **`exposedHeaders` を確認**
   - `Set-Cookie` と `Authorization` が含まれているか確認

## まとめ

**必要な設定**:
1. ✅ RailwayのAPI Gatewayの公開URLを取得
2. ✅ Vercelの環境変数 `NEXT_PUBLIC_API_BASE_URL` を設定
3. ✅ Vercelで再デプロイを実行
4. ✅ CORS設定を確認（必要に応じて調整）

**確認事項**:
- API Gatewayの公開URLが正しく設定されているか
- Vercelの環境変数が正しく設定されているか
- CORS設定が正しいか
- フロントエンドからAPIにアクセスできるか

これらの設定により、VercelのフロントエンドからRailwayのバックエンドAPIにアクセスできるようになります。

