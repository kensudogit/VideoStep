# Railwayで動作しない理由 - 完全解説

## 🔴 主な問題点

### 1. **Eureka接続の問題（最重要）**

#### ローカル環境（動作する）
```yaml
# docker-compose.yml
environment:
  - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```
- Docker Composeの内部ネットワークで `service-registry` というホスト名で通信可能
- すべてのサービスが同じネットワーク上で動作

#### Railway環境（動作しない）
```yaml
# application.yml（現在の設定）
defaultZone: ${EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE:https://service-registry-production-6ee0.up.railway.app/eureka/}
```
- ❌ 各サービスが個別のコンテナとして動作
- ❌ 内部DNS名（`service-registry`）は使えない
- ❌ 環境変数が設定されていない場合、デフォルト値が使われるが、`enabled`、`register-with-eureka`、`fetch-registry`が`false`のまま

**問題の詳細:**
- `EUREKA_CLIENT_ENABLED=false` → Eurekaクライアントが無効
- `register-with-eureka=false` → Service Registryに登録しない
- `fetch-registry=false` → サービスディスカバリーが機能しない

### 2. **フロントエンドとバックエンドの接続問題**

#### ローカル環境（動作する）
```typescript
// frontend/src/utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
```
- フロントエンド（localhost:3000）→ バックエンド（localhost:8080）
- 同一ホストで動作

#### Railway環境（動作しない）
- ❌ フロントエンド（Vercel）が `http://localhost:8080` に接続しようとする
- ❌ `NEXT_PUBLIC_API_BASE_URL` が設定されていない
- ❌ API GatewayのパブリックURLが設定されていない

**現在の状態:**
- フロントエンドは `localhost:8080` に接続しようとする
- RailwayのAPI Gatewayは別のドメインで動作している
- 接続が失敗する

### 3. **API GatewayのEureka設定**

#### 現在の設定
```yaml
# services/api-gateway/src/main/resources/application.yml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/  # ❌ ローカルのみ
```

**問題:**
- Railwayでは `http://localhost:8761` は使えない
- パブリックURL（`https://service-registry-production-6ee0.up.railway.app/eureka/`）が必要

### 4. **サービス間通信の問題**

#### ローカル環境（動作する）
```yaml
# API Gatewayのルーティング
uri: lb://video-service  # Eureka経由でサービスを発見
```
- Eurekaが正常に動作
- サービスディスカバリーが機能
- Load Balancerがサービスを見つけられる

#### Railway環境（動作しない）
- ❌ Eurekaが無効化されている
- ❌ サービスがService Registryに登録されていない
- ❌ `lb://video-service` が解決できない
- ❌ API Gatewayがバックエンドサービスを見つけられない

### 5. **データベース接続の問題**

#### ローカル環境（動作する）
```yaml
# docker-compose.yml
SPRING_DATASOURCE_URL=jdbc:mysql://mysql-video:3306/videostep_video?useSSL=false&allowPublicKeyRetrieval=true
```
- Docker ComposeのMySQLコンテナに接続
- 内部ネットワークで通信可能

#### Railway環境（動作しない可能性）
- ❌ `SPRING_DATASOURCE_URL` が設定されていない
- ❌ Railway MySQLサービスの接続情報が設定されていない
- ❌ デフォルト値が使われるが、Railway MySQLに接続できない

## 📋 解決方法

### ステップ1: Eureka環境変数を設定

Railwayダッシュボードで**すべてのサービス**に以下を設定：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

**対象サービス:**
- ✅ service-registry（既にデプロイ済み）
- ❌ api-gateway
- ❌ video-service
- ❌ auth-service
- ❌ user-service
- ❌ translation-service
- ❌ editing-service

### ステップ2: データベース接続情報を設定

各サービスにRailway MySQLの接続情報を設定：

```
SPRING_DATASOURCE_URL=jdbc:mysql://mysql-production-xxxx.up.railway.app:3306/videostep_video?useSSL=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=xxxxx
```

### ステップ3: フロントエンドのAPI URLを設定

Vercelダッシュボードで：

```
NEXT_PUBLIC_API_BASE_URL=https://api-gateway-production-xxxx.up.railway.app
```

**重要**: API GatewayのパブリックURLを設定する必要があります。

### ステップ4: 各サービスを再デプロイ

環境変数を設定した後、**必ず各サービスを再デプロイ**してください。

## 🔍 確認方法

### 1. Service Registryダッシュボード
```
https://service-registry-production-6ee0.up.railway.app
```
- 各サービスが登録されているか確認

### 2. API Gatewayのログ
- サービスディスカバリーエラーがないか確認
- `lb://video-service` が解決できているか確認

### 3. フロントエンドのブラウザコンソール
- API呼び出しのエラーを確認
- CORSエラーがないか確認

## 📊 問題の優先順位

1. **最優先**: Eureka環境変数の設定（すべてのサービス）
2. **高**: フロントエンドのAPI URL設定（Vercel）
3. **中**: データベース接続情報の設定
4. **低**: API GatewayのEureka設定（application.ymlの修正）

## ✅ チェックリスト

- [ ] Service Registryが起動している
- [ ] すべてのサービスにEureka環境変数を設定
- [ ] すべてのサービスを再デプロイ
- [ ] Service Registryダッシュボードで各サービスが登録されている
- [ ] API GatewayのパブリックURLを確認
- [ ] Vercelで `NEXT_PUBLIC_API_BASE_URL` を設定
- [ ] データベース接続情報を設定
- [ ] フロントエンドからAPIを呼び出して動作確認

## 🎯 まとめ

**Railwayで動作しない主な理由:**

1. **Eureka接続が無効化されている** → サービスディスカバリーが機能しない
2. **フロントエンドがlocalhostに接続しようとする** → API GatewayのURLが設定されていない
3. **サービス間通信ができない** → Eurekaが機能していないため
4. **データベース接続情報が不足** → 環境変数が設定されていない

**解決策:**
- すべてのサービスにEureka環境変数を設定
- フロントエンドにAPI GatewayのURLを設定
- データベース接続情報を設定
- すべてのサービスを再デプロイ

