# Railway環境変数 確認結果

## 確認された環境変数

スクリーンショットから確認された環境変数：

### ✅ 正しく設定されている変数（API Gateway用）

- `EUREKA_CLIENT_ENABLED`: `true` ✅
- `EUREKA_CLIENT_FETCH_REGISTRY`: `true` ✅
- `EUREKA_CLIENT_REGISTER_WITH_EUREKA`: `true` ✅
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`: `https://service-registry-production-6ee0.up.railway.app/eureka/` ✅

### その他の変数

- `auth-service`: マスクされている（サービス名？）
- `DATABASE_URL`: マスクされている
- `editing-service`: マスクされている（サービス名？）
- `OPENAI_API_KEY`: マスクされている

## 確認が必要な点

### 1. この画面はどのサービスの変数か？

スクリーンショットのタイトルが「VideoStep」となっているため、以下を確認してください：

- **API Gateway**の変数画面か？
- **Service Registry**の変数画面か？
- **プロジェクト全体**の共有変数か？

### 2. Service Registryの環境変数を確認

**Service Registry**（Eureka Server）の環境変数画面で、以下が**削除されているか確認**：

❌ 削除すべき変数：
- `EUREKA_CLIENT_ENABLED`
- `EUREKA_CLIENT_FETCH_REGISTRY`
- `EUREKA_CLIENT_REGISTER_WITH_EUREKA`
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`
- `DATABASE_URL`
- `MYSQL_*`（すべて）

**Service Registryは環境変数不要**（デフォルト設定で動作）

### 3. 502エラーの原因を特定

環境変数が正しく設定されていても502エラーが続く場合：

1. **Service Registryのログを確認**
   - Railwayダッシュボード → `service-registry`サービス
   - 「Logs」タブでエラーメッセージを確認

2. **Service Registryのヘルスチェック**
   - `https://service-registry-production-6ee0.up.railway.app/actuator/health`
   - 正常な場合: `{"status":"UP"}`

3. **API Gatewayのログを確認**
   - Railwayダッシュボード → `api-gateway`サービス
   - 「Logs」タブでエラーメッセージを確認

## 次のアクション

### ステップ1: Service Registryの環境変数を確認

1. Railwayダッシュボードで`service-registry`サービスを選択
2. 「Variables」タブを開く
3. 上記の削除すべき変数が**存在しない**ことを確認

### ステップ2: Service Registryのログを確認

1. `service-registry`サービスの「Logs」タブを開く
2. エラーメッセージがないか確認
3. `Started ServiceRegistryApplication`または`Started EurekaServerApplication`が表示されているか確認

### ステップ3: Service Registryのヘルスチェック

ブラウザで以下にアクセス：
```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

**期待される結果**:
- `{"status":"UP"}`が返る
- 502エラーが返る場合は、Service Registryが起動していない

### ステップ4: API Gatewayのログを確認

1. `api-gateway`サービスの「Logs」タブを開く
2. エラーメッセージがないか確認
3. `Started ApiGatewayApplication`が表示されているか確認

## 問題が続く場合

環境変数が正しく設定されていても502エラーが続く場合：

1. **すべてのサービスを再デプロイ**
   - Service Registry → 「Settings」→「Redeploy」
   - API Gateway → 「Settings」→「Redeploy」

2. **デプロイログを確認**
   - ビルドエラーがないか確認
   - 起動エラーがないか確認

3. **Railwayのリソース制限を確認**
   - 「Metrics」タブでCPU/メモリ使用率を確認
   - リソース不足の場合は、プランをアップグレード

## まとめ

✅ **API Gatewayの環境変数**: 正しく設定されている  
⏳ **Service Registryの環境変数**: 確認が必要  
⏳ **Service Registryのログ**: 確認が必要  
⏳ **Service Registryのヘルスチェック**: 確認が必要

