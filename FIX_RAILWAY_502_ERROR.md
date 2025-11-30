# Railway 502 Bad Gateway エラー修正ガイド

## 問題

Railwayにデプロイされたアプリケーション（`https://videostep-production.up.railway.app/`）で502 Bad Gatewayエラーが発生しています。

## エラー内容

- `GET https://videostep-production.up.railway.app/` → 502 Bad Gateway
- `GET https://videostep-production.up.railway.app/favicon.ico` → 502 Bad Gateway

## 原因の可能性

502 Bad Gatewayエラーは、API Gatewayが正常に起動していない、またはアップストリームサービス（Service Registry、マイクロサービス）に接続できないことを示しています。

### 考えられる原因

1. **API Gatewayが正常に起動していない**
   - コンテナがクラッシュしている
   - 起動時にエラーが発生している
   - ポートが正しく公開されていない

2. **Service Registryが正常に起動していない**
   - Eureka Serverが起動していない
   - ヘルスチェックが失敗している
   - 環境変数が正しく設定されていない

3. **Eureka接続設定の問題**
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しく設定されていない
   - Service RegistryのURLが間違っている

4. **環境変数の不足**
   - 必要な環境変数が設定されていない
   - 認証情報が正しく設定されていない

## 修正手順

### ステップ1: Railwayダッシュボードでログを確認

1. Railwayダッシュボードにログイン
2. `videostep-production`プロジェクトを開く
3. 各サービスのログを確認：
   - **API Gateway**のログを確認
   - **Service Registry**のログを確認
   - **Video Service**のログを確認

### ステップ2: サービスステータスを確認

各サービスが正常に起動しているか確認：

1. Railwayダッシュボードで各サービスのステータスを確認
2. 「Deployments」タブで最新のデプロイメントの状態を確認
3. 「Metrics」タブでCPU/メモリ使用率を確認

### ステップ3: API Gatewayの環境変数を確認

API Gatewayの環境変数が正しく設定されているか確認：

**必須環境変数**:
- `EUREKA_CLIENT_ENABLED=true`
- `EUREKA_CLIENT_REGISTER_WITH_EUREKA=true`
- `EUREKA_CLIENT_FETCH_REGISTRY=true`
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/`

**認証情報**（`application.yml`で設定済み）:
- `spring.security.user.name=admin`
- `spring.security.user.password=admin123`

### ステップ4: Service Registryの環境変数を確認

Service Registryの環境変数を確認：

**削除すべき環境変数**（Service RegistryはEureka Serverなので不要）:
- `EUREKA_CLIENT_ENABLED`（削除）
- `EUREKA_CLIENT_REGISTER_WITH_EUREKA`（削除）
- `EUREKA_CLIENT_FETCH_REGISTRY`（削除）
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`（削除）
- `DATABASE_URL`（削除 - Service Registryはデータベースを使用しない）
- `MYSQL_*`（削除）

**設定すべき環境変数**:
- `EUREKA_INSTANCE_HOSTNAME`（オプション - Railwayが自動設定）

### ステップ5: サービスを再デプロイ

1. Railwayダッシュボードで各サービスを選択
2. 「Settings」→「Redeploy」をクリック
3. または、GitHubにプッシュして自動デプロイをトリガー

### ステップ6: ヘルスチェックを確認

各サービスのヘルスチェックエンドポイントにアクセス：

- **Service Registry**: `https://service-registry-production-6ee0.up.railway.app/actuator/health`
- **API Gateway**: `https://videostep-production.up.railway.app/actuator/health`

## 緊急対応（一時的な解決策）

### API Gatewayのログを確認

RailwayダッシュボードでAPI Gatewayのログを確認し、エラーメッセージを特定：

1. Railwayダッシュボード → `videostep-production`プロジェクト
2. API Gatewayサービスを選択
3. 「Logs」タブを開く
4. エラーメッセージを確認

### よくあるエラーと対処法

#### エラー1: "Spring MVC found on classpath"
**原因**: `spring-boot-starter-web`が依存関係に含まれている  
**対処**: `build.gradle`から削除済み（確認）

#### エラー2: "Cannot execute request on any known server"
**原因**: Service Registryに接続できない  
**対処**: `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`を確認

#### エラー3: "Connection refused"
**原因**: Service Registryが起動していない  
**対処**: Service Registryのログを確認し、再デプロイ

#### エラー4: "401 Unauthorized"（favicon）
**原因**: Security設定でfaviconが認証不要になっていない  
**対処**: `SecurityConfig.java`で設定済み（確認）

## 確認チェックリスト

- [ ] Service Registryが正常に起動している
- [ ] Service Registryのヘルスチェックが成功している
- [ ] API Gatewayが正常に起動している
- [ ] API GatewayのEureka環境変数が正しく設定されている
- [ ] Service Registryの不要な環境変数が削除されている
- [ ] すべてのサービスが最新のコードでデプロイされている
- [ ] ポートが正しく公開されている（`public = true`）

## 次のステップ

1. Railwayダッシュボードでログを確認
2. エラーメッセージに基づいて対処
3. 必要に応じて環境変数を修正
4. サービスを再デプロイ
5. ヘルスチェックで動作確認

## 参考情報

- ローカル環境では正常に動作している場合、Railwayの環境変数設定が原因の可能性が高い
- 最新のコード変更（SecurityConfig、GatewayConfig）がRailwayにデプロイされているか確認
- GitHubにプッシュして自動デプロイがトリガーされているか確認

