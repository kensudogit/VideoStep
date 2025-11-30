# API Gateway接続エラー (ERR_CONNECTION_REFUSED) の解決方法

## エラーの原因

`localhost:8080` に接続できないエラー (`ERR_CONNECTION_REFUSED`) が発生している理由は、**API Gatewayが起動していない**ためです。

## 確認方法

### 1. API Gatewayコンテナの状態を確認

```bash
docker ps --filter "name=api-gateway"
```

**結果が空の場合**: API Gatewayが起動していません。

### 2. すべてのコンテナの状態を確認

```bash
docker-compose ps
```

または

```bash
docker ps
```

## 解決方法

### 方法1: Docker Composeで全サービスを起動（推奨）

```bash
cd C:\devlop\VideoStep
docker-compose up -d
```

このコマンドで以下が起動します：
- Service Registry (Eureka) - `localhost:8761`
- API Gateway - `localhost:8080`
- Video Service - `localhost:8082`
- Auth Service - `localhost:8081`
- User Service - `localhost:8085`
- Translation Service - `localhost:8083`
- Editing Service - `localhost:8084`
- MySQLデータベース（各サービス用）

### 方法2: API Gatewayのみ起動

```bash
cd C:\devlop\VideoStep
docker-compose up -d api-gateway
```

**注意**: API GatewayはService Registryに依存しているため、先にService Registryを起動する必要があります。

```bash
# 1. Service Registryを起動
docker-compose up -d service-registry

# 2. 少し待ってからAPI Gatewayを起動
docker-compose up -d api-gateway
```

### 方法3: 既存のコンテナを再起動

```bash
# API Gatewayコンテナを再起動
docker-compose restart api-gateway
```

## 起動確認

### 1. コンテナが起動しているか確認

```bash
docker ps | findstr api-gateway
```

**期待される出力**:
```
videostep-api-gateway   Up X seconds   0.0.0.0:8080->8080/tcp
```

### 2. API Gatewayのログを確認

```bash
docker logs videostep-api-gateway
```

**正常な起動ログの例**:
```
Started ApiGatewayApplication in X.XXX seconds
Tomcat started on port 8080 (http) with context path ''
```

### 3. ブラウザでアクセス

```
http://localhost:8080/actuator/health
```

**期待される結果**:
```json
{
  "status": "UP"
}
```

## よくある問題と解決方法

### 問題1: ポート8080が既に使用されている

**エラーメッセージ**:
```
Error: bind: address already in use
```

**解決方法**:

1. **ポート8080を使用しているプロセスを確認**:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   ```

2. **プロセスを終了**:
   ```bash
   # プロセスIDを確認してから
   taskkill /PID <プロセスID> /F
   ```

3. **または、docker-compose.ymlでポートを変更**:
   ```yaml
   api-gateway:
     ports:
       - "8081:8080"  # 8081に変更
   ```

### 問題2: Service Registryに接続できない

**エラーログ**:
```
Cannot execute request on any known server
```

**解決方法**:

1. **Service Registryが起動しているか確認**:
   ```bash
   docker ps | findstr service-registry
   ```

2. **Service Registryを先に起動**:
   ```bash
   docker-compose up -d service-registry
   ```

3. **Service Registryのログを確認**:
   ```bash
   docker logs videostep-service-registry
   ```

### 問題3: コンテナがすぐに停止する

**確認方法**:
```bash
docker ps -a | findstr api-gateway
```

**状態が "Exited" の場合**:

1. **ログを確認**:
   ```bash
   docker logs videostep-api-gateway
   ```

2. **エラーの原因を特定**:
   - データベース接続エラー
   - メモリ不足
   - 設定エラー

3. **コンテナを再ビルド**:
   ```bash
   docker-compose build api-gateway
   docker-compose up -d api-gateway
   ```

## 開発時の推奨手順

### 1. 全サービスを起動

```bash
cd C:\devlop\VideoStep
docker-compose up -d
```

### 2. 起動を確認

```bash
# すべてのコンテナが起動しているか確認
docker-compose ps

# 各サービスのヘルスチェック
curl http://localhost:8761/actuator/health  # Service Registry
curl http://localhost:8080/actuator/health  # API Gateway
curl http://localhost:8082/actuator/health  # Video Service
```

### 3. フロントエンドを起動

```bash
cd frontend
npm run dev
```

### 4. ブラウザでアクセス

- フロントエンド: `http://localhost:3000`
- API Gateway: `http://localhost:8080`
- Service Registry: `http://localhost:8761`

## API Gatewayが起動しない場合のトラブルシューティング

### ステップ1: ログを確認

```bash
docker logs videostep-api-gateway --tail 100
```

### ステップ2: コンテナを再作成

```bash
# コンテナを停止して削除
docker-compose down api-gateway

# 再ビルドして起動
docker-compose build api-gateway
docker-compose up -d api-gateway
```

### ステップ3: ネットワークを確認

```bash
# ネットワークが存在するか確認
docker network ls | findstr videostep

# ネットワークが存在しない場合は作成
docker network create videostep_videostep-network
```

### ステップ4: 依存関係を確認

API Gatewayは以下のサービスに依存しています：
- Service Registry (Eureka) - 必須

```bash
# Service Registryが起動しているか確認
docker ps | findstr service-registry
```

## まとめ

`ERR_CONNECTION_REFUSED` エラーは、API Gatewayが起動していないことが原因です。

**解決手順**:
1. `docker-compose up -d` で全サービスを起動
2. `docker ps` でAPI Gatewayが起動しているか確認
3. `http://localhost:8080/actuator/health` でアクセス確認

**注意**: API GatewayはService Registryに依存しているため、先にService Registryを起動する必要があります。

