# デプロイメント状態の確認 - 502エラー解決

## 現在の状況

✅ 環境変数は正しく設定されています：
- `EUREKA_CLIENT_ENABLED` = `true`
- `EUREKA_CLIENT_FETCH_REGISTRY` = `true`
- `EUREKA_CLIENT_REGISTER_WITH_EUREKA` = `true`
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` = `https://service-registry-production-6ee0.up.railway.app/eureka/`

❌ まだ502エラーが発生している

## 確認手順

### ステップ1: デプロイメントの状態を確認

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. API Gatewayサービス（`videostep-production`など）を開く
4. 「Deployments」タブを開く
5. 最新のデプロイメントの状態を確認：
   - **「Active」**になっているか
   - **「Building」**や**「Deploying」**の場合は、完了するまで待つ
   - **「Failed」**の場合は、エラーメッセージを確認

### ステップ2: ログを確認

1. 「Deployments」タブで最新のデプロイメントを選択
2. ログを確認
3. 以下の点を確認：

#### 2.1 起動成功の確認

以下のようなメッセージが表示されているか確認：
```
Started ApiGatewayApplication
```

#### 2.2 Eureka接続の確認

以下のようなメッセージが表示されているか確認：
```
DiscoveryClient_API-GATEWAY/xxx:api-gateway:8080 - registration status: 204
```

または、Eureka接続エラーがないか確認：
- `Cannot execute request on any known server` - Eureka接続エラー
- `Connection refused` - 接続拒否エラー

#### 2.3 エラーメッセージの確認

以下のようなエラーがないか確認：
- `Application failed to start` - 起動失敗
- `Port already in use` - ポート使用中
- `Out of memory` - メモリ不足

### ステップ3: Service Registryの状態を確認

1. Service Registryサービスを開く
2. 「Deployments」タブで最新のデプロイメントの状態を確認
3. ログを確認：
   - `Started EurekaServerApplication`が表示されているか
   - エラーメッセージがないか

### ステップ4: Service RegistryのEurekaダッシュボードを確認

ブラウザで以下のURLにアクセス：

```
https://service-registry-production-6ee0.up.railway.app/
```

または

```
https://service-registry-production-6ee0.up.railway.app/eureka/
```

1. Eurekaダッシュボードが表示されるか確認
2. **「Instances currently registered with Eureka」**セクションを確認
3. **`API-GATEWAY`**が登録されているか確認

### ステップ5: API Gatewayのヘルスチェック

ブラウザで以下のURLにアクセス：

```
https://videostep-production.up.railway.app/actuator/health
```

1. 正常に応答するか確認（JSON形式のレスポンスが返ってくる）
2. 502エラーが返ってくる場合は、まだデプロイが完了していないか、エラーが発生している

## トラブルシューティング

### 問題1: デプロイがまだ完了していない

**症状**: 「Deployments」タブで「Building」や「Deploying」と表示されている

**解決方法**:
- デプロイが完了するまで待つ（通常5-10分）
- 「Active」と表示されるまで待つ

### 問題2: デプロイが失敗している

**症状**: 「Deployments」タブで「Failed」と表示されている

**解決方法**:
1. ログを確認してエラーメッセージを特定
2. エラーメッセージに基づいて対応：
   - ビルドエラーの場合: コードを確認
   - メモリ不足の場合: Railwayのプランをアップグレード
   - ポートエラーの場合: 環境変数`PORT`を設定しない（Railwayが自動設定）

### 問題3: Service Registryに接続できていない

**症状**: ログに`Cannot execute request on any known server`が表示される

**解決方法**:
1. Service Registryが正常に起動しているか確認
2. Service RegistryのパブリックURLが正しいか確認
3. 環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`のURLが正しいか確認
4. Service RegistryのEurekaダッシュボードにアクセスできるか確認

### 問題4: API GatewayがService Registryに登録されていない

**症状**: Service RegistryのEurekaダッシュボードに`API-GATEWAY`が表示されない

**解決方法**:
1. API Gatewayのログを確認
2. Eureka接続エラーがないか確認
3. 環境変数が正しく設定されているか確認
4. API Gatewayを再デプロイ

### 問題5: デプロイは成功しているが、まだ502エラーが発生する

**症状**: デプロイは「Active」になっているが、502エラーが発生する

**解決方法**:
1. ログを確認して、起動に成功しているか確認
2. Service RegistryのEurekaダッシュボードでAPI Gatewayが登録されているか確認
3. ヘルスチェックエンドポイントが応答するか確認
4. 数分待ってから再度アクセス（サービスが完全に起動するまで時間がかかる場合がある）

## 確認チェックリスト

- [ ] デプロイメントの状態が「Active」になっている
- [ ] ログに`Started ApiGatewayApplication`が表示されている
- [ ] ログにEureka接続エラーがない
- [ ] Service Registryが正常に起動している
- [ ] Service RegistryのEurekaダッシュボードにアクセスできる
- [ ] Service RegistryのEurekaダッシュボードに`API-GATEWAY`が登録されている
- [ ] API Gatewayのヘルスチェックエンドポイントが応答している
- [ ] メインURLで502エラーが解消された

## 次のステップ

1. デプロイメントの状態を確認
2. ログを確認してエラーがないか確認
3. Service RegistryのEurekaダッシュボードでAPI Gatewayが登録されているか確認
4. 問題があれば、上記のトラブルシューティングを参照

## 重要な注意事項

⚠️ **デプロイが完了するまで待ってください**

環境変数を設定した後、デプロイが完了するまで5-10分かかります。デプロイが完了する前にアクセスすると、まだ502エラーが発生する可能性があります。

⚠️ **ログを必ず確認してください**

ログにエラーメッセージが表示されている場合、そのエラーを解決する必要があります。

⚠️ **Service Registryが正常に起動していることが前提です**

Service Registryが正常に起動していない場合、API GatewayはService Registryに接続できません。

