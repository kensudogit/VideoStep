# ローカルとRailwayの違いと対応方法

## ローカル環境（動作確認済み）

画像から確認できること：
- ✅ フロントエンド（localhost:3000）が正常に動作
- ✅ 動画プレーヤーが表示されている
- ✅ 動画情報が正しく表示されている
- ✅ 関連機能（いいね、お気に入り、共有）が表示されている

## Railway環境での問題点

### 1. Eureka接続の問題

**ローカル環境:**
- Docker Composeでサービス間通信が可能
- `http://service-registry:8761` で接続可能

**Railway環境:**
- 各サービスが個別のコンテナとして動作
- 内部DNS名（`service-registry`）は使えない
- パブリックURLを使用する必要がある

### 2. データベース接続

**ローカル環境:**
- Docker ComposeでMySQLが起動
- `mysql:3306` で接続可能

**Railway環境:**
- RailwayのMySQLサービスを使用
- 環境変数で接続情報を設定する必要がある

### 3. フロントエンドとバックエンドの接続

**ローカル環境:**
- フロントエンド（localhost:3000）→ バックエンド（localhost:8080）
- 同一ホストで動作

**Railway環境:**
- フロントエンド（Vercel）→ バックエンド（Railway）
- 異なるドメインで動作
- CORS設定が必要

## 確認すべき項目

### 1. Railwayでのデプロイ状況

```bash
# Railway CLIで確認
railway status
railway variables
```

### 2. 環境変数の設定

Railwayダッシュボードで以下を確認：

#### video-service
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` = `https://service-registry-production-6ee0.up.railway.app/eureka/`
- `EUREKA_CLIENT_ENABLED` = `true`
- `EUREKA_CLIENT_REGISTER_WITH_EUREKA` = `true`
- `EUREKA_CLIENT_FETCH_REGISTRY` = `true`
- `SPRING_DATASOURCE_URL` = Railway MySQLの接続URL
- `SPRING_DATASOURCE_USERNAME` = MySQLユーザー名
- `SPRING_DATASOURCE_PASSWORD` = MySQLパスワード
- `OPENAI_API_KEY` = OpenAI API Key

#### API Gateway
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` = `https://service-registry-production-6ee0.up.railway.app/eureka/`
- `EUREKA_CLIENT_ENABLED` = `true`
- `EUREKA_CLIENT_REGISTER_WITH_EUREKA` = `true`
- `EUREKA_CLIENT_FETCH_REGISTRY` = `true`

### 3. サービスの起動確認

Railwayダッシュボードで各サービスのログを確認：
- Service Registryが起動しているか
- video-serviceが起動しているか
- API Gatewayが起動しているか
- Eureka接続エラーが発生していないか

### 4. フロントエンドの設定

Vercel（フロントエンド）の環境変数を確認：
- `NEXT_PUBLIC_API_URL` = API GatewayのパブリックURL
- 例: `https://api-gateway-production-xxxx.up.railway.app`

## トラブルシューティング

### 問題1: Railwayで動画が表示されない

**原因:**
- API Gatewayが正しく動作していない
- フロントエンドのAPI URLが正しく設定されていない
- CORS設定の問題

**対応:**
1. API Gatewayのログを確認
2. フロントエンドの環境変数を確認
3. API GatewayのCORS設定を確認

### 問題2: Eureka接続エラー

**原因:**
- 環境変数が設定されていない
- Service RegistryのパブリックURLが間違っている

**対応:**
1. 環境変数を確認・設定
2. Service RegistryのパブリックURLを確認
3. サービスを再デプロイ

### 問題3: データベース接続エラー

**原因:**
- データベース接続情報が正しく設定されていない
- Railway MySQLサービスが起動していない

**対応:**
1. データベース接続情報を確認
2. Railway MySQLサービスの状態を確認
3. 環境変数を再設定

## 次のステップ

1. **Railwayダッシュボードで確認**
   - 各サービスのデプロイメント状況
   - ログでエラーを確認
   - 環境変数の設定状況

2. **フロントエンドの設定確認**
   - Vercelの環境変数
   - API URLの設定

3. **接続テスト**
   - Service Registryダッシュボードにアクセス
   - API Gatewayのエンドポイントにアクセス
   - フロントエンドからAPIを呼び出し

## チェックリスト

- [ ] Service Registryが起動している
- [ ] video-serviceが起動している
- [ ] API Gatewayが起動している
- [ ] Eureka環境変数が設定されている
- [ ] データベース接続情報が設定されている
- [ ] フロントエンドのAPI URLが設定されている
- [ ] 各サービスがService Registryに登録されている
- [ ] ログでエラーが発生していない

