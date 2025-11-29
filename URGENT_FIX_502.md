# 502 Bad Gateway エラー - 緊急対応手順

## 現在の状況

- URL: `https://videostep-production.up.railway.app/`
- エラー: `502 Bad Gateway`
- 原因: API Gatewayが正常に起動していない、またはEurekaに接続できていない可能性

## 即座に実行すべき手順

### ステップ1: Railwayダッシュボードを開く

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く

### ステップ2: API Gatewayサービスを特定

以下のいずれかの名前でサービスが存在するはずです：
- `videostep-production`
- `api-gateway`
- `VideoStep`

### ステップ3: API Gatewayのログを確認

1. API Gatewayサービスを開く
2. 「Deployments」タブを開く
3. 最新のデプロイメントを選択
4. ログを確認して、以下のエラーがないか確認：
   - `Cannot execute request on any known server` (Eureka接続エラー)
   - `Connection refused` (ポートエラー)
   - `Application failed to start` (起動失敗)

### ステップ4: 環境変数を設定（最重要）

API Gatewayサービスで「Variables」タブを開き、以下の環境変数を**必ず設定**してください：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

**重要**: 
- `service-registry-production-6ee0`の部分は、実際のService RegistryのパブリックURLに置き換えてください
- Service RegistryのURLを確認する方法：
  1. Service Registryサービスを開く
  2. 「Settings」→「Networking」でパブリックURLを確認
  3. そのURLを`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`に設定

### ステップ5: Service RegistryのURLを確認

1. Service Registryサービスを開く
2. 「Settings」→「Networking」でパブリックURLを確認
3. ブラウザで以下のURLにアクセスして動作確認：
   ```
   https://service-registry-production-xxxx.up.railway.app
   ```
4. Eurekaダッシュボードが表示されることを確認

### ステップ6: 再デプロイ

環境変数を設定した後：

1. API Gatewayサービスを開く
2. 「Settings」→「Deploy」で「Redeploy」をクリック
3. デプロイが完了するまで待つ（5-10分）

### ステップ7: 確認

デプロイ完了後：

1. ヘルスチェックエンドポイントにアクセス：
   ```
   https://videostep-production.up.railway.app/actuator/health
   ```
2. 正常に応答することを確認
3. メインURLにアクセス：
   ```
   https://videostep-production.up.railway.app/
   ```

## トラブルシューティング

### まだ502エラーが発生する場合

#### 1. Service Registryが起動していない

- Service Registryサービスのログを確認
- 正常に起動しているか確認
- パブリックURLが生成されているか確認

#### 2. 環境変数が正しく設定されていない

- 「Variables」タブで、すべての環境変数が設定されているか再確認
- タイポがないか確認
- URLが正しいか確認（`https://`で始まり、`/eureka/`で終わる）

#### 3. デプロイがまだ完了していない

- 「Deployments」タブでデプロイの進行状況を確認
- デプロイが完了するまで待つ

#### 4. ポート設定の問題

- Railwayは自動的にポートを設定するため、環境変数`PORT`を設定しないでください
- `application.yml`のポート設定はそのままで問題ありません

## 確認チェックリスト

- [ ] Service Registryが正常に起動している
- [ ] Service RegistryのパブリックURLを確認済み
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_ENABLED`が`true`に設定されている
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_REGISTER_WITH_EUREKA`が`true`に設定されている
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_FETCH_REGISTRY`が`true`に設定されている
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しいURLに設定されている
- [ ] API Gatewayを再デプロイ済み
- [ ] デプロイが完了するまで待った
- [ ] ヘルスチェックエンドポイントが応答している

## 次のステップ

問題が解決したら：

1. Service RegistryのEurekaダッシュボードで、API Gatewayが登録されているか確認
2. 他のサービス（Video Service、Translation Serviceなど）も同様に環境変数を設定
3. フロントエンドアプリケーションの環境変数`NEXT_PUBLIC_API_BASE_URL`をAPI GatewayのパブリックURLに設定

