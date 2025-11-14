# Railway デプロイ手順

## 概要

VideoStepのバックエンドAPIをRailwayにデプロイする手順です。

## 前提条件

- Railwayアカウント（https://railway.app）
- GitHubアカウント（リポジトリにプッシュ済み）

## デプロイ方法

### 方法1: GitHub連携（推奨）

#### ステップ1: Railwayアカウントの作成

1. https://railway.app にアクセス
2. "Start a New Project" をクリック
3. GitHubアカウントでログイン

#### ステップ2: プロジェクトの作成

1. "New Project" をクリック
2. "Deploy from GitHub repo" を選択
3. VideoStepリポジトリを選択

#### ステップ3: サービスの追加

Railwayでは、各マイクロサービスを個別にデプロイする必要があります。

**1. Service Registry（最初にデプロイ）**

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. "Settings" → "Root Directory" を `services/service-registry` に設定
4. "Settings" → "Build Command" を確認（自動検出される）
5. "Settings" → "Start Command" を確認
6. "Deploy" をクリック

**2. API Gateway**

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. "Settings" → "Root Directory" を `services/api-gateway` に設定
4. "Variables" タブで環境変数を追加：
   ```
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
   ```
5. "Deploy" をクリック

**3. PostgreSQLデータベース（各サービス用）**

各サービス用にPostgreSQLデータベースを作成：

1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. データベース名を設定（例: `videostep-auth-db`）
3. 接続情報をコピー

**4. Auth Service**

1. "New Service" → "GitHub Repo" を選択
2. "Settings" → "Root Directory" を `services/auth-service` に設定
3. "Variables" タブで環境変数を追加：
   ```
   SPRING_DATASOURCE_URL=${{videostep-auth-db.DATABASE_URL}}
   JWT_SECRET=your-production-jwt-secret-key-here
   JWT_EXPIRATION=86400000
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
   ```
4. "Deploy" をクリック

**5. Video Service**

1. "New Service" → "GitHub Repo" を選択
2. "Settings" → "Root Directory" を `services/video-service` に設定
3. "Variables" タブで環境変数を追加：
   ```
   SPRING_DATASOURCE_URL=${{videostep-video-db.DATABASE_URL}}
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
   ```
4. "Deploy" をクリック

**6. その他のサービス**

同様の手順で以下をデプロイ：
- Translation Service
- Editing Service
- User Service

#### ステップ4: 公開URLの設定

1. API Gatewayサービスの "Settings" → "Networking" に移動
2. "Generate Domain" をクリック
3. 公開URLをコピー（例: `https://api-gateway-production.up.railway.app`）

#### ステップ5: フロントエンドの環境変数を更新

1. Vercelダッシュボードにアクセス
2. Settings → Environment Variables
3. `NEXT_PUBLIC_API_BASE_URL` を追加/編集
4. RailwayのAPI Gateway URLを設定（例: `https://api-gateway-production.up.railway.app`）
5. 環境を `Production`, `Preview`, `Development` すべてに設定
6. Save をクリック
7. 再デプロイを実行

### 方法2: Railway CLIを使用

#### ステップ1: Railway CLIのインストール

```bash
npm install -g @railway/cli
```

#### ステップ2: ログイン

```bash
railway login
```

#### ステップ3: プロジェクトの初期化

```bash
cd C:\devlop\VideoStep
railway init
```

#### ステップ4: サービスのリンク

各サービスディレクトリで：

```bash
cd services/api-gateway
railway link
railway up
```

## 環境変数の設定

### 共通環境変数

- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`: Service Registryの内部URL

### Auth Service

- `SPRING_DATASOURCE_URL`: PostgreSQL接続URL
- `JWT_SECRET`: JWT秘密鍵（本番環境用の強力な鍵を使用）
- `JWT_EXPIRATION`: JWT有効期限（ミリ秒）

### Video Service

- `SPRING_DATASOURCE_URL`: PostgreSQL接続URL

### その他のサービス

各サービスに応じたPostgreSQL接続URLを設定

## データベースマイグレーション

Railwayでは、Flywayマイグレーションが自動的に実行されます。初回デプロイ時にデータベーススキーマが作成されます。

## デプロイ後の確認

### 1. サービスレジストリの確認

```
https://your-service-registry-url.railway.app
```

Eurekaダッシュボードで各サービスが登録されていることを確認

### 2. API Gatewayの確認

```bash
curl https://your-api-gateway-url.railway.app/api/videos/public
```

### 3. フロントエンドからの接続確認

VercelのフロントエンドからAPIにアクセスできることを確認

## トラブルシューティング

### ビルドエラー

- Dockerfileの確認
- ビルドログの確認
- 依存関係の確認

### 接続エラー

- 環境変数の確認
- サービス間のネットワーク設定の確認
- Eurekaサービスレジストリの確認

### データベース接続エラー

- データベースURLの確認
- 接続情報の確認
- ネットワーク設定の確認

## 参考リンク

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Documentation](https://docs.railway.app/develop/cli)

