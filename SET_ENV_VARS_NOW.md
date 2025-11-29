# Railway環境変数設定 - 今すぐ実行

## 問題

502 Bad Gatewayエラーが発生しています。原因は、API Gatewayの環境変数が設定されていないためです。

## 解決方法

Railwayダッシュボードで環境変数を設定してください。

## 手順

### ステップ1: Railwayダッシュボードを開く

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. ログイン（まだログインしていない場合）

### ステップ2: VideoStepプロジェクトを開く

1. 「VideoStep」プロジェクトをクリック

### ステップ3: API Gatewayサービスを特定

プロジェクト内のサービス一覧から、以下のいずれかを探してください：
- `videostep-production` ← これがAPI Gatewayの可能性が高い
- `api-gateway`
- `VideoStep`

**見つからない場合**: サービス一覧を確認し、最も最近デプロイされたサービスを確認してください。

### ステップ4: Service RegistryのURLを確認

1. サービス一覧から「service-registry」サービスを開く
2. 「Settings」タブをクリック
3. 「Networking」セクションを開く
4. 「Public Domain」または「Custom Domain」のURLをコピー
   - 例: `https://service-registry-production-6ee0.up.railway.app`
5. **このURLをメモしてください**

### ステップ5: API Gatewayの環境変数を設定

1. API Gatewayサービス（`videostep-production`など）を開く
2. 「Variables」タブをクリック
3. 「New Variable」をクリックして、以下の環境変数を**1つずつ**追加：

#### 環境変数1
- **Name**: `EUREKA_CLIENT_ENABLED`
- **Value**: `true`
- 「Add」をクリック

#### 環境変数2
- **Name**: `EUREKA_CLIENT_REGISTER_WITH_EUREKA`
- **Value**: `true`
- 「Add」をクリック

#### 環境変数3
- **Name**: `EUREKA_CLIENT_FETCH_REGISTRY`
- **Value**: `true`
- 「Add」をクリック

#### 環境変数4（最重要）
- **Name**: `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`
- **Value**: `https://service-registry-production-6ee0.up.railway.app/eureka/`
  - **重要**: `service-registry-production-6ee0`の部分を、ステップ4で確認した実際のService RegistryのURLに置き換えてください
  - 例: Service RegistryのURLが`https://service-registry-production-abc123.up.railway.app`の場合、Valueは`https://service-registry-production-abc123.up.railway.app/eureka/`になります
- 「Add」をクリック

### ステップ6: 再デプロイ

環境変数を設定すると、Railwayが自動的に再デプロイを開始します。

1. 「Deployments」タブを開く
2. 新しいデプロイメントが開始されていることを確認
3. デプロイが完了するまで待つ（5-10分）

**手動で再デプロイする場合**:
1. 「Settings」タブを開く
2. 「Deploy」セクションを開く
3. 「Redeploy」ボタンをクリック

### ステップ7: 確認

デプロイ完了後（「Deployments」タブで「Active」と表示されるまで）：

1. ブラウザで以下のURLにアクセス：
   ```
   https://videostep-production.up.railway.app/actuator/health
   ```
2. 正常に応答することを確認（JSON形式のレスポンスが返ってくる）
3. メインURLにアクセス：
   ```
   https://videostep-production.up.railway.app/
   ```
4. 502エラーが解消されていることを確認

## トラブルシューティング

### 環境変数を設定しても502エラーが続く場合

1. **Service Registryが正常に動作しているか確認**
   - Service RegistryのパブリックURLにアクセス
   - Eurekaダッシュボードが表示されることを確認

2. **環境変数のURLが正しいか確認**
   - `https://`で始まっているか
   - `/eureka/`で終わっているか
   - タイポがないか

3. **デプロイが完了しているか確認**
   - 「Deployments」タブで最新のデプロイメントの状態を確認
   - 「Active」と表示されるまで待つ

4. **ログを確認**
   - 「Deployments」タブで最新のデプロイメントを選択
   - ログを確認して、Eureka接続エラーがないか確認

## 確認チェックリスト

- [ ] Service RegistryのパブリックURLを確認済み
- [ ] API Gatewayサービスを特定済み
- [ ] `EUREKA_CLIENT_ENABLED=true`を設定済み
- [ ] `EUREKA_CLIENT_REGISTER_WITH_EUREKA=true`を設定済み
- [ ] `EUREKA_CLIENT_FETCH_REGISTRY=true`を設定済み
- [ ] `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`を正しいURLで設定済み
- [ ] 再デプロイを実行済み
- [ ] デプロイが完了するまで待った
- [ ] ヘルスチェックエンドポイントが応答している
- [ ] メインURLで502エラーが解消された

## 次のステップ

502エラーが解消されたら：

1. Service RegistryのEurekaダッシュボードで、API Gatewayが登録されているか確認
2. 他のサービス（Video Service、Translation Serviceなど）も同様に環境変数を設定
3. フロントエンドアプリケーションの環境変数`NEXT_PUBLIC_API_BASE_URL`をAPI GatewayのパブリックURLに設定

