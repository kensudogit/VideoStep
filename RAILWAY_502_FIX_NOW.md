# Railway 502エラー 即座に対応

## 現在の状況

✅ 最新のコードはGitHubにプッシュ済み
- `SecurityConfig.java`（favicon認証不要）
- `GatewayConfig.java`（favicon 404返却）
- `application.yml`（固定認証情報）

## 緊急対応手順

### ステップ1: Railwayダッシュボードで最新デプロイを確認

1. Railwayダッシュボードにログイン
2. `videostep-production`プロジェクトを開く
3. 各サービスの「Deployments」タブを確認
4. 最新のデプロイメントのコミットハッシュが`e3c2e0c`か確認

**もし最新のコードがデプロイされていない場合**:
- 「Settings」→「Redeploy」をクリック
- または、GitHubに空のコミットをプッシュしてデプロイをトリガー

### ステップ2: Service Registryのログを確認

1. Railwayダッシュボードで`service-registry`サービスを選択
2. 「Logs」タブを開く
3. 以下のエラーがないか確認：

**確認すべきエラー**:
- ❌ `APPLICATION FAILED TO START`
- ❌ `Connection refused`
- ❌ `Port already in use`
- ❌ Eurekaクライアント関連のエラー

**正常な起動ログ**:
- ✅ `Started EurekaServerApplication`
- ✅ `Started ServiceRegistryApplication`

### ステップ3: Service Registryの環境変数を確認・修正

**削除すべき環境変数**（Service RegistryはEureka Serverなので不要）:

1. Railwayダッシュボードで`service-registry`サービスを選択
2. 「Variables」タブを開く
3. 以下の環境変数を**削除**：
   - `EUREKA_CLIENT_ENABLED`
   - `EUREKA_CLIENT_REGISTER_WITH_EUREKA`
   - `EUREKA_CLIENT_FETCH_REGISTRY`
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`
   - `DATABASE_URL`
   - `MYSQL_DATABASE`
   - `MYSQL_PUBLIC_URL`
   - `MYSQL_URL`
   - `MYSQLDATABASE`
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

**Service Registryは環境変数不要**（デフォルト設定で動作）

### ステップ4: Service Registryを再デプロイ

1. 「Settings」タブを開く
2. 「Redeploy」ボタンをクリック
3. デプロイが完了するまで待つ（約2-3分）
4. ログで正常起動を確認

### ステップ5: Service Registryのヘルスチェックを確認

ブラウザで以下のURLにアクセス：

```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

**期待される結果**:
```json
{
  "status": "UP"
}
```

**もし502エラーが返る場合**:
- Service Registryが起動していない
- ログを確認してエラーを特定

### ステップ6: API Gatewayのログを確認

1. Railwayダッシュボードで`api-gateway`サービスを選択
2. 「Logs」タブを開く
3. 以下のエラーがないか確認：

**確認すべきエラー**:
- ❌ `Spring MVC found on classpath`
- ❌ `Cannot execute request on any known server`
- ❌ `Connection refused`
- ❌ `401 Unauthorized`

**正常な起動ログ**:
- ✅ `Started ApiGatewayApplication`
- ✅ `Netty started on port 8080`

### ステップ7: API Gatewayの環境変数を確認・設定

**必須環境変数**:

1. Railwayダッシュボードで`api-gateway`サービスを選択
2. 「Variables」タブを開く
3. 以下の環境変数を**設定**：

| 変数名 | 値 |
|--------|-----|
| `EUREKA_CLIENT_ENABLED` | `true` |
| `EUREKA_CLIENT_REGISTER_WITH_EUREKA` | `true` |
| `EUREKA_CLIENT_FETCH_REGISTRY` | `true` |
| `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` | `https://service-registry-production-6ee0.up.railway.app/eureka/` |

**注意**: URLの最後に`/eureka/`が含まれていることを確認

### ステップ8: API Gatewayを再デプロイ

1. 「Settings」タブを開く
2. 「Redeploy」ボタンをクリック
3. デプロイが完了するまで待つ（約2-3分）
4. ログで正常起動を確認

### ステップ9: API Gatewayのヘルスチェックを確認

ブラウザで以下のURLにアクセス：

```
https://videostep-production.up.railway.app/actuator/health
```

**期待される結果**:
```json
{
  "status": "UP"
}
```

### ステップ10: メインアプリケーションにアクセス

ブラウザで以下のURLにアクセス：

```
https://videostep-production.up.railway.app/
```

**期待される結果**:
- 502エラーが解消されている
- ログインページが表示される（認証が必要な場合）

## トラブルシューティング

### 問題1: Service Registryが起動しない

**対処**:
1. ログを確認してエラーメッセージを特定
2. 不要な環境変数を削除
3. 再デプロイ

### 問題2: API GatewayがService Registryに接続できない

**対処**:
1. `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しく設定されているか確認
2. Service RegistryのURLが正しいか確認（`/eureka/`が含まれているか）
3. Service Registryが正常に起動しているか確認

### 問題3: 502エラーが継続する

**対処**:
1. すべてのサービスのログを確認
2. 環境変数が正しく設定されているか再確認
3. すべてのサービスを再デプロイ
4. Railwayサポートに問い合わせ

## 確認チェックリスト

- [ ] Service Registryの不要な環境変数を削除
- [ ] Service Registryを再デプロイ
- [ ] Service Registryのヘルスチェックが成功
- [ ] API GatewayのEureka環境変数を設定
- [ ] API Gatewayを再デプロイ
- [ ] API Gatewayのヘルスチェックが成功
- [ ] メインアプリケーションにアクセスして502エラーが解消されている

## 次のアクション

1. ⏳ RailwayダッシュボードでService Registryの環境変数を確認・削除
2. ⏳ Service Registryを再デプロイ
3. ⏳ API Gatewayの環境変数を確認・設定
4. ⏳ API Gatewayを再デプロイ
5. ⏳ ヘルスチェックで動作確認

