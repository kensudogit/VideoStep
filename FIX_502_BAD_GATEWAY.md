# 502 Bad Gateway エラー対応

## エラー内容

```
GET https://videostep-production.up.railway.app/ 502 (Bad Gateway)
```

## 原因

502 Bad Gatewayエラーは、以下の原因で発生する可能性があります：

1. **サービスが起動していない**
   - API Gatewayが正常に起動していない
   - サービスがクラッシュしている

2. **Eureka接続エラー**
   - Service Registryに接続できていない
   - 環境変数が正しく設定されていない

3. **ポート設定の問題**
   - Railwayが期待するポートでリッスンしていない

4. **環境変数の不足**
   - 必要な環境変数が設定されていない

## 対応手順

### ステップ1: Railwayダッシュボードでログを確認

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. `videostep-production`サービス（またはAPI Gateway）を開く
4. 「Deployments」タブでログを確認
5. エラーメッセージを確認

### ステップ2: サービスの状態を確認

1. Railwayダッシュボードで各サービスの状態を確認
2. 以下のサービスが正常に起動しているか確認：
   - Service Registry
   - API Gateway
   - Video Service
   - その他のサービス

### ステップ3: 環境変数の確認

API Gatewayの環境変数が正しく設定されているか確認：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-xxxx.up.railway.app/eureka/
```

**重要**: `service-registry-production-xxxx`の部分は、実際のService RegistryのパブリックURLに置き換えてください。

### ステップ4: ヘルスチェック

各サービスのヘルスチェックエンドポイントにアクセス：

```
https://service-registry-production-xxxx.up.railway.app/actuator/health
https://api-gateway-production-xxxx.up.railway.app/actuator/health
```

### ステップ5: Service Registryでサービス登録を確認

```
https://service-registry-production-xxxx.up.railway.app
```

Eurekaダッシュボードで、API Gatewayと他のサービスが登録されているか確認。

### ステップ6: 再デプロイ

問題が解決しない場合：

1. Railwayダッシュボードでサービスを開く
2. 「Settings」→「Deploy」で「Redeploy」をクリック
3. デプロイが完了するまで待つ

## よくある問題と解決方法

### 問題1: Eureka接続エラー

**症状**: ログに`Cannot execute request on any known server`が表示される

**解決方法**:
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しいパブリックURLを指しているか確認
- Service Registryが先にデプロイされているか確認
- 環境変数`EUREKA_CLIENT_ENABLED`、`EUREKA_CLIENT_REGISTER_WITH_EUREKA`、`EUREKA_CLIENT_FETCH_REGISTRY`がすべて`true`に設定されているか確認

### 問題2: ポート設定エラー

**症状**: ログにポート関連のエラーが表示される

**解決方法**:
- Railwayは自動的にポートを設定するため、`application.yml`のポート設定はそのままで問題ありません
- 環境変数`PORT`を設定しないでください（Railwayが自動設定）

### 問題3: サービスが起動しない

**症状**: デプロイは成功するが、サービスが起動しない

**解決方法**:
- ログを確認してエラーメッセージを特定
- データベース接続エラーの場合は、MySQLデータベースの接続情報を確認
- 環境変数が正しく設定されているか確認

### 問題4: 502エラーが継続する

**症状**: 再デプロイしても502エラーが続く

**解決方法**:
1. Service Registryが正常に動作しているか確認
2. すべてのサービスがService Registryに登録されているか確認
3. API Gatewayの環境変数を再確認
4. 必要に応じて、すべてのサービスを再デプロイ

## 確認チェックリスト

- [ ] Service Registryが正常に起動している
- [ ] API Gatewayが正常に起動している
- [ ] すべてのサービスの環境変数が正しく設定されている
- [ ] Service RegistryのパブリックURLが正しい
- [ ] すべてのサービスがService Registryに登録されている
- [ ] ヘルスチェックエンドポイントが応答している
- [ ] ログにエラーメッセージがない

## 次のステップ

問題が解決したら：

1. フロントエンドアプリケーションの環境変数`NEXT_PUBLIC_API_BASE_URL`をAPI GatewayのパブリックURLに設定
2. フロントエンドを再デプロイ
3. 動作確認

