# 502 Bad Gateway エラー - 詳細確認手順

## 現在のエラー

```
GET https://videostep-production.up.railway.app/ 502 (Bad Gateway)
GET https://videostep-production.up.railway.app/favicon.ico 502 (Bad Gateway)
```

## 確認手順

### ステップ1: Railwayダッシュボードでサービス状態を確認

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. 各サービスの状態を確認：
   - Service Registry - 正常に起動しているか
   - API Gateway (videostep-production) - 正常に起動しているか
   - その他のサービス

### ステップ2: API Gatewayのログを確認

1. API Gatewayサービス（`videostep-production`または`api-gateway`）を開く
2. 「Deployments」タブを開く
3. 最新のデプロイメントのログを確認
4. 以下のエラーがないか確認：
   - Eureka接続エラー
   - ポート関連のエラー
   - 起動失敗のエラー

### ステップ3: 環境変数の確認

API Gatewayサービスで以下の環境変数が設定されているか確認：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

**重要**: 
- すべての環境変数が設定されているか確認
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`のURLが正しいか確認（Service Registryの実際のパブリックURL）

### ステップ4: Service Registryの確認

1. Service Registryサービスを開く
2. 「Settings」→「Networking」でパブリックURLを確認
3. ブラウザで以下のURLにアクセス：
   ```
   https://service-registry-production-xxxx.up.railway.app
   ```
4. Eurekaダッシュボードが表示されるか確認
5. API Gatewayが登録されているか確認

### ステップ5: ヘルスチェック

各サービスのヘルスチェックエンドポイントにアクセス：

```
https://service-registry-production-xxxx.up.railway.app/actuator/health
https://videostep-production.up.railway.app/actuator/health
```

## よくある問題と解決方法

### 問題1: 環境変数が設定されていない

**症状**: API GatewayがEurekaに接続できない

**解決方法**:
1. RailwayダッシュボードでAPI Gatewayサービスを開く
2. 「Variables」タブで環境変数を追加
3. 再デプロイ

### 問題2: Service RegistryのURLが間違っている

**症状**: Eureka接続エラー

**解決方法**:
1. Service Registryの実際のパブリックURLを確認
2. 環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`を正しいURLに更新
3. 再デプロイ

### 問題3: サービスが起動していない

**症状**: デプロイは成功するが、サービスが起動しない

**解決方法**:
1. ログを確認してエラーメッセージを特定
2. データベース接続エラーの場合は、MySQLデータベースの接続情報を確認
3. ポート関連のエラーの場合は、Railwayが自動設定するため、環境変数`PORT`を設定しない

### 問題4: デプロイがまだ完了していない

**症状**: コードをプッシュしたばかりで、まだデプロイ中

**解決方法**:
1. Railwayダッシュボードでデプロイの進行状況を確認
2. デプロイが完了するまで待つ（通常5-10分）

## 緊急対応

### 手動で再デプロイ

1. RailwayダッシュボードでAPI Gatewayサービスを開く
2. 「Settings」→「Deploy」で「Redeploy」をクリック
3. デプロイが完了するまで待つ

### 環境変数を一括設定

Railway CLIを使用（オプション）：

```bash
railway variables set EUREKA_CLIENT_ENABLED=true --service api-gateway
railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true --service api-gateway
railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true --service api-gateway
railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/ --service api-gateway
```

## 確認チェックリスト

- [ ] Service Registryが正常に起動している
- [ ] API Gatewayが正常に起動している
- [ ] すべての環境変数が設定されている
- [ ] Service RegistryのパブリックURLが正しい
- [ ] API GatewayがService Registryに登録されている
- [ ] ヘルスチェックエンドポイントが応答している
- [ ] ログにエラーメッセージがない

