# Railway デプロイ ステップバイステップガイド

## ステップ1: PostgreSQLデータベースの作成

### Auth Service用データベース

1. **Railwayダッシュボードにアクセス**
   - https://railway.app にログイン
   - VideoStepプロジェクトを開く

2. **新しいデータベースを作成**
   - "New Service" をクリック
   - "Database" を選択
   - "Add PostgreSQL" をクリック

3. **サービス名を設定**
   - サービス名: `videostep-auth-db`
   - または、自動生成された名前をそのまま使用

4. **接続情報を確認**
   - "Variables" タブを開く
   - `DATABASE_URL` を確認（後で使用します）

### Video Service用データベース

同様の手順で以下を作成：
- サービス名: `videostep-video-db`

### その他のサービス用データベース（オプション）

必要に応じて以下も作成：
- `videostep-translation-db`
- `videostep-editing-db`
- `videostep-user-db`

## ステップ2: Auth Serviceのデプロイ

### 2.1 新しいサービスを作成

1. **Railwayダッシュボードで "New Service" をクリック**
2. **"GitHub Repo" を選択**
3. **VideoStepリポジトリを選択**

### 2.2 設定を確認・設定

1. **"Settings" タブを開く**

2. **"Source" セクション**
   - **Root Directory**: `.` を設定

3. **"Build" セクション**
   - **Dockerfile Path**: `services/auth-service/Dockerfile` を設定
   - **Build Context**: `.` を設定（または空欄のまま）

### 2.3 環境変数を設定

1. **"Variables" タブを開く**

2. **以下の環境変数を追加**:

   ```
   SPRING_DATASOURCE_URL=${{videostep-auth-db.DATABASE_URL}}
   JWT_SECRET=your-production-jwt-secret-key-here-change-this-to-secure-random-string
   JWT_EXPIRATION=86400000
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
   ```

   **重要**:
   - `${{videostep-auth-db.DATABASE_URL}}` は、作成したPostgreSQLデータベースのサービス名を使用
   - `JWT_SECRET` は、強力なランダム文字列に変更してください
   - `videostep` は、Service Registryのプライベートネットワーク名です

3. **"Save" をクリック**

### 2.4 デプロイ

1. **"Deployments" タブを開く**
2. **"Deploy" をクリック**（自動的にデプロイが開始される場合もあります）
3. **ビルドログを確認**
   - エラーがないか確認
   - ビルドが成功することを確認

## ステップ3: Video Serviceのデプロイ

### 3.1 新しいサービスを作成

1. **"New Service" → "GitHub Repo" を選択**
2. **VideoStepリポジトリを選択**

### 3.2 設定を確認・設定

1. **"Settings" タブを開く**

2. **"Source" セクション**
   - **Root Directory**: `.` を設定

3. **"Build" セクション**
   - **Dockerfile Path**: `services/video-service/Dockerfile` を設定
   - **Build Context**: `.` を設定（または空欄のまま）

### 3.3 環境変数を設定

1. **"Variables" タブを開く**

2. **以下の環境変数を追加**:

   ```
   SPRING_DATASOURCE_URL=${{videostep-video-db.DATABASE_URL}}
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
   ```

3. **"Save" をクリック**

### 3.4 デプロイ

1. **デプロイを実行**
2. **ビルドログを確認**

## ステップ4: API Gatewayのデプロイ

### 4.1 新しいサービスを作成

1. **"New Service" → "GitHub Repo" を選択**
2. **VideoStepリポジトリを選択**

### 4.2 設定を確認・設定

1. **"Settings" タブを開く**

2. **"Source" セクション**
   - **Root Directory**: `.` を設定

3. **"Build" セクション**
   - **Dockerfile Path**: `services/api-gateway/Dockerfile` を設定
   - **Build Context**: `.` を設定（または空欄のまま）

### 4.3 環境変数を設定

1. **"Variables" タブを開く**

2. **以下の環境変数を追加**:

   ```
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
   ```

3. **"Save" をクリック**

### 4.4 デプロイと公開URLの取得

1. **デプロイを実行**
2. **ビルドログを確認**
3. **公開URLを取得**
   - "Settings" → "Networking" を開く
   - "Generate Domain" をクリック（まだ生成されていない場合）
   - 公開URLをコピー（例: `https://api-gateway-production.up.railway.app`）

## ステップ5: Eureka Dashboardで確認

### 5.1 Eureka Dashboardにアクセス

1. **Service Registryの公開URLにアクセス**
   - `https://videostep-production.up.railway.app/`

2. **"Instances currently registered with Eureka" セクションを確認**
   - デプロイしたサービスが表示されることを確認
   - 例:
     - `AUTH-SERVICE`
     - `VIDEO-SERVICE`
     - `API-GATEWAY`

3. **警告メッセージが消えることを確認**
   - サービスが登録されると、警告は自動的に消えます

### 5.2 各サービスの動作確認

1. **Auth Service**
   - Health Check: `https://<auth-service-url>/actuator/health`

2. **Video Service**
   - Health Check: `https://<video-service-url>/actuator/health`

3. **API Gateway**
   - Health Check: `https://<api-gateway-url>/actuator/health`
   - API Test: `https://<api-gateway-url>/api/videos/public`

## トラブルシューティング

### サービスがEurekaに登録されない場合

1. **環境変数を確認**
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/` が設定されているか確認
   - Service Registryのプライベートネットワーク名が正しいか確認

2. **ログを確認**
   - 各サービスのログで、Eurekaへの接続エラーがないか確認

3. **ネットワーク設定を確認**
   - Railwayダッシュボードで "Networking" → "Private Networking" を確認
   - Service Registryのサービス名を確認

### データベース接続エラーが発生する場合

1. **環境変数を確認**
   - `SPRING_DATASOURCE_URL=${{videostep-auth-db.DATABASE_URL}}` が正しく設定されているか確認
   - データベースサービス名が正しいか確認

2. **データベースが作成されているか確認**
   - Railwayダッシュボードでデータベースサービスが存在するか確認

## チェックリスト

- [ ] PostgreSQLデータベースを作成（Auth Service用）
- [ ] PostgreSQLデータベースを作成（Video Service用）
- [ ] Auth Serviceをデプロイ
- [ ] Video Serviceをデプロイ
- [ ] API Gatewayをデプロイ
- [ ] API Gatewayの公開URLを取得
- [ ] Eureka Dashboardでサービスが登録されていることを確認
- [ ] 各サービスのHealth Checkが正常であることを確認

## 次のステップ（デプロイ完了後）

1. **フロントエンドの環境変数を更新**
   - Vercelダッシュボードで `NEXT_PUBLIC_API_BASE_URL` を設定
   - API Gatewayの公開URLを設定

2. **動作確認**
   - フロントエンドからAPIにアクセスできることを確認

3. **その他のサービスをデプロイ**（必要に応じて）
   - Translation Service
   - Editing Service
   - User Service

