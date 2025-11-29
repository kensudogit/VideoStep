# Railway環境変数設定 - 完全ガイド

## 🎯 目的

video-service（および他のすべてのサービス）がService Registryに正しく接続できるように、環境変数を設定します。

## ✅ Service RegistryのパブリックURL

```
https://service-registry-production-6ee0.up.railway.app
```

Eureka URL:
```
https://service-registry-production-6ee0.up.railway.app/eureka/
```

## 📋 設定が必要な環境変数

すべてのサービス（video-service, auth-service, user-service, translation-service, editing-service, api-gateway）に以下の4つの環境変数を設定してください：

| 環境変数名 | 値 | 説明 |
|-----------|-----|------|
| `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` | `https://service-registry-production-6ee0.up.railway.app/eureka/` | Service RegistryのパブリックURL |
| `EUREKA_CLIENT_ENABLED` | `true` | Eurekaクライアントを有効化 |
| `EUREKA_CLIENT_REGISTER_WITH_EUREKA` | `true` | Eurekaにサービスを登録 |
| `EUREKA_CLIENT_FETCH_REGISTRY` | `true` | Eurekaレジストリを取得 |

## 🚀 Railwayダッシュボードでの設定手順

### ステップ1: Railwayダッシュボードを開く

1. https://railway.app/dashboard にアクセス
2. 「VideoStep」プロジェクトを選択

### ステップ2: 各サービスで環境変数を設定

以下の各サービスに対して、同じ手順を繰り返します：

#### video-service

1. **video-service**サービスをクリック
2. 「**Variables**」タブを開く
3. 「**+ New Variable**」をクリック
4. 以下の4つの環境変数を追加：

   ```
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE = https://service-registry-production-6ee0.up.railway.app/eureka/
   EUREKA_CLIENT_ENABLED = true
   EUREKA_CLIENT_REGISTER_WITH_EUREKA = true
   EUREKA_CLIENT_FETCH_REGISTRY = true
   ```

5. 各環境変数を保存

#### auth-service

同様の手順で、auth-serviceにも同じ4つの環境変数を設定

#### user-service

同様の手順で、user-serviceにも同じ4つの環境変数を設定

#### translation-service

同様の手順で、translation-serviceにも同じ4つの環境変数を設定

#### editing-service

同様の手順で、editing-serviceにも同じ4つの環境変数を設定

#### api-gateway

同様の手順で、api-gatewayにも同じ4つの環境変数を設定

### ステップ3: 各サービスを再デプロイ

環境変数を設定した後、**必ず各サービスを再デプロイ**してください：

1. 各サービスの「**Deployments**」タブを開く
2. 最新のデプロイメントの「**Redeploy**」ボタンをクリック
3. デプロイが完了するまで待つ（2-3分）

### ステップ4: 接続確認

1. Service Registryダッシュボードにアクセス：
   ```
   https://service-registry-production-6ee0.up.railway.app
   ```

2. 各サービスが登録されていることを確認

3. 各サービスのログでエラーが解消されているか確認

## ⚠️ 重要な注意事項

1. **パブリックURLを使用**: `http://service-registry:8761`は**絶対に使わない**
2. **HTTPSを使用**: RailwayのパブリックURLはHTTPSです
3. **再デプロイ必須**: 環境変数を設定した後、必ず再デプロイする
4. **すべてのサービスに設定**: 1つのサービスだけではなく、すべてのサービスに設定する

## 🔍 環境変数の確認方法

各サービスの「Variables」タブで、以下の4つの環境変数が正しく設定されているか確認：

- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` = `https://service-registry-production-6ee0.up.railway.app/eureka/`
- `EUREKA_CLIENT_ENABLED` = `true`
- `EUREKA_CLIENT_REGISTER_WITH_EUREKA` = `true`
- `EUREKA_CLIENT_FETCH_REGISTRY` = `true`

## 📝 チェックリスト

- [ ] video-service: 4つの環境変数を設定
- [ ] video-service: 再デプロイ
- [ ] auth-service: 4つの環境変数を設定
- [ ] auth-service: 再デプロイ
- [ ] user-service: 4つの環境変数を設定
- [ ] user-service: 再デプロイ
- [ ] translation-service: 4つの環境変数を設定
- [ ] translation-service: 再デプロイ
- [ ] editing-service: 4つの環境変数を設定
- [ ] editing-service: 再デプロイ
- [ ] api-gateway: 4つの環境変数を設定
- [ ] api-gateway: 再デプロイ
- [ ] Service Registryダッシュボードで各サービスが登録されていることを確認
- [ ] 各サービスのログでエラーが解消されていることを確認

## 🆘 トラブルシューティング

### まだエラーが発生する場合

1. 環境変数の値が正しいか再確認（特に`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`）
2. サービスが再デプロイされているか確認
3. 再デプロイ後、数分待ってからログを確認
4. Service Registryが正常に起動しているか確認

### Service Registryにアクセスできない場合

1. Service RegistryのパブリックURLが正しいか確認
2. Service Registryが正常に起動しているか確認
3. RailwayダッシュボードでService Registryのログを確認

