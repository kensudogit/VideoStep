# VideoStep クイックスタートガイド

VideoStepプロジェクトを素早く起動するためのガイドです。

## 前提条件

- Docker & Docker Compose がインストールされていること
- Java 21 がインストールされていること（ローカルビルドの場合）
- Node.js 18以上がインストールされていること（フロントエンド開発の場合）

## クイックスタート

### 1. リポジトリのクローン

```bash
cd C:\devlop\VideoStep
```

### 2. Docker Composeで全サービスを起動

```bash
docker-compose up -d --build
```

これにより、以下のサービスが起動します：
- PostgreSQL（5つのデータベース）
- Service Registry (Eureka)
- API Gateway
- Auth Service
- Video Service
- Translation Service
- Editing Service
- User Service

### 3. サービスの確認

- **API Gateway**: http://localhost:8080
- **Service Registry**: http://localhost:8761
- **Frontend**: http://localhost:3000（別途起動が必要）

### 4. フロントエンドの起動（開発モード）

```bash
cd frontend
npm install
npm run dev
```

フロントエンドは http://localhost:3000 で起動します。

## トラブルシューティング

### ポートが既に使用されている

エラーメッセージ: `port is already allocated`

解決方法：
1. 使用中のポートを確認
2. `docker-compose.yml`でポート番号を変更
3. または、使用中のプロセスを停止

### データベース接続エラー

エラーメッセージ: `Connection refused`

解決方法：
1. PostgreSQLコンテナが起動しているか確認: `docker ps`
2. データベースが完全に起動するまで待つ（30秒程度）
3. サービスを再起動: `docker-compose restart <service-name>`

### ビルドエラー

エラーメッセージ: `Build failed`

解決方法：
1. Java 21がインストールされているか確認: `java -version`
2. Gradleのキャッシュをクリア: `./gradlew clean`
3. Dockerイメージを再ビルド: `docker-compose build --no-cache`

## 開発のヒント

### ログの確認

```bash
# 全サービスのログ
docker-compose logs -f

# 特定のサービスのログ
docker-compose logs -f auth-service
```

### サービスの再起動

```bash
# 特定のサービスを再起動
docker-compose restart auth-service

# 全サービスを再起動
docker-compose restart
```

### データベースのリセット

```bash
# ボリュームを削除して再作成
docker-compose down -v
docker-compose up -d
```

## 次のステップ

- [README.md](README.md) - 詳細なドキュメント
- [CONTRIBUTING.md](CONTRIBUTING.md) - コントリビューションガイド
- [DEPLOYMENT.md](DEPLOYMENT.md) - デプロイメントガイド

