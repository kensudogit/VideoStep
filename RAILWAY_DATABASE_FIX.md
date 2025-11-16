# Railway データベース接続エラー修正ガイド

## エラー内容

```
FATAL: role "videostep" does not exist
```

RailwayのPostgreSQLデータベースには、デフォルトで`postgres`ユーザーが作成されますが、`videostep`ユーザーは存在しません。

## 解決方法

### ✅ 推奨: Railway環境変数で`SPRING_DATASOURCE_URL`を設定

Railwayの`DATABASE_URL`は`postgresql://user:password@host:port/database`形式ですが、Spring BootのJDBC URLは`jdbc:postgresql://host:port/database`形式です。

**解決策**: Railwayの環境変数で`SPRING_DATASOURCE_URL`を設定し、`DATABASE_URL`をJDBC URL形式に変換します。

### ステップ1: Railwayダッシュボードで環境変数を設定

各サービスのRailway環境変数で、以下のように設定してください：

1. Railwayダッシュボードで各サービス（例: `auth-service`）を開く
2. **"Variables"** タブを開く
3. **"New Variable"** をクリック
4. 以下の環境変数を追加：

   **Auth Service:**
   ```
   SPRING_DATASOURCE_URL=${{videostep-auth-db.DATABASE_URL}}
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
   OPENAI_API_KEY=your-api-key
   ```

   **Video Service:**
   ```
   SPRING_DATASOURCE_URL=${{videostep-video-db.DATABASE_URL}}
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
   OPENAI_API_KEY=your-api-key
   ```

   **Translation Service:**
   ```
   SPRING_DATASOURCE_URL=${{videostep-translation-db.DATABASE_URL}}
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
   OPENAI_API_KEY=your-api-key
   ```

   **Editing Service:**
   ```
   SPRING_DATASOURCE_URL=${{videostep-editing-db.DATABASE_URL}}
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
   OPENAI_API_KEY=your-api-key
   ```

   **User Service:**
   ```
   SPRING_DATASOURCE_URL=${{videostep-user-db.DATABASE_URL}}
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
   OPENAI_API_KEY=your-api-key
   ```

**重要**: 
- `${{service-name.DATABASE_URL}}` の形式で、データベースサービスの`DATABASE_URL`を参照します
- Railwayの`DATABASE_URL`は`postgresql://user:password@host:port/database`形式ですが、`application.yml`で`SPRING_DATASOURCE_URL`が設定されていれば、その値が使用されます
- Railwayの`DATABASE_URL`には既に正しいユーザー名とパスワードが含まれているため、`username`と`password`は環境変数から自動的に読み込まれます

### ステップ2: DATABASE_URLをJDBC URL形式に変換

Railwayの`DATABASE_URL`は`postgresql://`で始まるため、`jdbc:postgresql://`形式に変換する必要があります。

**方法1: Railway環境変数で変換（推奨）**

各サービスの環境変数に以下を追加：

```
SPRING_DATASOURCE_URL=jdbc:${{videostep-auth-db.DATABASE_URL}}
```

ただし、Railwayの環境変数では文字列置換ができないため、**方法2**を使用してください。

**方法2: 環境変数で直接JDBC URL形式を設定**

Railwayの`DATABASE_URL`を手動でJDBC URL形式に変換して設定：

1. データベースサービスの**"Variables"**タブで`DATABASE_URL`を確認
2. `postgresql://`を`jdbc:postgresql://`に置き換えた値を`SPRING_DATASOURCE_URL`に設定

例：
```
# 元のDATABASE_URL
postgresql://postgres:password@host:port/database

# SPRING_DATASOURCE_URLに設定する値
jdbc:postgresql://postgres:password@host:port/database
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
   HikariPool-1 - Starting...
   HikariPool-1 - Start completed.
   ```

## 簡単な解決方法（推奨）

Railwayの`DATABASE_URL`をそのまま使用する場合、Spring Bootが自動的に認識しますが、`application.yml`で明示的に設定されている場合は、環境変数で上書きする必要があります。

**最も簡単な方法**:

各サービスの環境変数で、Railwayの`DATABASE_URL`をJDBC URL形式に変換して設定：

```
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:password@host:port/database
```

ただし、`DATABASE_URL`から手動で変換する必要があります。

**より簡単な方法**:

Railway CLIを使用して環境変数を設定：

```bash
# DATABASE_URLを取得
railway variables get DATABASE_URL --service videostep-auth-db

# JDBC URL形式に変換して設定
railway variables set SPRING_DATASOURCE_URL="jdbc:postgresql://postgres:password@host:port/database" --service auth-service
```

## トラブルシューティング

### エラー: DATABASE_URL形式が正しくない

**解決方法**: Railwayの`DATABASE_URL`を`jdbc:postgresql://`形式に変換して`SPRING_DATASOURCE_URL`に設定してください。

### エラー: データベースサービス名が間違っている

**解決方法**: Railwayダッシュボードで、データベースサービスの実際の名前を確認してください。`${{service-name.DATABASE_URL}}`の`service-name`は、データベースサービスの正確な名前である必要があります。

### エラー: 認証に失敗する

**解決方法**: Railwayの`DATABASE_URL`には既に正しいユーザー名とパスワードが含まれています。`SPRING_DATASOURCE_URL`に設定する際は、`DATABASE_URL`の値をそのまま使用し、`postgresql://`を`jdbc:postgresql://`に置き換えてください。

## 確認事項チェックリスト

- [ ] 各データベースサービスが作成されている
- [ ] 各サービスの環境変数に`SPRING_DATASOURCE_URL`が設定されている（JDBC URL形式）
- [ ] データベースサービス名が正しい（`${{service-name.DATABASE_URL}}`）
- [ ] サービスが再デプロイされている
- [ ] ログでデータベース接続が成功している
