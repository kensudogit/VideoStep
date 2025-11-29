# Railway完全公開モードデプロイガイド

このガイドでは、VideoStepプロジェクトのすべてのサービスをRailwayで完全公開モード（パブリックアクセス有効）でデプロイする手順を説明します。

## 前提条件

- Railwayアカウントを持っていること
- Railway CLIがインストールされていること（オプション）
- 各サービス用のMySQLデータベースをRailwayで作成済みであること

## 設定完了事項

✅ すべてのサービスの`railway.toml`に`public = true`を追加済み
- `services/api-gateway/railway.toml`
- `services/service-registry/railway.toml`
- `services/auth-service/railway.toml`
- `services/video-service/railway.toml`
- `services/translation-service/railway.toml`
- `services/editing-service/railway.toml`
- `services/user-service/railway.toml`

## デプロイ手順

### 1. Railwayプロジェクトの作成

1. [Railway Dashboard](https://railway.app/dashboard)にログイン
2. 「New Project」をクリック
3. 「Deploy from GitHub repo」を選択（推奨）または「Empty Project」を選択

### 2. 各サービスのデプロイ

各サービスを個別のRailwayサービスとしてデプロイします。

#### 2.1 Service Registry (Eureka) のデプロイ

1. Railwayプロジェクト内で「New」→「GitHub Repo」を選択
2. VideoStepリポジトリを選択
3. サービス名を「service-registry」に設定
4. ルートディレクトリを`.`に設定
5. Railwayは自動的に`services/service-registry/railway.toml`を検出します
6. 環境変数は不要（内部サービス用）

#### 2.2 API Gateway のデプロイ

1. 同じプロジェクト内で「New」→「GitHub Repo」を選択
2. 同じリポジトリを選択
3. サービス名を「api-gateway」に設定
4. ルートディレクトリを`.`に設定
5. 環境変数を設定：
   ```
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   ```
   （Service RegistryのパブリックURLを使用）

#### 2.3 Auth Service のデプロイ

1. 「New」→「GitHub Repo」を選択
2. サービス名を「auth-service」に設定
3. ルートディレクトリを`.`に設定
4. 環境変数を設定：
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_auth?useSSL=true&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
   SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   OPENAI_API_KEY=[あなたのOpenAI APIキー]
   ```

#### 2.4 Video Service のデプロイ

1. 「New」→「GitHub Repo」を選択
2. サービス名を「video-service」に設定
3. ルートディレクトリを`.`に設定
4. 環境変数を設定：
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_video?useSSL=true&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
   SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   OPENAI_API_KEY=[あなたのOpenAI APIキー]
   ```

#### 2.5 Translation Service のデプロイ

1. 「New」→「GitHub Repo」を選択
2. サービス名を「translation-service」に設定
3. ルートディレクトリを`.`に設定
4. 環境変数を設定：
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_translation?useSSL=true&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
   SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   OPENAI_API_KEY=[あなたのOpenAI APIキー]
   ```

#### 2.6 Editing Service のデプロイ

1. 「New」→「GitHub Repo」を選択
2. サービス名を「editing-service」に設定
3. ルートディレクトリを`.`に設定
4. 環境変数を設定：
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_editing?useSSL=true&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
   SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   OPENAI_API_KEY=[あなたのOpenAI APIキー]
   ```

#### 2.7 User Service のデプロイ

1. 「New」→「GitHub Repo」を選択
2. サービス名を「user-service」に設定
3. ルートディレクトリを`.`に設定
4. 環境変数を設定：
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_user?useSSL=true&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
   SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
   OPENAI_API_KEY=[あなたのOpenAI APIキー]
   ```

### 3. MySQLデータベースのセットアップ

各サービス用にMySQLデータベースをRailwayで作成：

1. Railwayプロジェクト内で「New」→「Database」→「Add MySQL」を選択
2. データベース名を設定（例：`videostep_auth`）
3. 接続情報をコピーして、対応するサービスの環境変数に設定

### 4. パブリックアクセスの確認

各サービスのデプロイ後：

1. Railwayダッシュボードで各サービスを開く
2. 「Settings」タブを開く
3. 「Networking」セクションで「Generate Domain」をクリック
4. パブリックURLが生成されることを確認
5. ブラウザで`https://[サービス名]-production.up.railway.app/actuator/health`にアクセスして動作確認

### 5. デプロイ順序

推奨デプロイ順序：

1. **Service Registry** - 最初にデプロイ（他のサービスが依存）
2. **MySQL Databases** - データベースを事前に作成
3. **Auth Service** - 認証サービス
4. **User Service** - ユーザーサービス
5. **Video Service** - 動画サービス
6. **Translation Service** - 翻訳サービス
7. **Editing Service** - 編集サービス
8. **API Gateway** - 最後にデプロイ（すべてのサービスが登録された後）

## トラブルシューティング

### サービスが起動しない

- ログを確認：Railwayダッシュボードの「Deployments」タブでログを確認
- 環境変数が正しく設定されているか確認
- Service RegistryのURLが正しいか確認（`https://`を使用）

### Eureka接続エラー

- Service Registryが先にデプロイされているか確認
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しいパブリックURLを指しているか確認
- Service RegistryのパブリックURLは`https://service-registry-production.up.railway.app/eureka/`形式

### データベース接続エラー

- MySQLデータベースが作成されているか確認
- 接続URL、ユーザー名、パスワードが正しいか確認
- `useSSL=true`を使用（RailwayのMySQLはSSL必須）

### パブリックアクセスできない

- `railway.toml`に`public = true`が設定されているか確認
- Railwayダッシュボードで「Generate Domain」を実行しているか確認
- サービスが正常に起動しているか確認

## 確認事項

デプロイ完了後、以下を確認：

- [ ] すべてのサービスが正常に起動している
- [ ] 各サービスのパブリックURLが生成されている
- [ ] Service Registryで各サービスが登録されている
- [ ] API Gatewayから各サービスにアクセスできる
- [ ] ヘルスチェックエンドポイント（`/actuator/health`）が応答している

## 次のステップ

- フロントエンドアプリケーションからAPI GatewayのパブリックURLを使用
- カスタムドメインの設定（オプション）
- モニタリングとログの設定
