# Railway Eureka接続エラー修正ガイド

## 問題の概要

ログに以下のエラーが繰り返し発生しています：
```
I/O error on POST request for "http://service-registry:8761/eureka/apps/VIDEO-SERVICE": service-registry
Cannot execute request on any known server
```

## 原因

Railwayでは各サービスが個別のコンテナとして動作するため、内部DNS名（`service-registry`）では解決できません。Service RegistryのパブリックURLを使用する必要があります。

## 解決方法

### ステップ1: Service RegistryのパブリックURLを確認

1. Railwayダッシュボードにアクセス
2. `service-registry`サービスを開く
3. 「Settings」→「Networking」でパブリックURLを確認
4. URLをコピー（例: `https://service-registry-production.up.railway.app`）

### ステップ2: 各サービスの環境変数を更新

Railwayダッシュボードで、以下の各サービスに対して環境変数を設定/更新します：

#### Video Service
```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://[Service RegistryのパブリックURL]/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

#### Auth Service
```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://[Service RegistryのパブリックURL]/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

#### User Service
```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://[Service RegistryのパブリックURL]/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

#### Translation Service
```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://[Service RegistryのパブリックURL]/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

#### Editing Service
```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://[Service RegistryのパブリックURL]/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

#### API Gateway
```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://[Service RegistryのパブリックURL]/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

### ステップ3: Railway CLIで環境変数を設定（オプション）

コマンドラインから設定する場合：

```bash
# Service RegistryのパブリックURLを変数に設定
export SERVICE_REGISTRY_URL="https://service-registry-production.up.railway.app"

# Video Service
cd C:\devlop\VideoStep
railway service video-service
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE="${SERVICE_REGISTRY_URL}/eureka/"
railway variables set EUREKA_CLIENT_ENABLED=true
railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true

# Auth Service
railway service auth-service
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE="${SERVICE_REGISTRY_URL}/eureka/"
railway variables set EUREKA_CLIENT_ENABLED=true
railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true

# User Service
railway service user-service
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE="${SERVICE_REGISTRY_URL}/eureka/"
railway variables set EUREKA_CLIENT_ENABLED=true
railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true

# Translation Service
railway service translation-service
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE="${SERVICE_REGISTRY_URL}/eureka/"
railway variables set EUREKA_CLIENT_ENABLED=true
railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true

# Editing Service
railway service editing-service
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE="${SERVICE_REGISTRY_URL}/eureka/"
railway variables set EUREKA_CLIENT_ENABLED=true
railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true

# API Gateway
railway service api-gateway
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE="${SERVICE_REGISTRY_URL}/eureka/"
railway variables set EUREKA_CLIENT_ENABLED=true
railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true
```

### ステップ4: サービスを再デプロイ

環境変数を更新した後、各サービスを再デプロイします：

1. Railwayダッシュボードで各サービスを開く
2. 「Deployments」タブで「Redeploy」をクリック
3. または、GitHubにプッシュして自動デプロイをトリガー

### ステップ5: 接続確認

1. Service Registryのダッシュボードにアクセス：
   ```
   https://[Service RegistryのパブリックURL]
   ```

2. 各サービスが登録されていることを確認

3. 各サービスのログを確認して、エラーが解消されていることを確認

## 重要な注意事項

1. **パブリックURLを使用**: Railwayでは内部DNS名（`service-registry`）は使えません。必ずパブリックURL（`https://service-registry-production.up.railway.app`）を使用してください。

2. **HTTPSを使用**: RailwayのパブリックURLはHTTPSを使用します。`http://`ではなく`https://`を使用してください。

3. **Eurekaクライアントを有効化**: 現在、各サービスの`application.yml`で`EUREKA_CLIENT_ENABLED=false`になっているため、環境変数で`true`に設定する必要があります。

4. **Service Registryを先にデプロイ**: Service Registryが正常に動作していることを確認してから、他のサービスをデプロイしてください。

## トラブルシューティング

### まだ接続エラーが発生する場合

1. Service RegistryのパブリックURLが正しいか確認
2. Service Registryが正常に起動しているか確認
3. 環境変数が正しく設定されているか確認
4. サービスが再デプロイされているか確認

### Service Registryにアクセスできない場合

1. Service RegistryのパブリックURLが生成されているか確認
2. Service Registryが正常に起動しているか確認
3. RailwayダッシュボードでService Registryのログを確認

