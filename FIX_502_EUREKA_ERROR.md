# 502 Bad Gateway エラー対応 - Service Registry接続エラー

## 問題

Video Serviceのログに以下のエラーが表示されています：

```
502 Bad Gateway: "{"status":"error","code":502,"message":"Application failed to respond"}"
Cannot execute request on any known server
DiscoveryClient_VIDEO-SERVICE/1e4a2ffcdaed:video-service:8082 - registration failed
was unable to send heartbeat!
```

## 原因

Video ServiceがService Registry（Eureka）に接続しようとしていますが、**Service Registryが502 Bad Gatewayエラーを返しています**。

これは、**Service Registryがクラッシュしている**か、**正常に起動していない**ことを示しています。

## 対応手順

### ステップ1: Service Registryの状態を確認

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **Service Registryサービス**を開く（`_ service-registry`カードをクリック）
4. 「Deployments」タブを開く
5. 最新のデプロイメントの状態を確認
   - 「Active」になっているか確認
   - 「Crashed」や「Failed」になっている場合は、再デプロイが必要です

### ステップ2: Service Registryのログを確認

1. Service Registryサービスの「Logs」タブを開く
2. エラーメッセージを確認
3. 以下のようなエラーがないか確認：
   - 起動エラー
   - ポート競合エラー
   - 設定エラー

### ステップ3: Service Registryを再デプロイ

Service Registryがクラッシュしている場合、再デプロイが必要です。

#### 方法A: Railwayダッシュボードで再デプロイ

1. Service Registryサービスの「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック
3. または、最新のデプロイメントを選択して「Redeploy」をクリック
4. デプロイが完了するまで待つ（1-2分）

#### 方法B: GitHub経由で再デプロイ

1. コードをGitHubにプッシュ
2. Railwayが自動的に再デプロイを開始
3. 「Deployments」タブでデプロイの進行状況を確認

### ステップ4: Service Registryの設定を確認

Service Registryが正常に起動するために、以下の設定を確認：

1. **パブリックURLが生成されているか確認**
   - Service Registryサービスの「Settings」→「Networking」を開く
   - パブリックURLが生成されているか確認
   - 生成されていない場合は、「Generate Domain」をクリック

2. **環境変数を確認**
   - 「Variables」タブを開く
   - 必要な環境変数が設定されているか確認

3. **application.ymlの設定を確認**
   - `services/service-registry/src/main/resources/application.yml`を確認
   - `hostname`が正しく設定されているか確認

### ステップ5: Service Registryが正常に起動したか確認

1. Service Registryサービスの「Logs」タブを開く
2. 以下を確認：
   - `Started EurekaServerApplication`が表示されている
   - エラーがない
   - ポート8761でリッスンしている

3. **Service RegistryのパブリックURLにアクセス**
   - ブラウザでService RegistryのパブリックURLにアクセス
   - Eurekaダッシュボードが表示されるか確認
   - 例：`https://service-registry-production-xxxx.up.railway.app/`

### ステップ6: Video ServiceのEureka接続設定を確認

Service Registryが正常に起動したら、Video ServiceのEureka接続設定を確認：

1. **Video Serviceサービスの「Variables」タブを開く**
2. 以下の環境変数が正しく設定されているか確認：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://[Service RegistryのパブリックURL]/eureka/
```

**重要**: 
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値は、Service Registryの実際のパブリックURLに置き換えてください
- URLは`https://`で始まり、`/eureka/`で終わる必要があります

### ステップ7: Video Serviceのログを再確認

1. Video Serviceサービスの「Logs」タブを開く
2. 以下を確認：
   - `Started VideoServiceApplication`が表示されている
   - Eureka接続エラーがない
   - `Registered instance`などのメッセージが表示されている（Eurekaへの登録成功）

## トラブルシューティング

### Service Registryが起動しない場合

1. **ログを確認**
   - Service Registryのログでエラーメッセージを確認
   - ポート競合、設定エラーなどがないか確認

2. **application.ymlを確認**
   - `services/service-registry/src/main/resources/application.yml`を確認
   - `hostname`の設定が正しいか確認

3. **環境変数を確認**
   - Service Registryの「Variables」タブで、必要な環境変数が設定されているか確認

### Video ServiceがEurekaに接続できない場合

1. **Service RegistryのパブリックURLが正しいか確認**
   - Service Registryの「Settings」→「Networking」で確認
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値が正しいか確認

2. **Service Registryが正常に動作しているか確認**
   - Service RegistryのパブリックURLにアクセス
   - Eurekaダッシュボードが表示されるか確認

3. **ネットワーク設定を確認**
   - Service Registryがパブリックアクセス可能か確認
   - `public = true`が設定されているか確認（`railway.toml`）

## 確認チェックリスト

- [ ] Service Registryの状態を確認済み
- [ ] Service Registryのログを確認済み
- [ ] Service Registryを再デプロイ済み
- [ ] Service Registryが正常に起動している（`Started EurekaServerApplication`が表示されている）
- [ ] Service RegistryのパブリックURLが生成されている
- [ ] Service RegistryのパブリックURLにアクセスできる（Eurekaダッシュボードが表示される）
- [ ] Video ServiceのEureka接続設定を確認済み
- [ ] `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しく設定されている
- [ ] Video ServiceのログでEureka接続エラーがない
- [ ] Video ServiceがEurekaに正常に登録されている

## 次のステップ

Service RegistryとVideo Serviceが正常に動作したら：

1. Service RegistryのEurekaダッシュボードで、Video Serviceが登録されているか確認
2. API GatewayからVideo Serviceにアクセスできるか確認
3. 他のサービス（Translation Service、Editing Serviceなど）も同様に設定

