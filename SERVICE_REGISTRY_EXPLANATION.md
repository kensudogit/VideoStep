# Service Registry（Eureka）の必要性と役割

## Service Registryとは

Service Registry（サービスレジストリ）は、マイクロサービスアーキテクチャにおいて、すべてのサービスを登録・管理し、サービス間の通信を可能にする**中央管理システム**です。

VideoStepプロジェクトでは、**Eureka**というSpring Cloudのサービスディスカバリーコンポーネントを使用しています。

## なぜService Registryが必要なのか

### 1. マイクロサービスアーキテクチャの課題

VideoStepプロジェクトは、以下のように複数のマイクロサービスに分割されています：

```
┌─────────────┐
│  Frontend   │
│  (Next.js)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Gateway │ ← すべてのリクエストの入口
└──────┬──────┘
       │
       ├──► Video Service
       ├──► Auth Service
       ├──► User Service
       ├──► Translation Service
       └──► Editing Service
```

### 2. サービス間通信の問題

Service Registryがない場合、以下の問題が発生します：

#### 問題1: サービスアドレスの管理が困難

各サービスが別々のURLで動作する場合：
- Video Service: `https://video-service-abc123.up.railway.app`
- Auth Service: `https://auth-service-xyz789.up.railway.app`
- User Service: `https://user-service-def456.up.railway.app`
- ...

API Gatewayが各サービスのURLを直接知っている必要があります。

#### 問題2: サービスが複数インスタンスで動作する場合

負荷分散のために、同じサービスを複数のインスタンスで動作させる場合：
- Video Service Instance 1: `https://video-service-1.up.railway.app`
- Video Service Instance 2: `https://video-service-2.up.railway.app`
- Video Service Instance 3: `https://video-service-3.up.railway.app`

どのインスタンスにリクエストを送るべきか判断が困難です。

#### 問題3: サービスの動的な追加・削除

新しいサービスインスタンスが追加されたり、既存のインスタンスが停止したりする場合、API Gatewayが自動的に検出できません。

### 3. Service Registryの解決方法

Service Registryを使用することで、以下の問題が解決されます：

#### 解決1: サービス名による通信

API Gatewayは、サービス名（例: `video-service`）でサービスを呼び出すことができます：

```yaml
# API Gatewayの設定
routes:
  - id: video-service
    uri: lb://video-service  # ← サービス名で指定
    predicates:
      - Path=/api/videos/**
```

Service Registryが、サービス名を実際のURLに解決します。

#### 解決2: 自動的な負荷分散

Service Registryが複数のインスタンスを管理し、自動的に負荷分散を行います：

```
API Gateway → Service Registry
                ↓
         Video Service Instance 1
         Video Service Instance 2
         Video Service Instance 3
```

#### 解決3: 動的なサービス検出

サービスが起動すると、自動的にService Registryに登録されます。停止すると、自動的に登録が解除されます。

## Service Registryの動作フロー

### 1. サービス起動時

```
1. Video Serviceが起動
2. Video ServiceがService Registryに登録
   - サービス名: video-service
   - URL: https://video-service-abc123.up.railway.app
   - ステータス: UP
```

### 2. API Gatewayからのリクエスト

```
1. ユーザーが /api/videos にアクセス
2. API GatewayがService Registryに問い合わせ
   - 「video-serviceはどこにある？」
3. Service Registryが応答
   - 「video-serviceは https://video-service-abc123.up.railway.app にあります」
4. API GatewayがVideo Serviceにリクエストを転送
```

### 3. サービス停止時

```
1. Video Serviceが停止
2. Service Registryが検出（ハートビートが停止）
3. Service Registryから登録を解除
4. API Gatewayは停止したサービスにリクエストを送らない
```

## VideoStepプロジェクトでの具体的な使用例

### API Gatewayの設定

```yaml
# services/api-gateway/src/main/resources/application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: video-service
          uri: lb://video-service  # ← Service Registry経由で解決
          predicates:
            - Path=/api/videos/**
        - id: auth-service
          uri: lb://auth-service
          predicates:
            - Path=/api/auth/**
```

### 各サービスの設定

```yaml
# services/video-service/src/main/resources/application.yml
eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE:https://service-registry-production-6ee0.up.railway.app/eureka/}
    register-with-eureka: true  # Service Registryに登録
    fetch-registry: true         # Service Registryから他のサービス情報を取得
```

## Service Registryがない場合の問題

### 現在の502エラーの原因

Service Registryがデプロイされていないため：

1. **API GatewayがService Registryに接続できない**
   ```
   Cannot execute request on any known server
   ```

2. **各サービスを検出できない**
   - API Gatewayが`lb://video-service`を解決できない
   - 実際のURLがわからない

3. **502 Bad Gatewayエラーが発生**
   - API Gatewayがサービスを見つけられない
   - リクエストを転送できない

## Service Registryの利点まとめ

### 1. サービス検出の自動化
- サービスが起動すると自動的に登録
- サービスが停止すると自動的に登録解除

### 2. 負荷分散
- 複数のインスタンスを自動的に管理
- リクエストを分散
 
### 3. サービス名による通信
- 実際のURLを知る必要がない
- サービス名だけで通信可能

### 4. 動的なスケーリング
- 新しいインスタンスを追加しても自動的に検出
- 停止したインスタンスを自動的に除外

### 5. ヘルスチェック
- 各サービスの状態を監視
- 正常なサービスにのみリクエストを転送

## 結論

Service Registryは、マイクロサービスアーキテクチャにおいて**必須のコンポーネント**です。

VideoStepプロジェクトでは：
- **Service Registryがなければ、API Gatewayが各サービスを見つけられません**
- **502 Bad Gatewayエラーの根本原因は、Service Registryがデプロイされていないことです**

Service Registryをデプロイし、正常に起動させることで、502エラーが解決されます。

## 次のステップ

1. **Service Registryをデプロイ**（最優先）
2. Service RegistryのパブリックURLを確認
3. 各サービスの環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`を設定
4. 各サービスを再デプロイ
5. Service RegistryのEurekaダッシュボードで、すべてのサービスが登録されていることを確認

