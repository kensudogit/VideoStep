# Railway完全公開モードデプロイ - 実行手順

## 現在の状態

✅ すべてのサービスの`railway.toml`に`public = true`を追加済み
✅ Railway CLIがインストール済み
✅ Railwayにログイン済み
✅ プロジェクト「VideoStep」にリンク済み

## デプロイ実行手順

### ステップ1: Railwayダッシュボードを開く

```bash
railway open
```

またはブラウザで https://railway.app/dashboard にアクセス

### ステップ2: Service Registryをデプロイ（最初に必須）

1. Railwayダッシュボードで「VideoStep」プロジェクトを開く
2. 「New」→「GitHub Repo」をクリック
3. VideoStepリポジトリを選択
4. サービス名を「service-registry」に設定
5. **重要**: ルートディレクトリは`.`（ルート）のままに設定
6. Railwayは自動的に`services/service-registry/railway.toml`を検出します
7. 「Deploy」をクリック
8. デプロイ完了後、「Settings」→「Networking」→「Generate Domain」をクリックしてパブリックURLを生成
9. パブリックURLをメモ（例: `https://service-registry-production.up.railway.app`）

### ステップ3: MySQLデータベースを作成

各サービス用にMySQLデータベースを作成：

1. 「New」→「Database」→「Add MySQL」をクリック
2. データベース名を設定（例: `videostep-auth-db`）
3. 接続情報をコピー（後で環境変数に設定）
4. 同様に以下を作成：
   - `videostep-video-db`
   - `videostep-translation-db`
   - `videostep-editing-db`
   - `videostep-user-db`

### ステップ4: Auth Serviceをデプロイ

1. 「New」→「GitHub Repo」をクリック
2. 同じリポジトリを選択
3. サービス名を「auth-service」に設定
4. ルートディレクトリは`.`のまま
5. 「Variables」タブで環境変数を追加：
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_auth?useSSL=true&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
   SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   OPENAI_API_KEY=[あなたのOpenAI APIキー]
   ```
6. 「Deploy」をクリック
7. デプロイ完了後、「Settings」→「Networking」→「Generate Domain」をクリック

### ステップ5: User Serviceをデプロイ

1. 「New」→「GitHub Repo」をクリック
2. サービス名を「user-service」に設定
3. ルートディレクトリは`.`のまま
4. 環境変数を設定：
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_user?useSSL=true&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
   SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   OPENAI_API_KEY=[あなたのOpenAI APIキー]
   ```
5. 「Deploy」をクリック
6. パブリックURLを生成

### ステップ6: Video Serviceをデプロイ

1. 「New」→「GitHub Repo」をクリック
2. サービス名を「video-service」に設定
3. ルートディレクトリは`.`のまま
4. 環境変数を設定：
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_video?useSSL=true&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
   SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   OPENAI_API_KEY=[あなたのOpenAI APIキー]
   ```
5. 「Deploy」をクリック
6. パブリックURLを生成

### ステップ7: Translation Serviceをデプロイ

1. 「New」→「GitHub Repo」をクリック
2. サービス名を「translation-service」に設定
3. ルートディレクトリは`.`のまま
4. 環境変数を設定：
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_translation?useSSL=true&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
   SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   OPENAI_API_KEY=[あなたのOpenAI APIキー]
   ```
5. 「Deploy」をクリック
6. パブリックURLを生成

### ステップ8: Editing Serviceをデプロイ

1. 「New」→「GitHub Repo」をクリック
2. サービス名を「editing-service」に設定
3. ルートディレクトリは`.`のまま
4. 環境変数を設定：
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_editing?useSSL=true&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
   SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   OPENAI_API_KEY=[あなたのOpenAI APIキー]
   ```
5. 「Deploy」をクリック
6. パブリックURLを生成

### ステップ9: API Gatewayをデプロイ（最後）

1. 「New」→「GitHub Repo」をクリック
2. サービス名を「api-gateway」に設定
3. ルートディレクトリは`.`のまま
4. 環境変数を設定：
   ```
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   ```
5. 「Deploy」をクリック
6. パブリックURLを生成（これがフロントエンドから使用するURL）

## デプロイ後の確認

### 1. 各サービスのヘルスチェック

各サービスのパブリックURLでヘルスチェック：
```
https://[サービス名]-production.up.railway.app/actuator/health
```

### 2. Service Registryの確認

```
https://service-registry-production.up.railway.app
```

Eurekaダッシュボードで各サービスが登録されていることを確認

### 3. API Gatewayの確認

```
https://api-gateway-production.up.railway.app/actuator/health
```

## トラブルシューティング

### ビルドエラー

- Railwayダッシュボードの「Deployments」タブでログを確認
- Dockerfileのパスが正しいか確認
- ビルドコンテキストがルートディレクトリ（`.`）に設定されているか確認

### サービスが起動しない

- 環境変数が正しく設定されているか確認
- Service RegistryのURLが正しいか確認（`https://`を使用）
- データベース接続情報が正しいか確認

### Eureka接続エラー

- Service Registryが先にデプロイされているか確認
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しいパブリックURLを指しているか確認
- Service RegistryのパブリックURLを使用（内部URLではない）

### パブリックアクセスできない

- `railway.toml`に`public = true`が設定されているか確認
- 「Settings」→「Networking」→「Generate Domain」を実行しているか確認

## 次のステップ

- フロントエンドアプリケーションからAPI GatewayのパブリックURLを使用
- カスタムドメインの設定（オプション）
- モニタリングとログの設定

