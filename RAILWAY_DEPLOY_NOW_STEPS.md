# Railway完全公開モードデプロイ - 今すぐ実行

## ✅ 準備完了

- ✅ コードがGitHubにプッシュ済み
- ✅ すべてのサービスの`railway.toml`に`public = true`が設定済み
- ✅ Railwayプロジェクト「VideoStep」がリンク済み
- ✅ Service Registryが既にデプロイ済み

## 🚀 デプロイ手順

### ステップ1: Railwayダッシュボードを開く

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く

### ステップ2: Service RegistryのパブリックURLを確認

1. 「service-registry」サービスを開く
2. 「Settings」→「Networking」を開く
3. パブリックURLを確認（例：`https://service-registry-production-6ee0.up.railway.app`）
4. **このURLをメモしてください**（他のサービスの環境変数で使用します）

### ステップ3: MySQLデータベースを作成

各サービス用にMySQLデータベースを作成：

1. プロジェクト内で「New」→「Database」→「Add MySQL」を選択
2. 以下のデータベースを作成：
   - `videostep_video`（Video Service用）
   - `videostep_translation`（Translation Service用）
   - `videostep_editing`（Editing Service用）
   - `videostep_user`（User Service用）
   - `videostep_auth`（Auth Service用、既に存在する場合はスキップ）
3. 各データベースの接続情報をコピー（後で環境変数に設定）

### ステップ4: 各サービスをデプロイ

#### 4.1 Video Service

1. プロジェクト内で「New」→「GitHub Repo」をクリック
2. VideoStepリポジトリを選択
3. サービス名を「video-service」に設定
4. **Root Directory**: `.`（空のまま、または`.`を指定）
5. 「Deploy」をクリック
6. デプロイ開始後、「Variables」タブで環境変数を追加：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_video?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
OPENAI_API_KEY=[あなたのOpenAI APIキー]
```

**重要**: 
- `service-registry-production-6ee0`の部分は、ステップ2で確認した実際のURLに置き換えてください
- `[MySQLホスト]`、`[MySQLユーザー名]`、`[MySQLパスワード]`は、ステップ3で作成した`videostep_video`データベースの接続情報に置き換えてください

7. 「Settings」→「Networking」で「Generate Domain」をクリック

#### 4.2 Translation Service

1. 「New」→「GitHub Repo」をクリック
2. サービス名を「translation-service」に設定
3. **Root Directory**: `.`
4. 「Deploy」をクリック
5. 環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_translation?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
OPENAI_API_KEY=[あなたのOpenAI APIキー]
```

6. 「Generate Domain」をクリック

#### 4.3 Editing Service

1. 「New」→「GitHub Repo」をクリック
2. サービス名を「editing-service」に設定
3. **Root Directory**: `.`
4. 「Deploy」をクリック
5. 環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_editing?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
OPENAI_API_KEY=[あなたのOpenAI APIキー]
```

6. 「Generate Domain」をクリック

#### 4.4 User Service

1. 「New」→「GitHub Repo」をクリック
2. サービス名を「user-service」に設定
3. **Root Directory**: `.`
4. 「Deploy」をクリック
5. 環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_user?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
```

6. 「Generate Domain」をクリック

#### 4.5 API Gateway

1. 「New」→「GitHub Repo」をクリック
2. サービス名を「api-gateway」に設定
3. **Root Directory**: `.`
4. 「Deploy」をクリック
5. 環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

6. 「Generate Domain」をクリック
7. **このURLをメモしてください**（フロントエンドの`NEXT_PUBLIC_API_BASE_URL`に設定します）

## ✅ デプロイ後の確認

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

## 📝 次のステップ

1. フロントエンドアプリケーションの環境変数`NEXT_PUBLIC_API_BASE_URL`をAPI GatewayのパブリックURLに設定
2. フロントエンドをVercelなどにデプロイ
3. 動作確認

## ⚠️ 重要な注意事項

- Service RegistryのURLは、実際のパブリックURLに置き換えてください
- 環境変数は、デプロイ開始後すぐに設定できます
- 各サービスで「Generate Domain」をクリックしてパブリックURLを生成してください
- MySQLデータベースの接続情報は、Railwayダッシュボードからコピーしてください

