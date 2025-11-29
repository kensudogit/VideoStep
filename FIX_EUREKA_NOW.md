# 🚨 Eureka接続エラー修正 - 今すぐ実行

## 問題

video-serviceが`http://service-registry:8761`に接続できず、エラーが発生しています。

## 解決方法

### ✅ Service RegistryのパブリックURL

```
https://service-registry-production-6ee0.up.railway.app
```

### 📝 各サービスで設定する環境変数

Railwayダッシュボードで、以下の**4つの環境変数**を各サービスに設定してください：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

### 🎯 設定が必要なサービス

1. **video-service** ← 現在エラーが発生しているサービス
2. auth-service
3. user-service
4. translation-service
5. editing-service
6. api-gateway

### 📋 手順

1. Railwayダッシュボードを開く: https://railway.app/dashboard
2. 「VideoStep」プロジェクトを選択
3. 各サービスを開く
4. 「Variables」タブで上記4つの環境変数を設定
5. 各サービスを再デプロイ（「Deployments」→「Redeploy」）

### ✅ 確認

Service Registryダッシュボードで各サービスが登録されていることを確認：
https://service-registry-production-6ee0.up.railway.app

---

**詳細は `RAILWAY_EUREKA_FIX_NOW.md` を参照してください**

