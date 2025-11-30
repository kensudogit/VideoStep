# API Gateway接続エラー修正まとめ

## 問題

`localhost:8080`に接続できないエラー（`ERR_CONNECTION_REFUSED`）が発生していました。

## 原因

API Gatewayが起動に失敗していました。エラーログ：

```
Spring MVC found on classpath, which is incompatible with Spring Cloud Gateway.

Action:
Please set spring.main.web-application-type=reactive or remove spring-boot-starter-web dependency.
```

**根本原因**: `spring-boot-starter-web`（Spring MVC）と`spring-cloud-starter-gateway`（Spring Cloud Gateway）が競合していました。

## 修正内容

### ✅ 修正1: build.gradle

`spring-boot-starter-web`依存関係を削除（コメントアウト）：

```gradle
dependencies {
    // Spring Cloud Gatewayはリアクティブなアプリケーションなので、spring-boot-starter-webは不要
    // implementation 'org.springframework.boot:spring-boot-starter-web' // Spring Cloud Gatewayと競合するため削除
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    // ...
}
```

### ✅ 修正2: application.yml

`web-application-type: reactive`を明示的に設定：

```yaml
spring:
  application:
    name: api-gateway
  # Spring Cloud Gatewayはリアクティブなアプリケーションタイプが必要
  main:
    web-application-type: reactive
```

## 修正後の実行手順

### 方法1: バッチファイルで自動実行（推奨）

```cmd
cd C:\devlop\VideoStep
EXECUTE_API_GATEWAY_FIX.bat
```

このバッチファイルが以下を自動実行します：
1. 既存のAPI Gatewayコンテナを削除
2. API Gatewayを再ビルド
3. Service Registryの状態を確認・起動
4. API Gatewayを起動
5. 起動確認

### 方法2: 手動で実行

#### PowerShell版

```powershell
cd C:\devlop\VideoStep

# 1. 既存のコンテナを削除
docker-compose rm -f api-gateway

# 2. 再ビルド
docker-compose build api-gateway

# 3. Service Registryが起動しているか確認
docker ps | findstr service-registry

# 4. API Gatewayを起動
docker-compose up -d api-gateway

# 5. ログを確認（10秒待ってから）
Start-Sleep -Seconds 10
docker logs videostep-api-gateway --tail 50
```

#### CMD版

```cmd
cd C:\devlop\VideoStep

REM 1. 既存のコンテナを削除
docker-compose rm -f api-gateway

REM 2. 再ビルド
docker-compose build api-gateway

REM 3. Service Registryが起動しているか確認
docker ps | findstr service-registry

REM 4. API Gatewayを起動
docker-compose up -d api-gateway

REM 5. 10秒待機
timeout /t 10

REM 6. ログを確認
docker logs videostep-api-gateway --tail 50
```

### 確認方法

1. **コンテナの状態**:
   ```bash
   docker ps | findstr api-gateway
   ```
   → `STATUS`が`Up`になっていることを確認

2. **ログ確認**:
   ```bash
   docker logs videostep-api-gateway --tail 50
   ```
   → `Started ApiGatewayApplication`というメッセージを確認

3. **ヘルスチェック**:
   - ブラウザで `http://localhost:8080/actuator/health` にアクセス
   - または PowerShellで: `Invoke-WebRequest -Uri http://localhost:8080/actuator/health`

## 期待される結果

### 正常な起動ログ

```
Started ApiGatewayApplication in X.XXX seconds
```

### ヘルスチェック結果

```json
{
  "status": "UP"
}
```

## トラブルシューティング

### まだエラーが発生する場合

1. **ビルドが失敗する**:
   ```bash
   docker-compose build --no-cache api-gateway
   ```

2. **ポート8080が使用されている**:
   ```bash
   netstat -ano | findstr :8080
   taskkill /PID <プロセスID> /F
   ```

3. **Service Registryに接続できない**:
   ```bash
   # Service Registryを先に起動
   docker-compose up -d service-registry
   # 10-20秒待ってから
   docker-compose up -d api-gateway
   ```

## 次のステップ

API Gatewayが正常に起動したら：

1. **フロントエンドからアクセス**:
   - `http://localhost:3000` でフロントエンドを起動
   - API Gateway経由でVideo Serviceにアクセスできることを確認

2. **APIエンドポイントの確認**:
   - `http://localhost:8080/api/videos/public` にアクセス
   - 動画一覧データが返されることを確認

## まとめ

✅ **修正完了**: `spring-boot-starter-web`を削除し、`web-application-type: reactive`を設定  
✅ **次のアクション**: API Gatewayを再ビルドして起動

詳細は `FIX_API_GATEWAY_SPRING_MVC_ERROR.md` を参照してください。

