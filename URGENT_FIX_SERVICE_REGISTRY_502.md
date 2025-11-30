# 緊急対応: Service Registry 502エラー修正

## 問題

Video ServiceがEurekaに接続しようとして、以下のエラーが発生しています：

```
502 Bad Gateway: "{"status":"error","code":502,"message":"Application failed to respond","request_id":"..."}"
Cannot execute request on any known server
```

これは、Service Registryが502 Bad Gatewayを返していることを示しています。

## 原因

Service Registryが正常に起動していない、またはクラッシュしている可能性があります。

## 今すぐ実行する手順

### ステップ1: Service Registryの状態を確認

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **service-registry**サービスをクリック
4. 「Deployments」タブを開く
5. 最新のデプロイメントが「Active」になっているか確認
6. 「Logs」タブを開く
7. 以下のエラーメッセージがないか確認：
   - `Application failed to respond`
   - `Connection refused`
   - `Port already in use`
   - `OutOfMemoryError`
   - その他の例外

### ステップ2: Service Registryのログを確認

Service Registryのログで以下を確認：

1. **正常な起動メッセージ**を探す：
   ```
   Started EurekaServerApplication
   Started ServiceRegistryApplication
   ```

2. **エラーメッセージ**を探す：
   - `ERROR`
   - `Exception`
   - `Failed to start`

3. **ポート8761がリッスンしているか**確認：
   ```
   Tomcat started on port(s): 8761
   ```

### ステップ3: Service Registryの正しいURLを確認

1. **service-registry**サービスの「Settings」タブを開く
2. 「Domains」セクションを確認
3. **パブリックURL**をコピー（例：`https://service-registry-production-xxxx.up.railway.app`）
4. このURLが`https://service-registry-production-6ee0.up.railway.app`と一致しているか確認

**重要**: URLが異なる場合は、Video Serviceの環境変数を更新する必要があります。

### ステップ4: Service Registryを再デプロイ

Service Registryがクラッシュしている場合、再デプロイが必要です：

1. **service-registry**サービスの「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック（または「...」メニューから「Redeploy」を選択）
3. 再デプロイが完了するまで待つ（通常1-2分）
4. 「Logs」タブで正常に起動したことを確認

### ステップ5: Service Registryの環境変数を確認

1. **service-registry**サービスの「Variables」タブを開く
2. 以下の環境変数が設定されているか確認：
   - `EUREKA_INSTANCE_HOSTNAME`（設定されていない場合は削除または空にする）
   - `OPENAI_API_KEY`（必要に応じて）

### ステップ6: Service Registryのヘルスチェック

1. Service RegistryのパブリックURLにアクセス：
   ```
   https://service-registry-production-6ee0.up.railway.app
   ```
   または、正しいURLを使用

2. **Eurekaダッシュボード**が表示されるか確認
   - 正常な場合：Eurekaの管理画面が表示される
   - エラーの場合：502 Bad Gatewayまたは404エラーが表示される

3. **Actuatorヘルスチェック**を確認：
   ```
   https://service-registry-production-6ee0.up.railway.app/actuator/health
   ```
   - 正常な場合：`{"status":"UP"}`が返される
   - エラーの場合：502 Bad Gatewayが返される

### ステップ7: Video ServiceのEureka環境変数を確認・設定

1. **VideoStep**サービス（Video Service）の「Variables」タブを開く
2. 以下の環境変数が正しく設定されているか確認：

   ```
   EUREKA_CLIENT_ENABLED=true
   EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
   EUREKA_CLIENT_FETCH_REGISTRY=true
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
   ```

   **重要**: `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`のURLが、ステップ3で確認したService Registryの正しいURLと一致していることを確認してください。

3. 環境変数が設定されていない、または間違っている場合は、以下を設定：
   - 「+ New Variable」をクリック
   - 変数名と値を入力
   - 「Add」をクリック

### ステップ8: Video Serviceを再デプロイ

環境変数を更新した後、Video Serviceを再デプロイ：

1. **VideoStep**サービスの「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック
3. 再デプロイが完了するまで待つ
4. 「Logs」タブでEureka接続が成功したことを確認

### ステップ9: 接続を確認

1. **Service Registry**のEurekaダッシュボードにアクセス
2. 「Instances currently registered with Eureka」セクションを確認
3. **VIDEO-SERVICE**が登録されているか確認

## トラブルシューティング

### Service Registryが起動しない場合

1. **メモリ不足**の可能性：
   - Railwayダッシュボードで「Settings」→「Resources」を確認
   - メモリ制限を増やす

2. **ポート競合**の可能性：
   - `application.yml`でポート8761が正しく設定されているか確認

3. **依存関係の問題**：
   - Service RegistryのDockerfileとビルド設定を確認

### Service RegistryのURLが異なる場合

1. Service Registryの正しいURLを確認
2. Video Serviceの`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`を更新
3. API Gatewayの`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`も更新（必要に応じて）

### 502エラーが続く場合

1. Service Registryのログを詳細に確認
2. Railwayのサポートに問い合わせ
3. Service Registryを完全に削除して再作成（最後の手段）

## 次のステップ

Service Registryが正常に起動し、Video ServiceがEurekaに接続できるようになったら：

1. 他のサービス（Translation Service、Editing Service、User Service）も同様にEurekaに接続
2. API GatewayがEurekaからサービスを取得できることを確認
3. フロントエンドからAPI Gateway経由でサービスにアクセスできることを確認

