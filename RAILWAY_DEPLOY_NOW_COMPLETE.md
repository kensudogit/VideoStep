# Railway完全公開モードデプロイ - 実行手順

このドキュメントでは、VideoStepのすべてのサービスをRailwayに完全公開モードでデプロイする手順を説明します。

## 前提条件

✅ すべてのサービスの`railway.toml`に`public = true`が設定済み
✅ GitHubリポジトリにコードがプッシュ済み
✅ Railwayアカウントを持っていること

## デプロイ方法

Railwayへのデプロイは、**Railwayダッシュボード**から行います。

### 方法1: GitHubリポジトリから自動デプロイ（推奨）

#### ステップ1: Railwayプロジェクトの作成

1. [Railway Dashboard](https://railway.app/dashboard)にログイン
2. 「New Project」をクリック
3. 「Deploy from GitHub repo」を選択
4. VideoStepリポジトリを選択

#### ステップ2: 各サービスのデプロイ

各サービスを個別のRailwayサービスとして追加します。

##### 2.1 Service Registry のデプロイ

1. プロジェクト内で「New」→「GitHub Repo」を選択
2. 同じリポジトリ（VideoStep）を選択
3. サービス名を「service-registry」に設定
4. **Root Directory**: `.`（空のまま、または`.`を指定）
5. Railwayは自動的に`services/service-registry/railway.toml`を検出します
6. 「Deploy」をクリック
7. デプロイ完了後、「Settings」→「Networking」で「Generate Domain」をクリックしてパブリックURLを生成
8. パブリックURLをメモ（例：`https://service-registry-production-xxxx.up.railway.app`）

##### 2.2 Video Service のデプロイ

1. プロジェクト内で「New」→「GitHub Repo」を選択
2. 同じリポジトリを選択
3. サービス名を「video-service」に設定
4. **Root Directory**: `.`
5. 「Deploy」をクリック
6. デプロイ開始後、「Variables」タブで環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-xxxx.up.railway.app/eureka/
SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_video?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
OPENAI_API_KEY=[あなたのOpenAI APIキー]
```

7. 「Settings」→「Networking」で「Generate Domain」をクリック

##### 2.3 Translation Service のデプロイ

1. 「New」→「GitHub Repo」を選択
2. サービス名を「translation-service」に設定
3. **Root Directory**: `.`
4. 「Deploy」をクリック
5. 環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-xxxx.up.railway.app/eureka/
SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_translation?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
OPENAI_API_KEY=[あなたのOpenAI APIキー]
```

6. 「Generate Domain」をクリック

##### 2.4 Editing Service のデプロイ

1. 「New」→「GitHub Repo」を選択
2. サービス名を「editing-service」に設定
3. **Root Directory**: `.`
4. 「Deploy」をクリック
5. 環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-xxxx.up.railway.app/eureka/
SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_editing?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
OPENAI_API_KEY=[あなたのOpenAI APIキー]
```

6. 「Generate Domain」をクリック

##### 2.5 User Service のデプロイ

1. 「New」→「GitHub Repo」を選択
2. サービス名を「user-service」に設定
3. **Root Directory**: `.`
4. 「Deploy」をクリック
5. 環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-xxxx.up.railway.app/eureka/
SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_user?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
```

6. 「Generate Domain」をクリック

##### 2.6 API Gateway のデプロイ

1. 「New」→「GitHub Repo」を選択
2. サービス名を「api-gateway」に設定
3. **Root Directory**: `.`
4. 「Deploy」をクリック
5. 環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-xxxx.up.railway.app/eureka/
```

6. 「Generate Domain」をクリック
7. このURLをフロントエンドの`NEXT_PUBLIC_API_BASE_URL`に設定

### 方法2: Railway CLIを使用（オプション）

Railway CLIがインストールされている場合：

```bash
# Railwayにログイン
railway login

# 各サービスのディレクトリで実行
cd services/video-service
railway link [プロジェクトID]
railway up
```

## デプロイ順序

推奨デプロイ順序：

1. **Service Registry** - 最初にデプロイ（他のサービスが依存）
2. **MySQL Databases** - 各サービス用のデータベースを事前に作成
3. **Video Service**
4. **Translation Service**
5. **Editing Service**
6. **User Service**
7. **API Gateway** - 最後にデプロイ

## MySQLデータベースのセットアップ

各サービス用にMySQLデータベースをRailwayで作成：

1. Railwayプロジェクト内で「New」→「Database」→「Add MySQL」を選択
2. データベース名を設定：
   - `videostep_video`
   - `videostep_translation`
   - `videostep_editing`
   - `videostep_user`
   - `videostep_auth`（Auth Service用）
3. 各データベースの接続情報をコピー
4. 対応するサービスの環境変数に設定

## 環境変数の設定

各サービスで設定が必要な環境変数：

### 共通環境変数（すべてのサービス）

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-xxxx.up.railway.app/eureka/
```

**重要**: `service-registry-production-xxxx`の部分は、実際のService RegistryのパブリックURLに置き換えてください。

### データベース接続（各サービス）

```
SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/[データベース名]?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
```

### OpenAI API Key（必要なサービス）

```
OPENAI_API_KEY=[あなたのOpenAI APIキー]
```

## デプロイ後の確認

### 1. 各サービスのヘルスチェック

各サービスのパブリックURLでヘルスチェック：

```
https://[サービス名]-production-xxxx.up.railway.app/actuator/health
```

### 2. Service Registryでサービス登録を確認

```
https://service-registry-production-xxxx.up.railway.app
```

Eurekaダッシュボードで、すべてのサービスが登録されていることを確認。

### 3. API Gatewayからのアクセステスト

```
https://api-gateway-production-xxxx.up.railway.app/api/videos/public
```

## トラブルシューティング

### サービスが起動しない

- Railwayダッシュボードの「Deployments」タブでログを確認
- 環境変数が正しく設定されているか確認
- Service RegistryのURLが正しいか確認（`https://`を使用）

### Eureka接続エラー

- Service Registryが先にデプロイされているか確認
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しいパブリックURLを指しているか確認
- 環境変数`EUREKA_CLIENT_ENABLED`、`EUREKA_CLIENT_REGISTER_WITH_EUREKA`、`EUREKA_CLIENT_FETCH_REGISTRY`がすべて`true`に設定されているか確認

### データベース接続エラー

- MySQLデータベースが作成されているか確認
- 接続URL、ユーザー名、パスワードが正しいか確認
- `useSSL=true`を使用（RailwayのMySQLはSSL必須）

### パブリックアクセスできない

- `railway.toml`に`public = true`が設定されているか確認
- Railwayダッシュボードで「Generate Domain」を実行しているか確認
- サービスが正常に起動しているか確認

## 次のステップ

1. フロントエンドアプリケーションの環境変数`NEXT_PUBLIC_API_BASE_URL`をAPI GatewayのパブリックURLに設定
2. フロントエンドをVercelなどにデプロイ
3. カスタムドメインの設定（オプション）
4. モニタリングとログの設定

