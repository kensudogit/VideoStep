# Railway Eureka接続エラー修正 - 即座に実行

## ✅ Service RegistryのパブリックURL

```
https://service-registry-production-6ee0.up.railway.app
```

Eureka URL:
```
https://service-registry-production-6ee0.up.railway.app/eureka/
```

## 🚀 修正手順（Railwayダッシュボード）

### ステップ1: Railwayダッシュボードを開く

```bash
railway open
```

またはブラウザで https://railway.app/dashboard にアクセス

### ステップ2: 各サービスで環境変数を設定

以下の各サービスに対して、Railwayダッシュボードで環境変数を設定してください：

#### Video Service

1. Railwayダッシュボードで「VideoStep」プロジェクトを開く
2. `video-service`サービスを選択（まだデプロイされていない場合は先にデプロイ）
3. 「Variables」タブを開く
4. 以下の環境変数を追加/更新：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

#### Auth Service

同様に`auth-service`で以下を設定：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

#### User Service

同様に`user-service`で以下を設定：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

#### Translation Service

同様に`translation-service`で以下を設定：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

#### Editing Service

同様に`editing-service`で以下を設定：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

#### API Gateway

同様に`api-gateway`で以下を設定：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

### ステップ3: サービスを再デプロイ

環境変数を設定した後、各サービスを再デプロイ：

1. 各サービスの「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック
3. または、GitHubにプッシュして自動デプロイをトリガー

### ステップ4: 接続確認

1. Service Registryダッシュボードにアクセス：
   ```
   https://service-registry-production-6ee0.up.railway.app
   ```

2. 各サービスが登録されていることを確認

3. 各サービスのログでエラーが解消されていることを確認

## 📋 環境変数設定のチェックリスト

- [ ] Video Service: `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` を設定
- [ ] Video Service: `EUREKA_CLIENT_ENABLED=true` を設定
- [ ] Video Service: `EUREKA_CLIENT_REGISTER_WITH_EUREKA=true` を設定
- [ ] Video Service: `EUREKA_CLIENT_FETCH_REGISTRY=true` を設定
- [ ] Auth Service: 上記4つの環境変数を設定
- [ ] User Service: 上記4つの環境変数を設定
- [ ] Translation Service: 上記4つの環境変数を設定
- [ ] Editing Service: 上記4つの環境変数を設定
- [ ] API Gateway: 上記4つの環境変数を設定
- [ ] すべてのサービスを再デプロイ
- [ ] Service Registryダッシュボードで各サービスが登録されていることを確認

## 🔍 トラブルシューティング

### まだエラーが発生する場合

1. Service RegistryのパブリックURLが正しいか確認
2. 環境変数が正しく設定されているか確認（Railwayダッシュボードの「Variables」タブで確認）
3. サービスが再デプロイされているか確認
4. Service Registryが正常に起動しているか確認

### Service Registryにアクセスできない場合

1. Service RegistryのパブリックURLが生成されているか確認
2. Service Registryが正常に起動しているか確認
3. RailwayダッシュボードでService Registryのログを確認

