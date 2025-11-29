# 🚨 緊急: Eureka接続エラー修正

## 現在の状況

video-serviceが`http://service-registry:8761`に接続しようとして失敗しています。
ログには以下のエラーが繰り返し発生しています：

```
I/O error on POST request for "http://service-registry:8761/eureka/apps/VIDEO-SERVICE": service-registry
Cannot execute request on any known server
```

## 原因

Railwayでは各サービスが個別のコンテナとして動作するため、内部DNS名（`service-registry`）は使えません。
**Service RegistryのパブリックURLを使用する必要があります。**

## ✅ 解決方法（今すぐ実行）

### ステップ1: Railwayダッシュボードを開く

1. https://railway.app/dashboard にアクセス
2. 「VideoStep」プロジェクトを選択

### ステップ2: video-serviceの環境変数を設定

1. **video-service**サービスを開く（サービス名が異なる場合は、video-serviceが動作しているサービスを探す）
2. 「Variables」タブを開く
3. 以下の環境変数を**追加または更新**：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
```

**重要**: 
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値は**必ず**`https://service-registry-production-6ee0.up.railway.app/eureka/`に設定してください
- `http://service-registry:8761/eureka/`は**使えません**

### ステップ3: video-serviceを再デプロイ

1. 「Deployments」タブを開く
2. 最新のデプロイメントの「Redeploy」ボタンをクリック
3. または、GitHubにプッシュして自動デプロイをトリガー

### ステップ4: 接続確認

1. 再デプロイ後、数分待つ
2. video-serviceのログを確認して、エラーが解消されているか確認
3. Service Registryダッシュボードにアクセス：
   ```
   https://service-registry-production-6ee0.up.railway.app
   ```
4. video-serviceが登録されていることを確認

## 🔍 環境変数の確認方法

Railwayダッシュボードで：
1. video-serviceサービスを開く
2. 「Variables」タブを開く
3. 以下の4つの環境変数が正しく設定されているか確認：
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` = `https://service-registry-production-6ee0.up.railway.app/eureka/`
   - `EUREKA_CLIENT_ENABLED` = `true`
   - `EUREKA_CLIENT_REGISTER_WITH_EUREKA` = `true`
   - `EUREKA_CLIENT_FETCH_REGISTRY` = `true`

## ⚠️ よくある間違い

1. ❌ `http://service-registry:8761/eureka/` を使用している
   ✅ `https://service-registry-production-6ee0.up.railway.app/eureka/` を使用する

2. ❌ 環境変数を設定したが再デプロイしていない
   ✅ 環境変数設定後、必ず再デプロイする

3. ❌ `EUREKA_CLIENT_ENABLED`を設定していない
   ✅ `EUREKA_CLIENT_ENABLED=true`を設定する

## 📋 チェックリスト

- [ ] Railwayダッシュボードでvideo-serviceを開いた
- [ ] `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`を`https://service-registry-production-6ee0.up.railway.app/eureka/`に設定した
- [ ] `EUREKA_CLIENT_ENABLED=true`を設定した
- [ ] `EUREKA_CLIENT_REGISTER_WITH_EUREKA=true`を設定した
- [ ] `EUREKA_CLIENT_FETCH_REGISTRY=true`を設定した
- [ ] video-serviceを再デプロイした
- [ ] ログでエラーが解消されているか確認した
- [ ] Service Registryダッシュボードでvideo-serviceが登録されているか確認した

## 🆘 まだエラーが発生する場合

1. 環境変数が正しく設定されているか再確認
2. サービスが再デプロイされているか確認
3. Service Registryが正常に起動しているか確認
4. ログのタイムスタンプを確認（再デプロイ後のログかどうか）

