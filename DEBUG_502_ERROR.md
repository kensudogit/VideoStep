# 502エラー デバッグ手順

## 現在のエラー

1. `favicon.ico` - 502 Bad Gateway
2. `health` - 502 Bad Gateway
3. `content.js` - ブラウザ拡張機能の問題（無視してOK）

## デバッグ手順

### ステップ1: Railwayダッシュボードでデプロイメント状態を確認

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. API Gatewayサービスを開く
4. 「Deployments」タブを開く
5. 最新のデプロイメントの状態を確認：
   - **「Active」** = 正常にデプロイ済み
   - **「Building」** = ビルド中（待つ）
   - **「Deploying」** = デプロイ中（待つ）
   - **「Failed」** = デプロイ失敗（ログを確認）

### ステップ2: API Gatewayのログを確認

1. 「Deployments」タブで最新のデプロイメントを選択
2. ログを確認
3. 以下の点を確認：

#### ✅ 正常なログ
```
Started ApiGatewayApplication
DiscoveryClient_API-GATEWAY/xxx:api-gateway:8080 - registration status: 204
```

#### ❌ エラーログ
```
Cannot execute request on any known server
Connection refused
Application failed to start
```

### ステップ3: Service Registryの状態を確認

1. Service Registryサービスを開く
2. 「Deployments」タブで状態を確認
3. ログを確認：
   - `Started EurekaServerApplication`が表示されているか

### ステップ4: Service RegistryのEurekaダッシュボードを確認

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app/
```

1. Eurekaダッシュボードが表示されるか
2. 「Instances currently registered with Eureka」セクションを確認
3. **`API-GATEWAY`**が登録されているか確認

### ステップ5: 環境変数の再確認

API Gatewayサービスの「Variables」タブで以下を確認：

- ✅ `EUREKA_CLIENT_ENABLED` = `true`
- ✅ `EUREKA_CLIENT_REGISTER_WITH_EUREKA` = `true`
- ✅ `EUREKA_CLIENT_FETCH_REGISTRY` = `true`
- ✅ `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` = `https://service-registry-production-6ee0.up.railway.app/eureka/`

### ステップ6: 手動で再デプロイ

1. API Gatewayサービスを開く
2. 「Settings」タブを開く
3. 「Deploy」セクションを開く
4. 「Redeploy」ボタンをクリック
5. デプロイが完了するまで待つ（5-10分）

## よくある問題と解決方法

### 問題1: デプロイがまだ完了していない

**症状**: 「Deployments」タブで「Building」や「Deploying」と表示されている

**解決方法**:
- デプロイが完了するまで待つ
- 「Active」と表示されるまで待つ

### 問題2: Service Registryに接続できていない

**症状**: ログに`Cannot execute request on any known server`が表示される

**解決方法**:
1. Service Registryが正常に起動しているか確認
2. Service RegistryのパブリックURLが正しいか確認
3. 環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`のURLが正しいか確認

### 問題3: API Gatewayが起動していない

**症状**: ログに`Application failed to start`が表示される

**解決方法**:
1. ログを確認してエラーメッセージを特定
2. エラーメッセージに基づいて対応

### 問題4: ポートエラー

**症状**: ログにポート関連のエラーが表示される

**解決方法**:
- Railwayは自動的にポートを設定するため、環境変数`PORT`を設定しない
- `application.yml`のポート設定はそのままで問題ありません

## 緊急対応: すべてのサービスを再デプロイ

問題が解決しない場合、以下の手順で再デプロイを試してください：

### 1. Service Registryを再デプロイ

1. Service Registryサービスを開く
2. 「Settings」→「Deploy」→「Redeploy」
3. デプロイが完了するまで待つ

### 2. API Gatewayを再デプロイ

1. API Gatewayサービスを開く
2. 「Settings」→「Deploy」→「Redeploy」
3. デプロイが完了するまで待つ

### 3. 確認

1. Service RegistryのEurekaダッシュボードでAPI Gatewayが登録されているか確認
2. API Gatewayのヘルスチェックエンドポイントが応答するか確認

## 確認チェックリスト

- [ ] API Gatewayのデプロイメントが「Active」になっている
- [ ] API Gatewayのログに`Started ApiGatewayApplication`が表示されている
- [ ] API GatewayのログにEureka接続エラーがない
- [ ] Service Registryが正常に起動している
- [ ] Service RegistryのEurekaダッシュボードにアクセスできる
- [ ] Service RegistryのEurekaダッシュボードに`API-GATEWAY`が登録されている
- [ ] 環境変数が正しく設定されている
- [ ] 再デプロイを実行済み
- [ ] デプロイが完了するまで待った

## 次のステップ

1. Railwayダッシュボードでデプロイメントの状態を確認
2. ログを確認してエラーがないか確認
3. Service RegistryのEurekaダッシュボードでAPI Gatewayが登録されているか確認
4. 問題があれば、上記のトラブルシューティングを参照
5. それでも解決しない場合は、すべてのサービスを再デプロイ

