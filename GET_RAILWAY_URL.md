# Railway 公開URL取得ガイド

## 方法1: Railwayダッシュボード（推奨）

### 手順

1. **Railwayダッシュボードにアクセス**
   - https://railway.app にログイン

2. **プロジェクトを選択**
   - 左側のプロジェクト一覧から `VideoStep` を選択

3. **サービスを選択**
   - 例: `video-service`, `api-gateway`, `auth-service` など

4. **Settings → Networking を開く**
   - サービス画面の右側サイドバーで「Settings」をクリック
   - 「Networking」セクションを開く

5. **公開URLを生成/確認**
   - 「Generate Domain」ボタンがある場合、クリックしてドメインを生成
   - 既に生成されている場合は、URLが表示されます
   - 例: `https://video-service-production.up.railway.app`

6. **URLをコピー**
   - 表示されているURLをクリックしてコピー

## 方法2: Railway CLI

### 前提条件

```bash
# Railway CLIをインストール（未インストールの場合）
npm install -g @railway/cli

# Railwayにログイン
railway login
```

### 各サービスのURLを取得

```bash
# プロジェクトにリンク
cd C:\devlop\VideoStep
railway link

# 特定のサービスに切り替え
cd services/video-service
railway link

# 公開URLを確認
railway domain

# または、サービスのステータスを確認
railway status
```

### 全サービスのURLを一括取得

```bash
# プロジェクトルートで実行
cd C:\devlop\VideoStep

# 各サービスのディレクトリで実行
cd services/video-service && railway domain && cd ../..
cd services/api-gateway && railway domain && cd ../..
cd services/auth-service && railway domain && cd ../..
cd services/service-registry && railway domain && cd ../..
cd services/translation-service && railway domain && cd ../..
cd services/editing-service && railway domain && cd ../..
cd services/user-service && railway domain && cd ../..
```

## 各サービスのURL形式

生成されるURLは以下の形式です：

- **Video Service**: `https://video-service-production.up.railway.app`
- **API Gateway**: `https://api-gateway-production.up.railway.app`
- **Auth Service**: `https://auth-service-production.up.railway.app`
- **Service Registry**: `https://service-registry-production.up.railway.app`
- **Translation Service**: `https://translation-service-production.up.railway.app`
- **Editing Service**: `https://editing-service-production.up.railway.app`
- **User Service**: `https://user-service-production.up.railway.app`

## アクセス可能なエンドポイント

### Video Service
- **API Base**: `https://video-service-production.up.railway.app`
- **Health Check**: `https://video-service-production.up.railway.app/actuator/health`
- **API Endpoints**: `https://video-service-production.up.railway.app/api/videos`

### API Gateway
- **API Base**: `https://api-gateway-production.up.railway.app`
- **Health Check**: `https://api-gateway-production.up.railway.app/actuator/health`
- **All Routes**: `https://api-gateway-production.up.railway.app/api/*`

### Service Registry (Eureka)
- **Dashboard**: `https://service-registry-production.up.railway.app/`
- **Eureka API**: `https://service-registry-production.up.railway.app/eureka`
- **Health Check**: `https://service-registry-production.up.railway.app/actuator/health`

## 環境変数への設定

### フロントエンド（Vercel）で使用

1. **Vercelダッシュボードにアクセス**
2. **プロジェクト → Settings → Environment Variables**
3. **`NEXT_PUBLIC_API_BASE_URL` を追加/編集**
4. **値にAPI GatewayのURLを設定**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://api-gateway-production.up.railway.app
   ```

## トラブルシューティング

### URLが表示されない場合

1. **サービスがデプロイされているか確認**
   - Railwayダッシュボードでサービスのステータスを確認

2. **「Generate Domain」ボタンをクリック**
   - Networkingセクションで「Generate Domain」をクリック

3. **ビルドが完了しているか確認**
   - サービスの「Deployments」タブで最新のデプロイメントが成功しているか確認

### URLにアクセスできない場合

1. **サービスが起動しているか確認**
   - ログを確認してサービスが正常に起動しているか確認

2. **ポート設定を確認**
   - 各サービスのポートが正しく設定されているか確認
   - Video Service: 8082
   - API Gateway: 8080
   - Auth Service: 8081
   - Service Registry: 8761

3. **ネットワーク設定を確認**
   - Railwayダッシュボードで「Networking」セクションを確認

## まとめ

**最も簡単な方法**:
1. Railwayダッシュボードでサービスを開く
2. 「Settings」→「Networking」を開く
3. 「Generate Domain」をクリック（未生成の場合）
4. 生成されたURLをコピー

これで各サービスの公開URLを取得できます！

