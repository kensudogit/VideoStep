# Service Registry 404エラー対応

## エラー内容

```
GET https://service-registry-production-6ee0.up.railway.app/ 404 (Not Found)
```

## 原因の可能性

### 1. Service Registryが正常に起動していない
- デプロイが失敗している
- 起動時にエラーが発生している
- ポート設定が間違っている

### 2. Service RegistryのURLが間違っている
- パブリックURLが正しく生成されていない
- 別のURLを使用する必要がある

### 3. EUREKA_CLIENT_SERVICE_URL_DEFAULTZONEが未設定
- API Gatewayの環境変数が設定されていない
- これが原因で502エラーが発生している可能性

## 対応手順

### ステップ1: Service Registryの状態を確認

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
   - ポート番号が正しく設定されているか

### ステップ2: Service RegistryのパブリックURLを確認

1. 「Settings」タブを開く
2. 「Networking」セクションを開く
3. 「Public Domain」のURLを確認
4. このURLが`https://service-registry-production-6ee0.up.railway.app`と一致しているか確認

### ステップ3: Service Registryのヘルスチェック

ブラウザで以下のURLにアクセス：

```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

または

```
https://service-registry-production-6ee0.up.railway.app/eureka/
```

正常に応答するか確認。

### ステップ4: Service Registryが起動していない場合

#### 4.1 ログを確認

1. 「Deployments」タブで最新のデプロイメントを選択
2. ログを確認
3. 以下のエラーがないか確認：
   - ポート関連のエラー
   - 起動失敗のエラー
   - メモリ不足のエラー

#### 4.2 再デプロイ

1. 「Settings」タブを開く
2. 「Deploy」セクションを開く
3. 「Redeploy」ボタンをクリック
4. デプロイが完了するまで待つ

### ステップ5: API Gatewayの環境変数を設定

Service Registryが正常に起動していることを確認したら、API Gatewayの環境変数を設定：

1. API Gatewayサービス（`videostep-production`など）を開く
2. 「Variables」タブを開く
3. 以下の環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

**重要**: `service-registry-production-6ee0`の部分は、実際のService RegistryのパブリックURLに置き換えてください。

### ステップ6: API Gatewayを再デプロイ

環境変数を設定した後、API Gatewayを再デプロイ：

1. 「Settings」タブを開く
2. 「Deploy」セクションを開く
3. 「Redeploy」ボタンをクリック
4. デプロイが完了するまで待つ

## よくある問題と解決方法

### 問題1: Service Registryが起動しない

**症状**: デプロイは成功するが、Service Registryが起動しない

**解決方法**:
1. ログを確認してエラーメッセージを特定
2. ポート設定を確認（Railwayは自動的にポートを設定するため、環境変数`PORT`を設定しない）
3. メモリ不足の場合は、Railwayのプランをアップグレード

### 問題2: Service RegistryのURLが404を返す

**症状**: Service RegistryのURLにアクセスすると404エラー

**解決方法**:
1. Service Registryが正常に起動しているか確認
2. パブリックURLが正しく生成されているか確認
3. `/eureka/`パスでアクセスしてみる：
   ```
   https://service-registry-production-6ee0.up.railway.app/eureka/
   ```

### 問題3: EUREKA_CLIENT_SERVICE_URL_DEFAULTZONEが未設定

**症状**: API Gatewayが502エラーを返す

**解決方法**:
1. API Gatewayの環境変数を確認
2. `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が設定されているか確認
3. URLが正しいか確認（`https://`で始まり、`/eureka/`で終わる）

## 確認チェックリスト

- [ ] Service Registryが正常に起動している
- [ ] Service RegistryのパブリックURLを確認済み
- [ ] Service Registryのヘルスチェックエンドポイントが応答している
- [ ] Service Registryの`/eureka/`パスにアクセスできる
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_ENABLED`が`true`に設定されている
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_REGISTER_WITH_EUREKA`が`true`に設定されている
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_FETCH_REGISTRY`が`true`に設定されている
- [ ] API Gatewayの環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しいURLで設定されている
- [ ] API Gatewayを再デプロイ済み
- [ ] API GatewayがService Registryに接続できている

## 次のステップ

1. Service Registryが正常に起動していることを確認
2. Service Registryの正しいパブリックURLを確認
3. API Gatewayの環境変数を設定
4. API Gatewayを再デプロイ
5. 502エラーが解消されているか確認

