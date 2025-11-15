# Eurekaサービス登録問題の修正ガイド

## 問題の症状

- Eurekaダッシュボードに「No instances available」と表示される
- 緊急メッセージが表示される
- 他のサービス（Auth Service、Video Serviceなど）がEurekaに登録されていない

## 原因

各サービスがEureka Service Registryに接続するための環境変数が設定されていないため、サービスがEurekaに登録されていません。

## 解決方法

### 方法1: Railwayダッシュボードで環境変数を設定（推奨）

各サービス（Auth Service、Video Service、API Gatewayなど）で以下の環境変数を設定します：

#### 1. Auth Service

1. Railwayダッシュボードで **Auth Service** を開く
2. **Settings** → **Variables** を開く
3. 以下の環境変数を追加：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

#### 2. Video Service

1. Railwayダッシュボードで **Video Service** を開く
2. **Settings** → **Variables** を開く
3. 以下の環境変数を追加：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

#### 3. API Gateway

1. Railwayダッシュボードで **API Gateway** を開く
2. **Settings** → **Variables** を開く
3. 以下の環境変数を追加：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

#### 4. Translation Service

1. Railwayダッシュボードで **Translation Service** を開く
2. **Settings** → **Variables** を開く
3. 以下の環境変数を追加：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

#### 5. Editing Service

1. Railwayダッシュボードで **Editing Service** を開く
2. **Settings** → **Variables** を開く
3. 以下の環境変数を追加：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

#### 6. User Service

1. Railwayダッシュボードで **User Service** を開く
2. **Settings** → **Variables** を開く
3. 以下の環境変数を追加：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

### 方法2: Railway CLIで環境変数を設定

```bash
# Auth Service
cd C:\devlop\VideoStep\services\auth-service
railway link
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/

# Video Service
cd C:\devlop\VideoStep\services\video-service
railway link
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/

# API Gateway
cd C:\devlop\VideoStep\services\api-gateway
railway link
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/

# Translation Service
cd C:\devlop\VideoStep\services\translation-service
railway link
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/

# Editing Service
cd C:\devlop\VideoStep\services\editing-service
railway link
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/

# User Service
cd C:\devlop\VideoStep\services\user-service
railway link
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

## 重要なポイント

### Service Registryのサービス名

Railwayでは、サービス間の通信に**サービス名**を使用します。Service Registryのサービス名は `service-registry` です。

### 環境変数の形式

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
```

- `service-registry`: Railwayのサービス名（Railwayダッシュボードで確認可能）
- `8761`: Service Registryのポート番号
- `/eureka/`: Eurekaのエンドポイント

## 確認手順

### 1. 環境変数が設定されているか確認

各サービスのRailwayダッシュボードで：
1. **Settings** → **Variables** を開く
2. `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` が設定されているか確認

### 2. サービスが再デプロイされているか確認

環境変数を追加/変更した後、サービスが自動的に再デプロイされます。デプロイが完了するまで待ちます。

### 3. Eurekaダッシュボードで確認

1. Service RegistryのURLにアクセス
2. 「Instances currently registered with Eureka」セクションを確認
3. 登録されたサービスが表示されることを確認

期待される表示：
- **auth-service**
- **video-service**
- **api-gateway**
- **translation-service**
- **editing-service**
- **user-service**

### 4. ログを確認

各サービスのログで、Eurekaへの接続が成功しているか確認：

```
DiscoveryClient_AUTH-SERVICE/xxx: registering service...
DiscoveryClient_AUTH-SERVICE/xxx: registration status: 204
```

## トラブルシューティング

### サービスが登録されない場合

1. **Service Registryが起動しているか確認**
   - Service Registryのログを確認
   - Health Checkエンドポイントにアクセス: `https://service-registry-url/actuator/health`

2. **環境変数が正しく設定されているか確認**
   - サービス名が `service-registry` であることを確認
   - ポート番号が `8761` であることを確認

3. **サービスが同じプロジェクト内にあるか確認**
   - Railwayでは、同じプロジェクト内のサービス間で通信できます
   - 異なるプロジェクトの場合は、公開URLを使用する必要があります

4. **ネットワーク設定を確認**
   - 各サービスが同じRailwayプロジェクト内にあることを確認

### 緊急メッセージが表示される場合

「EMERGENCY! EUREKA MAY BE INCORRECTLY CLAIMING INSTANCES ARE UP...」というメッセージは、サービスが登録されていない場合に表示されます。上記の手順で環境変数を設定し、サービスを再デプロイすると解消されます。

## まとめ

1. ✅ 各サービスに `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/` を設定
2. ✅ サービスが再デプロイされるまで待つ
3. ✅ Eurekaダッシュボードでサービスが登録されているか確認
4. ✅ ログで接続が成功しているか確認

これで、すべてのサービスがEurekaに登録され、マイクロサービス間の通信が可能になります！

