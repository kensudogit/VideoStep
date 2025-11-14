# VideoStep デプロイガイド

## 概要

VideoStepアプリケーションは以下の構成でデプロイできます：

- **フロントエンド**: Vercel（Next.js）
- **バックエンドAPI**: Railway/Render/Fly.io（Docker Compose）

## デプロイ方法

### 1. フロントエンド（Vercel）

✅ **既にデプロイ済み**
- URL: https://frontend-dph1otmw8-kensudogits-projects.vercel.app
- ステータス: デプロイ完了

### 2. バックエンドAPI（Railway推奨）

VercelはDockerコンテナを直接サポートしていないため、バックエンドAPIは以下のプラットフォームのいずれかにデプロイする必要があります：

#### オプションA: Railway（推奨）

**手順:**

1. **Railwayアカウントを作成**
   - https://railway.app にアクセス
   - GitHubアカウントでサインアップ

2. **新しいプロジェクトを作成**
   - "New Project" → "Deploy from GitHub repo"
   - VideoStepリポジトリを選択

3. **Docker Composeでデプロイ**
   - Railwayは自動的に`docker-compose.yml`を検出
   - または、各サービスを個別にデプロイ

4. **環境変数の設定**
   - 各サービスで必要な環境変数を設定
   - データベース接続情報を設定

5. **公開URLの取得**
   - Railwayが各サービスに公開URLを提供
   - API GatewayのURLを取得

6. **フロントエンドの環境変数を更新**
   - Vercelダッシュボードで`NEXT_PUBLIC_API_BASE_URL`を設定
   - RailwayのAPI Gateway URLを設定

#### オプションB: Render

**手順:**

1. **Renderアカウントを作成**
   - https://render.com にアクセス
   - GitHubアカウントでサインアップ

2. **Blueprintを作成**
   - "New" → "Blueprint"
   - GitHubリポジトリを接続
   - `docker-compose.yml`を検出

3. **環境変数の設定**
   - 各サービスで必要な環境変数を設定

4. **デプロイ**
   - Renderが自動的にビルドとデプロイを実行

#### オプションC: Fly.io

**手順:**

1. **Fly.ioアカウントを作成**
   - https://fly.io にアクセス
   - アカウントを作成

2. **Fly.io CLIをインストール**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

3. **ログイン**
   ```bash
   fly auth login
   ```

4. **アプリを作成**
   ```bash
   fly launch
   ```

5. **デプロイ**
   ```bash
   fly deploy
   ```

## 環境変数の設定

### バックエンド（Railway/Render/Fly.io）

各サービスで以下の環境変数を設定：

#### API Gateway
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`: EurekaサービスレジストリのURL

#### Auth Service
- `SPRING_DATASOURCE_URL`: PostgreSQL接続URL
- `JWT_SECRET`: JWT秘密鍵
- `JWT_EXPIRATION`: JWT有効期限

#### Video Service
- `SPRING_DATASOURCE_URL`: PostgreSQL接続URL

#### その他のサービス
- 各サービスに応じたデータベース接続URL

### フロントエンド（Vercel）

- `NEXT_PUBLIC_API_BASE_URL`: バックエンドAPI Gatewayの公開URL

## データベース

### オプション1: Railway PostgreSQL（推奨）

1. RailwayでPostgreSQLサービスを追加
2. 各サービスに接続URLを環境変数として設定

### オプション2: 外部データベース

- Supabase
- Neon
- PlanetScale
- AWS RDS
- Google Cloud SQL

## デプロイ後の確認

1. **バックエンドAPIの動作確認**
   ```bash
   curl https://your-api-url.com/api/videos/public
   ```

2. **フロントエンドの動作確認**
   - VercelのURLにアクセス
   - API接続が正常に動作することを確認

3. **CORS設定の確認**
   - バックエンドのCORS設定でフロントエンドのURLを許可

## トラブルシューティング

### ビルドエラー
- Dockerfileの確認
- 依存関係の確認
- ビルドログの確認

### 接続エラー
- 環境変数の確認
- ネットワーク設定の確認
- ファイアウォール設定の確認

### CORSエラー
- バックエンドのCORS設定を確認
- フロントエンドのURLを許可リストに追加

## 参考リンク

- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Fly.io Documentation](https://fly.io/docs)
- [Vercel Documentation](https://vercel.com/docs)

