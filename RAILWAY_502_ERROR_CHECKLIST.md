# Railway 502エラー 緊急チェックリスト

## 即座に確認すべき項目

### 1. 最新のコードがRailwayにデプロイされているか

**確認方法**:
1. GitHubリポジトリで最新のコミットを確認
2. Railwayダッシュボードで「Deployments」タブを確認
3. 最新のデプロイメントのコミットハッシュを確認

**必要な変更**:
- ✅ `SecurityConfig.java`（favicon認証不要設定）
- ✅ `GatewayConfig.java`（favicon 404返却）
- ✅ `application.yml`（固定認証情報）
- ✅ `build.gradle`（spring-boot-starter-web削除）

**対処**: 最新のコードをGitHubにプッシュして、Railwayの自動デプロイをトリガー

### 2. Service Registryの状態確認

**Railwayダッシュボードで確認**:
1. `service-registry`サービスのステータス
2. ログでエラーメッセージを確認
3. ヘルスチェック: `https://service-registry-production-6ee0.up.railway.app/actuator/health`

**確認すべき環境変数**:
- ❌ `EUREKA_CLIENT_ENABLED`（削除すべき）
- ❌ `EUREKA_CLIENT_REGISTER_WITH_EUREKA`（削除すべき）
- ❌ `EUREKA_CLIENT_FETCH_REGISTRY`（削除すべき）
- ❌ `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`（削除すべき）
- ❌ `DATABASE_URL`（削除すべき）
- ❌ `MYSQL_*`（削除すべき）

### 3. API Gatewayの状態確認

**Railwayダッシュボードで確認**:
1. `api-gateway`サービスのステータス
2. ログでエラーメッセージを確認
3. ヘルスチェック: `https://videostep-production.up.railway.app/actuator/health`

**確認すべき環境変数**:
- ✅ `EUREKA_CLIENT_ENABLED=true`
- ✅ `EUREKA_CLIENT_REGISTER_WITH_EUREKA=true`
- ✅ `EUREKA_CLIENT_FETCH_REGISTRY=true`
- ✅ `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/`

### 4. ログで確認すべきエラーメッセージ

**Service Registryのログ**:
- `APPLICATION FAILED TO START`
- `Connection refused`
- `Port already in use`

**API Gatewayのログ**:
- `Spring MVC found on classpath`
- `Cannot execute request on any known server`
- `Connection refused`
- `401 Unauthorized`

## 緊急対応手順

### ステップ1: 最新のコードをプッシュ

```bash
cd C:\devlop\VideoStep
git add -A
git commit -m "fix: Add SecurityConfig and GatewayConfig for favicon handling"
git push origin main
```

### ステップ2: Railwayダッシュボードでログを確認

1. Railwayダッシュボードにログイン
2. `videostep-production`プロジェクトを開く
3. **Service Registry**のログを確認
4. **API Gateway**のログを確認

### ステップ3: 環境変数を確認・修正

**Service Registry**:
- 不要な環境変数を削除（上記参照）

**API Gateway**:
- Eureka環境変数を設定（上記参照）

### ステップ4: サービスを再デプロイ

1. Railwayダッシュボードで各サービスを選択
2. 「Settings」→「Redeploy」をクリック
3. または、GitHubにプッシュして自動デプロイを待つ

### ステップ5: ヘルスチェックで確認

- Service Registry: `https://service-registry-production-6ee0.up.railway.app/actuator/health`
- API Gateway: `https://videostep-production.up.railway.app/actuator/health`

## よくある問題と対処法

### 問題1: Service Registryが起動しない

**原因**: 不要な環境変数が設定されている  
**対処**: Service Registryの環境変数からEurekaクライアント設定とデータベース設定を削除

### 問題2: API GatewayがService Registryに接続できない

**原因**: `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しく設定されていない  
**対処**: 正しいService RegistryのURLを設定

### 問題3: 502エラーが継続する

**原因**: サービスが正常に起動していない  
**対処**: ログを確認し、エラーメッセージに基づいて対処

## 確認コマンド（Railway CLI使用時）

```bash
# Service Registryのログを確認
railway logs --service service-registry

# API Gatewayのログを確認
railway logs --service api-gateway

# 環境変数を確認
railway variables --service service-registry
railway variables --service api-gateway
```

## 次のアクション

1. ✅ 最新のコードをGitHubにプッシュ
2. ⏳ Railwayダッシュボードでログを確認
3. ⏳ 環境変数を確認・修正
4. ⏳ サービスを再デプロイ
5. ⏳ ヘルスチェックで動作確認

