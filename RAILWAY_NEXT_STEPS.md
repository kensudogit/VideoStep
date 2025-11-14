# Railway デプロイ次のステップ

## 現在の状況

✅ **Service Registryは正常に起動**
- URL: `https://videostep-production.up.railway.app`
- Eureka Dashboardが表示されている
- ⚠️ 警告メッセージが表示されている（他のサービスがまだ登録されていないため、正常）

## 次のステップ

### ステップ1: PostgreSQLデータベースの作成

各サービス用にPostgreSQLデータベースを作成します。

#### Auth Service用データベース

1. Railwayダッシュボードで "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `videostep-auth-db`
3. "Variables" タブで接続情報を確認

#### Video Service用データベース

1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `videostep-video-db`

#### その他のサービス用データベース

同様に以下を作成：
- `videostep-translation-db`
- `videostep-editing-db`
- `videostep-user-db`

### ステップ2: Auth Serviceのデプロイ

1. **新しいサービスを作成**
   - "New Service" → "GitHub Repo" を選択
   - VideoStepリポジトリを選択

2. **設定**
   - **Root Directory**: `.`
   - **Dockerfile Path**: `services/auth-service/Dockerfile`
   - **Build Context**: `.`

3. **環境変数を設定**
   ```
   SPRING_DATASOURCE_URL=${{videostep-auth-db.DATABASE_URL}}
   JWT_SECRET=your-production-jwt-secret-key-here-change-this
   JWT_EXPIRATION=86400000
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
   ```

4. **デプロイ**

### ステップ3: Video Serviceのデプロイ

1. **新しいサービスを作成**
   - "New Service" → "GitHub Repo" を選択
   - VideoStepリポジトリを選択

2. **設定**
   - **Root Directory**: `.`
   - **Dockerfile Path**: `services/video-service/Dockerfile`
   - **Build Context**: `.`

3. **環境変数を設定**
   ```
   SPRING_DATASOURCE_URL=${{videostep-video-db.DATABASE_URL}}
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
   ```

4. **デプロイ**

### ステップ4: API Gatewayのデプロイ

1. **新しいサービスを作成**
   - "New Service" → "GitHub Repo" を選択
   - VideoStepリポジトリを選択

2. **設定**
   - **Root Directory**: `.`
   - **Dockerfile Path**: `services/api-gateway/Dockerfile`
   - **Build Context**: `.`

3. **環境変数を設定**
   ```
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
   ```

4. **デプロイ**

5. **公開URLを取得**
   - "Settings" → "Networking" で公開URLを取得
   - このURLをフロントエンドの環境変数に設定

### ステップ5: Eureka Dashboardで確認

各サービスをデプロイした後：

1. **Eureka Dashboardをリロード**
   - `https://videostep-production.up.railway.app/`

2. **"Instances currently registered with Eureka" セクションを確認**
   - デプロイしたサービスが表示されることを確認
   - 警告メッセージが消えることを確認

## 重要なポイント

### Eureka Client設定

**Railwayのプライベートネットワーク名を使用**:
- Service Registryのサービス名: `videostep`
- Eureka URL: `http://videostep:8761/eureka/`

**確認方法**:
- RailwayダッシュボードでService Registryの "Settings" → "Networking" → "Private Networking" を確認
- "You can also simply call me videostep" と表示されているサービス名を使用

### デプロイ順序

1. ✅ Service Registry（完了）
2. PostgreSQLデータベース（各サービス用）
3. Auth Service
4. Video Service
5. API Gateway
6. その他のサービス

## トラブルシューティング

### サービスがEurekaに登録されない場合

1. **環境変数を確認**
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/` が設定されているか確認
   - Service Registryのサービス名が正しいか確認

2. **ログを確認**
   - 各サービスのログで、Eurekaへの接続エラーがないか確認

3. **ネットワーク設定を確認**
   - Railwayダッシュボードで "Networking" → "Private Networking" を確認

## まとめ

**現在の状況**:
- ✅ Service Registry: 正常に起動（`https://videostep-production.up.railway.app`）
- ⚠️ 他のサービス: まだデプロイされていない（警告が表示される）

**次のアクション**:
1. PostgreSQLデータベースを作成
2. Auth Serviceをデプロイ
3. Video Serviceをデプロイ
4. API Gatewayをデプロイ
5. Eureka Dashboardでサービスが登録されていることを確認

サービスをデプロイすると、警告は自動的に消え、Eureka Dashboardにサービスが表示されます。

