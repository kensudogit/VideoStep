# Railway完全公開モードデプロイ - 実行手順

## 現在の状態

✅ Railway CLIがインストール済み（v4.11.1）
✅ Railwayにログイン済み（KENICHI SUDO）
✅ プロジェクト「VideoStep」がリンク済み
✅ 現在のサービス: service-registry

## デプロイ方法

Railwayへのデプロイは、**GitHubリポジトリと連携した自動デプロイ**が推奨されます。

### ステップ1: GitHubリポジトリの確認

1. 現在のコードがGitHubにプッシュされているか確認
2. プッシュされていない場合は、以下を実行：

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### ステップ2: Railwayダッシュボードでのデプロイ

#### 2.1 Service Registry のデプロイ確認

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. 「service-registry」サービスを確認
4. デプロイが完了しているか確認
5. 「Settings」→「Networking」でパブリックURLを確認
   - URL形式: `https://service-registry-production-xxxx.up.railway.app`
   - このURLをメモ（他のサービスの環境変数で使用）

#### 2.2 他のサービスの追加

各サービスを個別に追加します：

##### Video Service

1. プロジェクト内で「New」→「GitHub Repo」をクリック
2. VideoStepリポジトリを選択
3. サービス名を「video-service」に設定
4. **Root Directory**: `.`（空のまま、または`.`を指定）
5. Railwayは自動的に`services/video-service/railway.toml`を検出
6. 「Deploy」をクリック
7. デプロイ開始後、「Variables」タブで環境変数を追加：

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

8. 「Settings」→「Networking」で「Generate Domain」をクリック

##### Translation Service

1. 「New」→「GitHub Repo」をクリック
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

##### Editing Service

1. 「New」→「GitHub Repo」をクリック
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

##### User Service

1. 「New」→「GitHub Repo」をクリック
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

##### API Gateway

1. 「New」→「GitHub Repo」をクリック
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

### ステップ3: MySQLデータベースの作成

各サービス用にMySQLデータベースを作成：

1. プロジェクト内で「New」→「Database」→「Add MySQL」を選択
2. データベース名を設定：
   - `videostep_video`
   - `videostep_translation`
   - `videostep_editing`
   - `videostep_user`
   - `videostep_auth`（Auth Service用）
3. 各データベースの接続情報をコピー
4. 対応するサービスの環境変数に設定

## デプロイ順序

推奨順序：

1. ✅ **Service Registry** - 既にデプロイ済み
2. **MySQL Databases** - 各サービス用のデータベースを作成
3. **Video Service**
4. **Translation Service**
5. **Editing Service**
6. **User Service**
7. **API Gateway** - 最後にデプロイ

## 重要な注意事項

### Service RegistryのURL

すべてのサービスの環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`で使用するURLは、**実際のService RegistryのパブリックURL**に置き換えてください。

例：
```
https://service-registry-production-6ee0.up.railway.app/eureka/
```

### 環境変数の設定タイミング

環境変数は、デプロイ開始後すぐに設定できます。設定後、サービスは自動的に再デプロイされます。

### パブリックURLの生成

各サービスで「Generate Domain」をクリックしてパブリックURLを生成してください。これにより、`public = true`の設定が有効になります。

## デプロイ後の確認

### 1. 各サービスのヘルスチェック

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
- Service RegistryのURLが正しいか確認

### Eureka接続エラー

- Service Registryが先にデプロイされているか確認
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しいパブリックURLを指しているか確認
- 環境変数`EUREKA_CLIENT_ENABLED`、`EUREKA_CLIENT_REGISTER_WITH_EUREKA`、`EUREKA_CLIENT_FETCH_REGISTRY`がすべて`true`に設定されているか確認

## 次のステップ

1. フロントエンドアプリケーションの環境変数`NEXT_PUBLIC_API_BASE_URL`をAPI GatewayのパブリックURLに設定
2. フロントエンドをVercelなどにデプロイ
3. 動作確認

