# ローカルDocker環境へのアクセス手順

## 前提条件

Docker Composeを使用してサービスを起動していることを確認してください：

```bash
docker-compose up -d
```

## サービス一覧とポート番号

### マイクロサービス

| サービス名 | コンテナ名 | ポート番号 | アクセスURL |
|-----------|-----------|-----------|------------|
| **Service Registry (Eureka)** | `videostep-service-registry` | 8761 | `http://localhost:8761` |
| **API Gateway** | `videostep-api-gateway` | 8080 | `http://localhost:8080` |
| **Auth Service** | `videostep-auth-service` | 8081 | `http://localhost:8081` |
| **Video Service** | `videostep-video-service` | 8082 | `http://localhost:8082` |
| **Translation Service** | `videostep-translation-service` | 8083 | `http://localhost:8083` |
| **Editing Service** | `videostep-editing-service` | 8084 | `http://localhost:8084` |
| **User Service** | `videostep-user-service` | 8085 | `http://localhost:8085` |

### データベース

| データベース名 | コンテナ名 | ポート番号 | 接続情報 |
|--------------|-----------|-----------|---------|
| **MySQL (Auth)** | `videostep-mysql-auth` | 3307 | `localhost:3307` |
| **MySQL (Video)** | `videostep-mysql-video` | 3308 | `localhost:3308` |
| **MySQL (Translation)** | `videostep-mysql-translation` | 3309 | `localhost:3309` |
| **MySQL (Editing)** | `videostep-mysql-editing` | 3310 | `localhost:3310` |
| **MySQL (User)** | `videostep-mysql-user` | 3311 | `localhost:3311` |

**デフォルト認証情報:**
- ユーザー名: `videostep`
- パスワード: `videostep`
- ルートパスワード: `rootpassword`

## アクセス手順

### 1. Service Registry (Eureka) ダッシュボード

**URL:** `http://localhost:8761`

**説明:** サービスディスカバリーのダッシュボードです。登録されているすべてのマイクロサービスを確認できます。

**確認項目:**
- サービスが正常に登録されているか
- 各サービスのステータス（UP/DOWN）

### 2. API Gateway

**URL:** `http://localhost:8080`

**説明:** すべてのマイクロサービスへの統一エントリーポイントです。

**ヘルスチェック:**
```
http://localhost:8080/actuator/health
```

**主要なルーティング:**
- `/api/video-service/**` → Video Service
- `/api/auth-service/**` → Auth Service
- `/api/user-service/**` → User Service
- `/api/translation-service/**` → Translation Service
- `/api/editing-service/**` → Editing Service

### 3. Video Service

**URL:** `http://localhost:8082`

**ヘルスチェック:**
```
http://localhost:8082/actuator/health
```

**主要なAPIエンドポイント:**
- **公開動画一覧**: `http://localhost:8082/videos/public`
- **動画詳細**: `http://localhost:8082/videos/{id}`
- **人気動画**: `http://localhost:8082/videos/recommendations/popular`
- **最新動画**: `http://localhost:8082/videos/recommendations/latest`

**注意:** ルートパス（`/`）にアクセスすると404エラーが表示されますが、これは正常な動作です。

### 4. Auth Service

**URL:** `http://localhost:8081`

**ヘルスチェック:**
```
http://localhost:8081/actuator/health
```

### 5. Translation Service

**URL:** `http://localhost:8083`

**ヘルスチェック:**
```
http://localhost:8083/actuator/health
```

### 6. Editing Service

**URL:** `http://localhost:8084`

**ヘルスチェック:**
```
http://localhost:8084/actuator/health
```

### 7. User Service

**URL:** `http://localhost:8085`

**ヘルスチェック:**
```
http://localhost:8085/actuator/health
```

## データベースへの接続

### MySQL Workbench / DBeaver を使用する場合

**接続情報例（Video Service用MySQL）:**

```
ホスト: localhost
ポート: 3308
データベース名: videostep_video
ユーザー名: videostep
パスワード: videostep
```

### コマンドラインから接続

```bash
# Video Service用MySQLに接続
mysql -h localhost -P 3308 -u videostep -p videostep_video
# パスワード: videostep

# または、ルートユーザーで接続
mysql -h localhost -P 3308 -u root -p videostep_video
# パスワード: rootpassword
```

## サービスの状態確認

### Docker Composeで起動中のサービスを確認

```bash
docker-compose ps
```

### 特定のサービスのログを確認

```bash
# Video Serviceのログ
docker logs videostep-video-service

# API Gatewayのログ
docker logs videostep-api-gateway

# Service Registryのログ
docker logs videostep-service-registry
```

### リアルタイムでログを確認（フォロー）

```bash
# Video Serviceのログをリアルタイムで確認
docker logs -f videostep-video-service
```

### すべてのコンテナの状態を確認

```bash
docker ps
```

## トラブルシューティング

### サービスが起動しない場合

1. **コンテナの状態を確認:**
   ```bash
   docker ps -a
   ```

2. **ログを確認:**
   ```bash
   docker logs <コンテナ名>
   ```

3. **コンテナを再起動:**
   ```bash
   docker-compose restart <サービス名>
   ```

4. **すべてのサービスを再起動:**
   ```bash
   docker-compose restart
   ```

### ポートが既に使用されている場合

エラーメッセージ例:
```
Error: bind: address already in use
```

**解決方法:**
1. 使用中のポートを確認:
   ```bash
   # Windows
   netstat -ano | findstr :8082
   
   # Linux/Mac
   lsof -i :8082
   ```

2. 使用中のプロセスを終了するか、`docker-compose.yml`でポート番号を変更

### データベース接続エラーの場合

1. **MySQLコンテナが起動しているか確認:**
   ```bash
   docker ps | grep mysql
   ```

2. **MySQLコンテナのログを確認:**
   ```bash
   docker logs videostep-mysql-video
   ```

3. **ネットワーク接続を確認:**
   ```bash
   docker network inspect videostep_videostep-network
   ```

## よく使用するコマンド

### すべてのサービスを起動

```bash
docker-compose up -d
```

### すべてのサービスを停止

```bash
docker-compose down
```

### すべてのサービスを停止してボリュームも削除

```bash
docker-compose down -v
```

### 特定のサービスのみ起動

```bash
docker-compose up -d service-registry
docker-compose up -d video-service
```

### サービスの再ビルド

```bash
# 特定のサービスのみ再ビルド
docker-compose build video-service
docker-compose up -d video-service

# すべてのサービスを再ビルド
docker-compose build
docker-compose up -d
```

## フロントエンドの起動

フロントエンドは通常、Docker Composeには含まれていません。別途起動する必要があります：

```bash
cd frontend
npm install
npm run dev
```

**フロントエンドURL:** `http://localhost:3000`

**注意:** フロントエンドは、API Gateway（`http://localhost:8080`）経由でバックエンドサービスにアクセスします。

## まとめ

### クイックリファレンス

| 用途 | URL |
|------|-----|
| **Service Registry** | `http://localhost:8761` |
| **API Gateway** | `http://localhost:8080` |
| **Video Service** | `http://localhost:8082` |
| **Video Service ヘルスチェック** | `http://localhost:8082/actuator/health` |
| **フロントエンド** | `http://localhost:3000` |

### 推奨アクセス方法

1. **開発時**: 各サービスに直接アクセス（`localhost:8082`など）
2. **本番環境に近い形**: API Gateway経由でアクセス（`localhost:8080/api/video-service/...`）
3. **サービス状態確認**: Service Registryダッシュボード（`localhost:8761`）

