# Railway データベース接続エラー修正ガイド

## エラー内容

```
FATAL: role "videostep" does not exist
Connection to localhost:5432 refused
```

RailwayのPostgreSQLデータベースには、デフォルトで`postgres`ユーザーが作成されますが、`videostep`ユーザーは存在しません。また、Railwayの`DATABASE_URL`は`postgresql://user:password@host:port/database`形式ですが、Spring BootのJDBC URLは`jdbc:postgresql://host:port/database`形式です。

## 解決方法

### ✅ 自動変換機能（実装済み）

すべてのサービスに`DatabaseEnvironmentPostProcessor`と`DatabaseConfig`を追加しました。これにより、Railwayの`DATABASE_URL`が自動的にJDBC URL形式に変換され、`DataSource`が作成されます。

**実装内容**:
1. **`DatabaseEnvironmentPostProcessor`**: Spring Boot起動時に`DATABASE_URL`を読み取り、`postgresql://`形式を`jdbc:postgresql://`形式に変換して`SPRING_DATASOURCE_URL`として設定
2. **`DatabaseConfig`**: `DATABASE_URL`からユーザー名とパスワードを抽出し、`DataSource`を直接作成

**注意**: Railwayで各サービスに`DATABASE_URL`環境変数が自動的に設定されている必要があります。

### ステップ1: Railwayでデータベースサービスを各サービスに接続

各サービスにPostgreSQLデータベースサービスを接続してください：

1. Railwayダッシュボードで各サービス（例: `auth-service`）を開く
2. **"Variables"** タブを開く
3. データベースサービスを接続（**"Connect"** ボタンをクリック）
4. これにより、`DATABASE_URL`環境変数が自動的に設定されます

**重要**: 
- Railwayの`DATABASE_URL`は`postgresql://user:password@host:port/database`形式で自動的に設定されます
- `DatabaseEnvironmentPostProcessor`が自動的に`jdbc:postgresql://`形式に変換します
- `DatabaseConfig`が`DATABASE_URL`からユーザー名とパスワードを抽出します

### ステップ2: その他の環境変数を設定（必要に応じて）

各サービスの環境変数で、以下の設定を追加してください：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
OPENAI_API_KEY=your-api-key
```

### ステップ3: サービスを再デプロイ

環境変数を設定した後、サービスを再デプロイ：

1. Railwayダッシュボードでサービスを開く
2. **"Deployments"** タブを開く
3. **"Redeploy"** をクリック

### ステップ4: 接続確認

デプロイ後、ログでデータベース接続が成功しているか確認：

1. **"Deployments"** タブで最新のデプロイを開く
2. **"Logs"** を確認
3. 以下のようなメッセージが表示されれば成功：
   ```
   DatabaseEnvironmentPostProcessor: DATABASE_URL = postgresql://...
   DatabaseEnvironmentPostProcessor: Converting to JDBC URL = jdbc:postgresql://...
   DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully
   DatabaseConfig: Using DATABASE_URL = jdbc:postgresql://...
   HikariPool-1 - Starting...
   HikariPool-1 - Start completed.
   ```

## 実装の詳細

### DatabaseEnvironmentPostProcessor

Spring Boot起動時に実行され、`DATABASE_URL`をJDBC URL形式に変換します：

- `META-INF/spring.factories`に登録されています
- `System.getenv("DATABASE_URL")`から環境変数を読み取ります
- `postgresql://`形式を`jdbc:postgresql://`形式に変換します
- `SPRING_DATASOURCE_URL`として環境変数に設定します

### DatabaseConfig

`DataSource` Beanを作成し、`DATABASE_URL`から接続情報を抽出します：

- `@Primary`アノテーションでSpring Bootの自動設定を上書きします
- `DATABASE_URL`が設定されている場合、それを優先して使用します
- `DATABASE_URL`からユーザー名とパスワードを抽出します
- `DATABASE_URL`が設定されていない場合、`application.yml`のデフォルト値を使用します

## トラブルシューティング

### エラー: DATABASE_URLが設定されていない

**解決方法**: 
1. Railwayダッシュボードで各サービスを開く
2. **"Variables"** タブで`DATABASE_URL`が設定されているか確認
3. 設定されていない場合、データベースサービスを接続してください

### エラー: localhost:5432に接続しようとしている

**解決方法**: 
1. ログで`DatabaseEnvironmentPostProcessor`が実行されているか確認
2. `DATABASE_URL`が正しく読み取られているか確認
3. `spring.factories`ファイルが正しく配置されているか確認（`META-INF/spring.factories`）

### エラー: 認証に失敗する

**解決方法**: 
1. `DATABASE_URL`にユーザー名とパスワードが含まれているか確認
2. ログで`DatabaseConfig`が正しくユーザー名とパスワードを抽出しているか確認
3. Railwayのデータベースサービスの認証情報を確認

## 確認事項チェックリスト

- [ ] 各データベースサービスが作成されている
- [ ] 各サービスにデータベースサービスが接続されている（`DATABASE_URL`環境変数が自動設定される）
- [ ] `DatabaseEnvironmentPostProcessor`が実行されている（ログで確認）
- [ ] `DatabaseConfig`が`DATABASE_URL`を使用している（ログで確認）
- [ ] サービスが再デプロイされている
- [ ] ログでデータベース接続が成功している

## ファイル構成

以下のファイルが各サービスに追加されています：

- `src/main/java/com/videostep/{service}/config/DatabaseEnvironmentPostProcessor.java`
- `src/main/java/com/videostep/{service}/config/DatabaseConfig.java`
- `src/main/resources/META-INF/spring.factories`
