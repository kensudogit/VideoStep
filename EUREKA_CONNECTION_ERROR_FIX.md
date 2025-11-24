# Eureka接続エラー対応ガイド

## 問題の症状

ログに以下のようなエラーが繰り返し表示される：

```
Connect to http://localhost:8761 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused
DiscoveryClient_VIDEO-SERVICE/xxx:video-service:8082 - registration failed Cannot execute request on any known server
DiscoveryClient_VIDEO-SERVICE/xxx:video-service:8082 - was unable to send heartbeat!
```

## 原因

1. **Eurekaサーバーが起動していない**
   - Service Registry が起動していない
   - ポート 8761 でリッスンしていない

2. **Eurekaクライアントの設定が不適切**
   - `localhost:8761` に接続しようとしているが、Docker環境では `service-registry:8761` を使用する必要がある
   - Eurekaクライアントが有効になっているが、Eurekaサーバーに接続できない

3. **ログレベルが適切でない**
   - Eureka接続エラーが大量にログに出力される

## 実施した修正

### 1. `application.yml` の修正

#### EurekaクライアントのデフォルトURLを変更

```yaml
eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE:http://service-registry:8761/eureka/}
```

- デフォルト値を `http://localhost:8761/eureka/` から `http://service-registry:8761/eureka/` に変更
- Docker環境で正しく動作するように修正

#### ログレベルの調整

```yaml
logging:
  level:
    com.videostep: DEBUG
    # Eureka接続エラーを抑制（Eurekaサーバーが利用できない場合でもアプリケーションを起動できるようにする）
    com.netflix.discovery: WARN
    com.netflix.eureka: WARN
    org.springframework.cloud.netflix.eureka: WARN
    org.springframework.cloud.netflix.eureka.http: WARN
```

- Eureka関連のログを WARN レベルに設定
- 接続エラーが大量にログに出力されることを抑制

#### サービスディスカバリーの無効化設定を強化

```yaml
spring:
  cloud:
    discovery:
      enabled: ${SPRING_CLOUD_DISCOVERY_ENABLED:false}
    loadbalancer:
      enabled: false
```

- サービスディスカバリーをデフォルトで無効化
- LoadBalancer も無効化

### 2. Eurekaクライアントの設定

```yaml
eureka:
  client:
    enabled: ${EUREKA_CLIENT_ENABLED:false}
    register-with-eureka: ${EUREKA_CLIENT_REGISTER_WITH_EUREKA:false}
    fetch-registry: ${EUREKA_CLIENT_FETCH_REGISTRY:false}
```

- Eurekaクライアントをデフォルトで無効化
- 環境変数で有効化可能

## 解決方法

### 方法1: Eurekaサーバーを起動する（推奨）

Docker Compose を使用している場合：

```bash
cd C:\devlop\VideoStep
docker-compose up -d service-registry
```

### 方法2: Eurekaクライアントを完全に無効化する

環境変数を設定：

```bash
# Docker Compose の場合
EUREKA_CLIENT_ENABLED=false
SPRING_CLOUD_DISCOVERY_ENABLED=false
```

または、`application.yml` のデフォルト値（`false`）が使用されます。

### 方法3: EurekaサーバーのURLを正しく設定する

Docker環境の場合：

```bash
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

ローカル環境の場合：

```bash
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://localhost:8761/eureka/
```

## 確認手順

### 1. Eurekaサーバーが起動しているか確認

```bash
# Docker Compose の場合
docker-compose ps service-registry

# ログを確認
docker-compose logs service-registry
```

### 2. ポートがリッスンしているか確認

```bash
# ローカル環境の場合
curl http://localhost:8761/actuator/health

# Docker環境の場合
docker-compose exec service-registry curl http://localhost:8761/actuator/health
```

### 3. アプリケーションのログを確認

Eureka接続エラーが WARN レベル以下に抑制されていることを確認：

```bash
docker-compose logs video-service | grep -i eureka
```

## トラブルシューティング

### 問題: Eurekaサーバーに接続できない

**原因:**
- Eurekaサーバーが起動していない
- ネットワーク設定が間違っている
- ポートがブロックされている

**解決方法:**
1. Eurekaサーバーを起動する
2. ネットワーク設定を確認する
3. ファイアウォール設定を確認する

### 問題: ログに大量のエラーメッセージが表示される

**原因:**
- Eurekaクライアントが有効になっているが、Eurekaサーバーに接続できない

**解決方法:**
1. ログレベルを WARN に設定（既に実施済み）
2. Eurekaクライアントを無効化する
3. Eurekaサーバーを起動する

### 問題: アプリケーションが起動しない

**原因:**
- Eurekaクライアントが有効になっていて、Eurekaサーバーへの接続を待っている

**解決方法:**
1. Eurekaクライアントを無効化する
2. Eurekaサーバーを起動する

## まとめ

1. ✅ EurekaクライアントのデフォルトURLを `service-registry:8761` に変更
2. ✅ Eureka関連のログレベルを WARN に設定
3. ✅ サービスディスカバリーをデフォルトで無効化
4. ✅ Eurekaクライアントをデフォルトで無効化

これにより、Eurekaサーバーが利用できない場合でも、アプリケーションが正常に起動し、ログに大量のエラーメッセージが表示されなくなります。

Eurekaサーバーが必要な場合は、環境変数で有効化できます：

```bash
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

