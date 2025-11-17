# VideoStep Railway セットアップチェックリスト

## 📋 セットアップ前の確認

### 前提条件
- [ ] Railwayアカウントを持っている
- [ ] VideoStepプロジェクトがRailwayにデプロイされている
- [ ] すべてのサービス（video-service, editing-service, auth-service, user-service, translation-service）がRailwayに存在する

## 🗄️ データベース設定

### PostgreSQLデータベースサービス
- [ ] PostgreSQLデータベースサービスを作成
- [ ] データベースサービスが起動している

### 各サービスへのデータベース接続
- [ ] video-serviceにデータベースを接続
- [ ] editing-serviceにデータベースを接続
- [ ] auth-serviceにデータベースを接続
- [ ] user-serviceにデータベースを接続
- [ ] translation-serviceにデータベースを接続

### 環境変数の確認
各サービスの「Variables」タブで以下を確認：

- [ ] video-service: `DATABASE_URL`が設定されている
- [ ] editing-service: `DATABASE_URL`が設定されている
- [ ] auth-service: `DATABASE_URL`が設定されている
- [ ] user-service: `DATABASE_URL`が設定されている
- [ ] translation-service: `DATABASE_URL`が設定されている

## 🚀 デプロイメント確認

### 各サービスのデプロイメント
- [ ] video-serviceが正常にデプロイされている
- [ ] editing-serviceが正常にデプロイされている
- [ ] auth-serviceが正常にデプロイされている
- [ ] user-serviceが正常にデプロイされている
- [ ] translation-serviceが正常にデプロイされている

## 📊 ログ確認

各サービスのログで以下を確認：

### video-service
- [ ] `DatabaseEnvironmentPostProcessor: Starting environment post-processing`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: Checking environment variables...`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: DATABASE_URL from System.getenv() = set`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL`が表示される
- [ ] エラーメッセージが表示されない

### editing-service
- [ ] `DatabaseEnvironmentPostProcessor: Starting environment post-processing`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: Checking environment variables...`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: DATABASE_URL from System.getenv() = set`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL`が表示される
- [ ] エラーメッセージが表示されない

### auth-service
- [ ] `DatabaseEnvironmentPostProcessor: Starting environment post-processing`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: Checking environment variables...`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: DATABASE_URL from System.getenv() = set`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL`が表示される
- [ ] エラーメッセージが表示されない

### user-service
- [ ] `DatabaseEnvironmentPostProcessor: Starting environment post-processing`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: Checking environment variables...`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: DATABASE_URL from System.getenv() = set`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL`が表示される
- [ ] エラーメッセージが表示されない

### translation-service
- [ ] `DatabaseEnvironmentPostProcessor: Starting environment post-processing`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: Checking environment variables...`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: DATABASE_URL from System.getenv() = set`が表示される
- [ ] `DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL`が表示される
- [ ] エラーメッセージが表示されない

## 🔗 サービス間の接続確認

### Service Registry
- [ ] service-registryが起動している
- [ ] 他のサービスがservice-registryに登録されている

### API Gateway
- [ ] api-gatewayが起動している
- [ ] api-gatewayが他のサービスに接続できている

## ✅ 完了確認

すべてのチェック項目が完了したら：

- [ ] すべてのサービスが正常に起動している
- [ ] データベース接続エラーが発生していない
- [ ] ログにエラーメッセージが表示されていない

## 🆘 問題が発生した場合

チェックリストで未完了の項目がある場合：

1. **環境変数が設定されていない**
   - `RAILWAY_QUICK_SETUP.md`を参照
   - `RAILWAY_ENV_SETUP_URGENT.md`を参照

2. **ログにエラーメッセージが表示される**
   - エラーメッセージの内容を確認
   - `RAILWAY_DATABASE_SETUP.md`のトラブルシューティングセクションを参照

3. **サービスが起動しない**
   - Railwayのログを確認
   - デプロイメントの状態を確認

## 📚 参考ドキュメント

- `RAILWAY_QUICK_SETUP.md` - クイックセットアップガイド
- `RAILWAY_ENV_SETUP_URGENT.md` - 緊急対応ガイド
- `RAILWAY_DATABASE_SETUP.md` - データベース設定の詳細
- `DATABASE_ENV_FIX_SUMMARY.md` - 修正内容のサマリー

