# 502 Bad Gateway エラー - 緊急対応（最重要）

## 現在の状況

- URL: `https://videostep-production.up.railway.app/`
- エラー: `502 Bad Gateway`
- 原因: **API Gatewayの環境変数が設定されていない**

## ⚠️ 最重要: 環境変数の設定

このエラーを解決するには、**Railwayダッシュボードで環境変数を設定する必要があります**。

コードの修正だけでは解決しません。Railwayダッシュボードでの設定が必須です。

## 今すぐ実行すべき手順

### ステップ1: Railwayダッシュボードを開く

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. ログイン（まだログインしていない場合）

### ステップ2: VideoStepプロジェクトを開く

1. 「VideoStep」プロジェクトをクリック

### ステップ3: Service RegistryのURLを確認

1. サービス一覧から「service-registry」サービスを開く
2. 「Settings」タブをクリック
3. 「Networking」セクションを開く
4. 「Public Domain」のURLをコピー
   - 例: `https://service-registry-production-6ee0.up.railway.app`
5. **このURLをメモしてください**（後で使用します）

### ステップ4: API Gatewayサービスを特定

プロジェクト内のサービス一覧から、以下のいずれかを探してください：
- `videostep-production` ← これがAPI Gatewayの可能性が高い
- `api-gateway`
- `VideoStep`

**見つからない場合**: 
- サービス一覧を確認
- 最も最近デプロイされたサービスを確認
- サービス名をクリックして、ログや設定を確認

### ステップ5: 環境変数を設定（最重要）

1. API Gatewayサービスを開く
2. 「Variables」タブをクリック
3. 「New Variable」をクリック
4. 以下の環境変数を**1つずつ**追加：

#### 環境変数1: EUREKA_CLIENT_ENABLED
- **Name**: `EUREKA_CLIENT_ENABLED`
- **Value**: `true`
- 「Add」をクリック

#### 環境変数2: EUREKA_CLIENT_REGISTER_WITH_EUREKA
- **Name**: `EUREKA_CLIENT_REGISTER_WITH_EUREKA`
- **Value**: `true`
- 「Add」をクリック

#### 環境変数3: EUREKA_CLIENT_FETCH_REGISTRY
- **Name**: `EUREKA_CLIENT_FETCH_REGISTRY`
- **Value**: `true`
- 「Add」をクリック

#### 環境変数4: EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE（最重要）
- **Name**: `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`
- **Value**: `https://service-registry-production-6ee0.up.railway.app/eureka/`
  - **重要**: `service-registry-production-6ee0`の部分を、ステップ3で確認した実際のService RegistryのURLに置き換えてください
  - 例: Service RegistryのURLが`https://service-registry-production-abc123.up.railway.app`の場合、Valueは`https://service-registry-production-abc123.up.railway.app/eureka/`になります
  - URLは必ず`https://`で始まり、`/eureka/`で終わる必要があります
- 「Add」をクリック

### ステップ6: 環境変数の確認

「Variables」タブで、以下の4つの環境変数がすべて設定されていることを確認：

- ✅ `EUREKA_CLIENT_ENABLED` = `true`
- ✅ `EUREKA_CLIENT_REGISTER_WITH_EUREKA` = `true`
- ✅ `EUREKA_CLIENT_FETCH_REGISTRY` = `true`
- ✅ `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` = `https://[Service RegistryのURL]/eureka/`

### ステップ7: 再デプロイ

環境変数を設定すると、Railwayが自動的に再デプロイを開始します。

1. 「Deployments」タブを開く
2. 新しいデプロイメントが開始されていることを確認
3. デプロイが完了するまで待つ（5-10分）
   - デプロイメントの状態が「Active」になるまで待ちます

**手動で再デプロイする場合**:
1. 「Settings」タブを開く
2. 「Deploy」セクションを開く
3. 「Redeploy」ボタンをクリック

### ステップ8: ログを確認

デプロイ中にログを確認して、エラーがないか確認：

1. 「Deployments」タブを開く
2. 最新のデプロイメントを選択
3. ログを確認
4. 以下のエラーがないか確認：
   - `Cannot execute request on any known server` (Eureka接続エラー)
   - `Connection refused` (ポートエラー)
   - `Application failed to start` (起動失敗)

### ステップ9: 確認

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

### まだ502エラーが発生する場合

#### 1. Service Registryが起動していない

- Service Registryサービスのログを確認
- 正常に起動しているか確認
- パブリックURLが生成されているか確認

#### 2. 環境変数のURLが間違っている

- `https://`で始まっているか確認
- `/eureka/`で終わっているか確認
- タイポがないか確認
- Service Registryの実際のURLと一致しているか確認

#### 3. 環境変数が正しく設定されていない

- 「Variables」タブで、すべての環境変数が設定されているか再確認
- 環境変数名にタイポがないか確認
- 値が正しいか確認（`true`は文字列として設定）

#### 4. デプロイがまだ完了していない

- 「Deployments」タブでデプロイの進行状況を確認
- デプロイが完了するまで待つ（通常5-10分）

#### 5. サービス名が間違っている

- API Gatewayサービスを正しく特定できているか確認
- サービス一覧を確認して、正しいサービスを選択

## 確認チェックリスト

- [ ] Railwayダッシュボードにアクセス済み
- [ ] VideoStepプロジェクトを開いた
- [ ] Service RegistryのパブリックURLを確認済み
- [ ] API Gatewayサービスを特定済み
- [ ] `EUREKA_CLIENT_ENABLED=true`を設定済み
- [ ] `EUREKA_CLIENT_REGISTER_WITH_EUREKA=true`を設定済み
- [ ] `EUREKA_CLIENT_FETCH_REGISTRY=true`を設定済み
- [ ] `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`を正しいURLで設定済み
- [ ] すべての環境変数が「Variables」タブに表示されている
- [ ] 再デプロイを実行済み
- [ ] デプロイが完了するまで待った（「Active」と表示されるまで）
- [ ] ログを確認してエラーがないことを確認
- [ ] ヘルスチェックエンドポイントが応答している
- [ ] メインURLで502エラーが解消された

## 重要な注意事項

⚠️ **コードの修正だけでは502エラーは解決しません**

環境変数をRailwayダッシュボードで設定する必要があります。

⚠️ **Service RegistryのURLは必ず確認してください**

環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`のURLは、実際のService RegistryのパブリックURLと一致している必要があります。

⚠️ **デプロイが完了するまで待ってください**

環境変数を設定した後、デプロイが完了するまで5-10分かかります。デプロイが完了する前にアクセスすると、まだ502エラーが発生する可能性があります。

## 次のステップ

502エラーが解消されたら：

1. Service RegistryのEurekaダッシュボードで、API Gatewayが登録されているか確認
2. 他のサービス（Video Service、Translation Serviceなど）も同様に環境変数を設定
3. フロントエンドアプリケーションの環境変数`NEXT_PUBLIC_API_BASE_URL`をAPI GatewayのパブリックURLに設定

