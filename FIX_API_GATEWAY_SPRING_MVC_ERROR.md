# API Gateway起動エラー修正: Spring MVC競合

## エラーの原因

API Gatewayが起動に失敗し、以下のエラーが発生しています：

```
Spring MVC found on classpath, which is incompatible with Spring Cloud Gateway.

Action:
Please set spring.main.web-application-type=reactive or remove spring-boot-starter-web dependency.
```

**原因**: `spring-boot-starter-web`（Spring MVC）と`spring-cloud-starter-gateway`（Spring Cloud Gateway）が競合しています。Spring Cloud Gatewayはリアクティブなアプリケーションタイプが必要です。

## 修正内容

### 1. build.gradleの修正

`spring-boot-starter-web`依存関係を削除しました：

```gradle
dependencies {
    // Spring Cloud Gatewayはリアクティブなアプリケーションなので、spring-boot-starter-webは不要
    // implementation 'org.springframework.boot:spring-boot-starter-web' // Spring Cloud Gatewayと競合するため削除
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
    implementation 'org.springframework.cloud:spring-cloud-starter-gateway'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    // ...
}
```

### 2. application.ymlの修正

`web-application-type: reactive`を明示的に設定しました：

```yaml
spring:
  application:
    name: api-gateway
  # Spring Cloud Gatewayはリアクティブなアプリケーションタイプが必要
  main:
    web-application-type: reactive
```

## 修正後の起動手順

### ステップ1: 変更をコミット

```bash
cd C:\devlop\VideoStep
git add services/api-gateway/build.gradle services/api-gateway/src/main/resources/application.yml
git commit -m "fix: Remove spring-boot-starter-web from API Gateway to fix Spring MVC conflict"
git push origin main
```

### ステップ2: API Gatewayコンテナを停止

```bash
docker-compose stop api-gateway
```

または、既に停止している場合は：

```bash
docker-compose rm -f api-gateway
```

### ステップ3: API Gatewayを再ビルド

```bash
docker-compose build api-gateway
```

### ステップ4: API Gatewayを起動

```bash
docker-compose up -d api-gateway
```

### ステップ5: 起動を確認

```bash
# コンテナの状態を確認
docker ps | findstr api-gateway

# ログを確認
docker logs videostep-api-gateway --tail 50

# ヘルスチェック
curl http://localhost:8080/actuator/health
```

## 期待される結果

### 正常な起動ログ

```
Started ApiGatewayApplication in X.XXX seconds
Tomcat started on port 8080 (http) with context path ''
```

### ヘルスチェック

```
GET http://localhost:8080/actuator/health

{
  "status": "UP"
}
```

## トラブルシューティング

### 問題1: ビルドが失敗する

**エラー**: `Could not resolve all files for configuration`

**解決方法**:
```bash
# キャッシュをクリアして再ビルド
docker-compose build --no-cache api-gateway
```

### 問題2: まだエラーが発生する

**確認事項**:
1. `build.gradle`から`spring-boot-starter-web`が完全に削除されているか
2. `application.yml`に`spring.main.web-application-type: reactive`が設定されているか

**確認コマンド**:
```bash
# build.gradleを確認
grep -n "spring-boot-starter-web" services/api-gateway/build.gradle

# application.ymlを確認
grep -n "web-application-type" services/api-gateway/src/main/resources/application.yml
```

### 問題3: ポート8080が使用されている

**エラー**: `bind: address already in use`

**解決方法**:
```bash
# ポート8080を使用しているプロセスを確認
netstat -ano | findstr :8080

# プロセスを終了
taskkill /PID <プロセスID> /F
```

## まとめ

API Gatewayの起動エラーは、`spring-boot-starter-web`と`spring-cloud-starter-gateway`の競合が原因でした。

**修正内容**:
1. ✅ `build.gradle`から`spring-boot-starter-web`を削除
2. ✅ `application.yml`に`web-application-type: reactive`を追加

**次のステップ**:
1. 変更をコミット
2. API Gatewayを再ビルド
3. API Gatewayを起動
4. 動作確認

これで`localhost:8080`に正常に接続できるようになります。

