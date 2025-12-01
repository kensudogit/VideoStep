# Service Registry 502 Bad Gateway / タイムアウト 修正

## 問題

Service Registryが502 Bad Gatewayエラーを返し、タイムアウトしています。

**エラー内容**:
- `GET https://service-registry-production-6ee0.up.railway.app/` → 502 Bad Gateway
- `GET https://service-registry-production-6ee0.up.railway.app/favicon.ico` → 502 Bad Gateway
- タイムアウト

## 原因の可能性

1. **Service Registryが起動していない**
   - コンテナがクラッシュしている
   - 起動時にエラーが発生している
   - 不要な環境変数が原因で起動に失敗している

2. **不要な環境変数が設定されている**
   - `SPRING_DATASOURCE_URL`（Service Registryはデータベースを使用しない）
   - Eurekaクライアント関連の環境変数（Service RegistryはEureka Server）

3. **リソース不足**
   - CPU/メモリ制限に達している
   - デプロイが失敗している

## 緊急対応手順

### ステップ1: Service Registryのログを確認

1. Railwayダッシュボードにログイン
2. `videostep-production`プロジェクトを開く
3. `service-registry`サービスを選択
4. 「Logs」タブを開く
5. エラーメッセージを確認

**確認すべきエラー**:
- `APPLICATION FAILED TO START`
- `Connection refused`
- `Port already in use`
- データベース関連のエラー
- Eurekaクライアント関連のエラー

### ステップ2: Service Registryの環境変数を確認・削除

**削除すべき環境変数**（Service RegistryはEureka Serverなので不要）:

1. Railwayダッシュボードで`service-registry`サービスを選択
2. 「Variables」タブを開く
3. 以下の環境変数を**すべて削除**：

❌ **削除すべき変数**:
- `SPRING_DATASOURCE_URL` ← **重要: ログで確認された不要な変数**
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

### ステップ3: Service Registryを再デプロイ

1. 「Settings」タブを開く
2. 「Redeploy」ボタンをクリック
3. デプロイが完了するまで待つ（約2-3分）
4. ログで正常起動を確認

### ステップ4: Service Registryのヘルスチェックを確認

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

### ステップ5: Service Registryのログで正常起動を確認

**正常な起動ログ**:
- `Started ServiceRegistryApplication`
- `Started EurekaServerApplication`
- `Netty started on port 8761`

**エラーログがないことを確認**

## よくある問題と対処法

### 問題1: `SPRING_DATASOURCE_URL`が設定されている

**症状**: Service Registryがデータベース接続を試みて失敗する

**対処**: `SPRING_DATASOURCE_URL`を削除

### 問題2: Eurekaクライアント環境変数が設定されている

**症状**: Service Registryが自分自身をEurekaクライアントとして登録しようとして失敗する

**対処**: すべての`EUREKA_CLIENT_*`環境変数を削除

### 問題3: デプロイが失敗している

**症状**: デプロイログにエラーが表示される

**対処**: 
1. デプロイログを確認
2. ビルドエラーがないか確認
3. 必要に応じてコードを修正

### 問題4: リソース不足

**症状**: CPU/メモリ使用率が100%に達している

**対処**: 
1. 「Metrics」タブでリソース使用率を確認
2. 必要に応じてプランをアップグレード

## 確認チェックリスト

- [ ] Service Registryのログを確認
- [ ] `SPRING_DATASOURCE_URL`を削除
- [ ] すべてのEurekaクライアント環境変数を削除
- [ ] すべてのデータベース関連環境変数を削除
- [ ] Service Registryを再デプロイ
- [ ] Service Registryのヘルスチェックが成功
- [ ] Service Registryのログで正常起動を確認

## 次のアクション

1. ⏳ RailwayダッシュボードでService Registryのログを確認
2. ⏳ Service Registryの環境変数から`SPRING_DATASOURCE_URL`とその他の不要な変数を削除
3. ⏳ Service Registryを再デプロイ
4. ⏳ ヘルスチェックで動作確認

## 重要

Service Registryは**Eureka Server**であり、以下の特徴があります：
- データベースを使用しない
- Eurekaクライアントとして動作しない
- 環境変数は基本的に不要（デフォルト設定で動作）

不要な環境変数が設定されていると、起動に失敗する可能性があります。

