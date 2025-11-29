# Service Registry 404エラーとEUREKA環境変数未設定の対応

## 問題の整理

### 問題1: Service Registry 404エラー
```
GET https://service-registry-production-6ee0.up.railway.app/ 404 (Not Found)
```

### 問題2: EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE未設定
- API Gatewayの環境変数が設定されていない
- これが502 Bad Gatewayエラーの主な原因

## 対応手順

### ステップ1: Service Registryの状態を確認（最優先）

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. 「service-registry」サービスを開く
4. 「Deployments」タブを開く
5. 最新のデプロイメントの状態を確認：
   - 「Active」になっているか
   - エラーメッセージがないか
6. ログを確認：
   - 起動に成功しているか
   - エラーメッセージがないか
   - 以下のようなメッセージが表示されているか：
     ```
     Started EurekaServerApplication
     ```

### ステップ2: Service RegistryのパブリックURLを確認

1. 「Settings」タブを開く
2. 「Networking」セクションを開く
3. 「Public Domain」のURLを確認
4. **このURLをメモしてください**（後で使用します）

### ステップ3: Service Registryのヘルスチェック

ブラウザで以下のURLにアクセスして確認：

#### 3.1 Eurekaダッシュボード
```
https://service-registry-production-6ee0.up.railway.app/
```
または
```
https://service-registry-production-6ee0.up.railway.app/eureka/
```

#### 3.2 ヘルスチェック
```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

**重要**: `service-registry-production-6ee0`の部分は、実際のService RegistryのパブリックURLに置き換えてください。

### ステップ4: Service Registryが起動していない場合

#### 4.1 ログを確認

ログに以下のようなエラーがないか確認：
- ポート関連のエラー
- 起動失敗のエラー
- メモリ不足のエラー

#### 4.2 再デプロイ

1. 「Settings」タブを開く
2. 「Deploy」セクションを開く
3. 「Redeploy」ボタンをクリック
4. デプロイが完了するまで待つ（5-10分）

### ステップ5: API Gatewayの環境変数を設定（最重要）

Service Registryが正常に起動していることを確認したら、API Gatewayの環境変数を設定：

1. API Gatewayサービス（`videostep-production`など）を開く
2. 「Variables」タブを開く
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
  - **重要**: `service-registry-production-6ee0`の部分を、ステップ2で確認した実際のService RegistryのパブリックURLに置き換えてください
  - 例: Service RegistryのURLが`https://service-registry-production-abc123.up.railway.app`の場合、Valueは`https://service-registry-production-abc123.up.railway.app/eureka/`になります
  - URLは必ず`https://`で始まり、`/eureka/`で終わる必要があります
- 「Add」をクリック

### ステップ6: 環境変数の確認

「Variables」タブで、以下の4つの環境変数がすべて設定されていることを確認：

- ✅ `EUREKA_CLIENT_ENABLED` = `true`
- ✅ `EUREKA_CLIENT_REGISTER_WITH_EUREKA` = `true`
- ✅ `EUREKA_CLIENT_FETCH_REGISTRY` = `true`
- ✅ `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` = `https://[Service RegistryのURL]/eureka/`

### ステップ7: API Gatewayを再デプロイ

環境変数を設定すると、Railwayが自動的に再デプロイを開始します。

1. 「Deployments」タブを開く
2. 新しいデプロイメントが開始されていることを確認
3. デプロイが完了するまで待つ（5-10分）
   - デプロイメントの状態が「Active」になるまで待ちます

**手動で再デプロイする場合**:
1. 「Settings」タブを開く
2. 「Deploy」セクションを開く
3. 「Redeploy」ボタンをクリック

### ステップ8: 確認

デプロイ完了後（「Deployments」タブで「Active」と表示されるまで）：

1. Service RegistryのEurekaダッシュボードにアクセス：
   ```
   https://service-registry-production-6ee0.up.railway.app/
   ```
2. API Gatewayが登録されているか確認
3. API Gatewayのヘルスチェックエンドポイントにアクセス：
   ```
   https://videostep-production.up.railway.app/actuator/health
   ```
4. 正常に応答することを確認（JSON形式のレスポンスが返ってくる）
5. メインURLにアクセス：
   ```
   https://videostep-production.up.railway.app/
   ```
6. 502エラーが解消されていることを確認

## トラブルシューティング

### Service Registryが404を返す場合

1. **Service Registryが起動していない**
   - ログを確認
   - 再デプロイを実行

2. **URLが間違っている**
   - Railwayダッシュボードで正しいパブリックURLを確認
   - `/eureka/`パスでアクセスしてみる

3. **ポート設定の問題**
   - Railwayは自動的にポートを設定するため、環境変数`PORT`を設定しない
   - `application.yml`のポート設定はそのままで問題ありません

### API Gatewayが502エラーを返す場合

1. **環境変数が設定されていない**
   - 「Variables」タブで、すべての環境変数が設定されているか確認

2. **環境変数のURLが間違っている**
   - Service Registryの実際のパブリックURLと一致しているか確認
   - `https://`で始まり、`/eureka/`で終わっているか確認

3. **Service Registryに接続できていない**
   - Service Registryが正常に起動しているか確認
   - Service RegistryのEurekaダッシュボードにアクセスできるか確認

## 確認チェックリスト

- [ ] Service Registryが正常に起動している
- [ ] Service RegistryのパブリックURLを確認済み
- [ ] Service RegistryのEurekaダッシュボードにアクセスできる
- [ ] Service Registryのヘルスチェックエンドポイントが応答している
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_ENABLED`が`true`に設定されている
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_REGISTER_WITH_EUREKA`が`true`に設定されている
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_FETCH_REGISTRY`が`true`に設定されている
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しいURLで設定されている
- [ ] API Gatewayを再デプロイ済み
- [ ] API GatewayがService Registryに接続できている
- [ ] Service RegistryのEurekaダッシュボードでAPI Gatewayが登録されている
- [ ] API Gatewayのヘルスチェックエンドポイントが応答している
- [ ] メインURLで502エラーが解消された

## 重要な注意事項

⚠️ **Service Registryが正常に起動していることが前提です**

Service Registryが404を返している場合、まずService Registryの問題を解決する必要があります。

⚠️ **環境変数のURLは必ず確認してください**

`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`のURLは、実際のService RegistryのパブリックURLと一致している必要があります。

⚠️ **デプロイが完了するまで待ってください**

環境変数を設定した後、デプロイが完了するまで5-10分かかります。デプロイが完了する前にアクセスすると、まだ502エラーが発生する可能性があります。

