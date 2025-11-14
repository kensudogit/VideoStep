# Railway 完全公開モードデプロイガイド

## 概要

VideoStepのDocker環境をRailwayサーバーに完全公開モードでデプロイする手順です。

## 前提条件

- Railwayアカウント（https://railway.app）
- GitHubアカウント（リポジトリにプッシュ済み）
- Railway CLI（オプション、推奨）

## Railway CLIのインストール

```bash
npm install -g @railway/cli
```

## デプロイ手順

### ステップ1: Railwayにログイン

#### 方法1: Railway CLIを使用（推奨）

```bash
railway login
```

ブラウザが開き、Railwayアカウントでログインします。

#### 方法2: Railwayダッシュボードを使用

1. https://railway.app にアクセス
2. GitHubアカウントでログイン

### ステップ2: プロジェクトの作成

#### Railway CLIを使用する場合

```bash
cd C:\devlop\VideoStep
railway init
```

プロジェクト名を入力（例: `videostep`）

#### Railwayダッシュボードを使用する場合

1. "New Project" をクリック
2. "Deploy from GitHub repo" を選択
3. VideoStepリポジトリを選択

### ステップ3: Service Registryのデプロイ（最初にデプロイ）

Service Registryは他のすべてのサービスが依存するため、最初にデプロイする必要があります。

#### Railway CLIを使用する場合

```bash
cd C:\devlop\VideoStep\services\service-registry
railway link
railway up
```

#### Railwayダッシュボードを使用する場合

1. プロジェクトで "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. "Settings" → "Root Directory" を `services/service-registry` に設定
4. "Settings" → "Build Command" を確認（自動検出される）
5. "Settings" → "Start Command" を確認
6. "Deploy" をクリック

**環境変数**:
- なし（デフォルト設定で動作）

**公開URLの生成**:
1. "Settings" → "Networking" に移動
2. "Generate Domain" をクリック
3. 公開URLをコピー（例: `https://service-registry-production.up.railway.app`）

### ステップ4: PostgreSQLデータベースの作成

各サービス用にPostgreSQLデータベースを作成します。

#### Railwayダッシュボードを使用する場合

**1. Auth Service用データベース**

1. プロジェクトで "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `videostep-auth-db`
3. "Variables" タブで接続情報を確認

**2. Video Service用データベース**

1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `videostep-video-db`
3. "Variables" タブで接続情報を確認

**3. Translation Service用データベース**

1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `videostep-translation-db`

**4. Editing Service用データベース**

1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `videostep-editing-db`

**5. User Service用データベース**

1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `videostep-user-db`

### ステップ5: Auth Serviceのデプロイ

#### Railway CLIを使用する場合

```bash
cd C:\devlop\VideoStep\services\auth-service
railway link
railway variables set SPRING_DATASOURCE_URL=${{videostep-auth-db.DATABASE_URL}}
railway variables set JWT_SECRET=your-production-jwt-secret-key-here-change-this
railway variables set JWT_EXPIRATION=86400000
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
railway up
```

#### Railwayダッシュボードを使用する場合

1. "New Service" → "GitHub Repo" を選択
2. "Settings" → "Root Directory" を `services/auth-service` に設定
3. "Variables" タブで環境変数を追加：

```
SPRING_DATASOURCE_URL=${{videostep-auth-db.DATABASE_URL}}
JWT_SECRET=your-production-jwt-secret-key-here-change-this
JWT_EXPIRATION=86400000
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

4. "Deploy" をクリック

**公開URLの生成**:
1. "Settings" → "Networking" に移動
2. "Generate Domain" をクリック
3. 公開URLをコピー

### ステップ6: Video Serviceのデプロイ

#### Railway CLIを使用する場合

```bash
cd C:\devlop\VideoStep\services\video-service
railway link
railway variables set SPRING_DATASOURCE_URL=${{videostep-video-db.DATABASE_URL}}
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
railway up
```

#### Railwayダッシュボードを使用する場合

1. "New Service" → "GitHub Repo" を選択
2. "Settings" → "Root Directory" を `services/video-service` に設定
3. "Variables" タブで環境変数を追加：

```
SPRING_DATASOURCE_URL=${{videostep-video-db.DATABASE_URL}}
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

4. "Deploy" をクリック

**公開URLの生成**:
1. "Settings" → "Networking" に移動
2. "Generate Domain" をクリック
3. 公開URLをコピー

### ステップ7: API Gatewayのデプロイ

#### Railway CLIを使用する場合

```bash
cd C:\devlop\VideoStep\services\api-gateway
railway link
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
railway up
```

#### Railwayダッシュボードを使用する場合

1. "New Service" → "GitHub Repo" を選択
2. "Settings" → "Root Directory" を `services/api-gateway` に設定
3. "Variables" タブで環境変数を追加：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

4. "Deploy" をクリック

**公開URLの生成（重要）**:
1. "Settings" → "Networking" に移動
2. "Generate Domain" をクリック
3. 公開URLをコピー（例: `https://api-gateway-production.up.railway.app`）
4. このURLをフロントエンドの環境変数に設定します

### ステップ8: その他のサービスのデプロイ

同様の手順で以下をデプロイ：

**Translation Service**:
```
SPRING_DATASOURCE_URL=${{videostep-translation-db.DATABASE_URL}}
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

**Editing Service**:
```
SPRING_DATASOURCE_URL=${{videostep-editing-db.DATABASE_URL}}
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

**User Service**:
```
SPRING_DATASOURCE_URL=${{videostep-user-db.DATABASE_URL}}
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

### ステップ9: フロントエンドの環境変数を更新

1. Vercelダッシュボードにアクセス
2. プロジェクト `frontend` を選択
3. Settings → Environment Variables
4. `NEXT_PUBLIC_API_BASE_URL` を追加/編集
5. RailwayのAPI Gateway URLを設定（例: `https://api-gateway-production.up.railway.app`）
6. 環境を `Production`, `Preview`, `Development` すべてに設定
7. Save をクリック
8. 再デプロイを実行

## デプロイ後の確認

### 1. Service Registryの確認

Service Registryの公開URLにアクセス：
```
https://your-service-registry-url.railway.app
```

Eurekaダッシュボードで各サービスが登録されていることを確認します。

### 2. API Gatewayの確認

```bash
curl https://your-api-gateway-url.railway.app/api/videos/public
```

正常にレスポンスが返ることを確認します。

### 3. フロントエンドからの接続確認

VercelのフロントエンドからAPIにアクセスできることを確認します。

## 環境変数の一覧

### Service Registry
- なし（デフォルト設定で動作）

### Auth Service
```
SPRING_DATASOURCE_URL=${{videostep-auth-db.DATABASE_URL}}
JWT_SECRET=your-production-jwt-secret-key-here-change-this
JWT_EXPIRATION=86400000
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

### Video Service
```
SPRING_DATASOURCE_URL=${{videostep-video-db.DATABASE_URL}}
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

### API Gateway
```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

### Translation Service
```
SPRING_DATASOURCE_URL=${{videostep-translation-db.DATABASE_URL}}
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

### Editing Service
```
SPRING_DATASOURCE_URL=${{videostep-editing-db.DATABASE_URL}}
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

### User Service
```
SPRING_DATASOURCE_URL=${{videostep-user-db.DATABASE_URL}}
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

## トラブルシューティング

### ビルドエラー

1. **Dockerfileの確認**
   - 各サービスのDockerfileが正しく設定されているか確認
   - ビルドログを確認

2. **依存関係の確認**
   - `build.gradle`の依存関係が正しいか確認
   - Javaバージョンが正しいか確認（Java 21）

### 接続エラー

1. **環境変数の確認**
   - すべての環境変数が正しく設定されているか確認
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しいか確認

2. **サービス間のネットワーク設定**
   - Railwayでは、同じプロジェクト内のサービスは自動的にネットワーク接続されます
   - サービス名で相互にアクセス可能です

3. **Eurekaサービスレジストリの確認**
   - Service Registryが正常に起動しているか確認
   - Eurekaダッシュボードで各サービスが登録されているか確認

### データベース接続エラー

1. **データベースURLの確認**
   - `${{service-name.DATABASE_URL}}`の形式が正しいか確認
   - Railwayのデータベースサービス名が正しいか確認

2. **接続情報の確認**
   - データベースの接続情報が正しいか確認
   - ネットワーク設定が正しいか確認

### CORSエラー

1. **API GatewayのCORS設定**
   - `application.yml`のCORS設定を確認
   - フロントエンドのURLを`allowedOrigins`に追加

2. **フロントエンドの環境変数**
   - `NEXT_PUBLIC_API_BASE_URL`が正しく設定されているか確認

## デプロイ順序の重要性

**重要**: 以下の順序でデプロイする必要があります：

1. **Service Registry**（最初にデプロイ）
2. **PostgreSQLデータベース**（各サービス用）
3. **Auth Service**
4. **Video Service**
5. **API Gateway**（最後にデプロイ、公開URLを取得）
6. **その他のサービス**（Translation, Editing, User）

## 参考リンク

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Documentation](https://docs.railway.app/develop/cli)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)

## 次のステップ

デプロイが完了したら：

1. フロントエンドの環境変数を更新
2. Vercelで再デプロイ
3. 動作確認
4. 本番環境でのテスト

