# Railway データベース接続エラー修正ガイド

## エラー内容

```
FATAL: role "videostep" does not exist
```

RailwayのPostgreSQLデータベースには、デフォルトで`postgres`ユーザーが作成されますが、`videostep`ユーザーは存在しません。

## 解決方法

### ✅ 推奨: Railway環境変数で`SPRING_DATASOURCE_URL`を設定

各サービスのRailway環境変数で、以下のように設定してください：

#### ステップ1: Railwayダッシュボードで環境変数を設定

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
- Railwayの`DATABASE_URL`は`postgresql://user:password@host:port/database`形式ですが、`application.yml`で`jdbc:`プレフィックスを追加する処理が含まれています

#### ステップ2: サービスを再デプロイ

環境変数を設定した後、サービスを再デプロイ：

1. Railwayダッシュボードでサービスを開く
2. **"Deployments"** タブを開く
3. **"Redeploy"** をクリック

#### ステップ3: 接続確認

デプロイ後、ログでデータベース接続が成功しているか確認：

1. **"Deployments"** タブで最新のデプロイを開く
2. **"Logs"** を確認
3. 以下のようなメッセージが表示されれば成功：
   ```
   HikariPool-1 - Starting...
   HikariPool-1 - Start completed.
   ```

## 設定の説明

### application.ymlの変更内容

各サービスの`application.yml`を以下のように更新しました：

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:${DATABASE_URL:jdbc:postgresql://localhost:5432/videostep_auth}}
    username: ${SPRING_DATASOURCE_USERNAME:${DATABASE_USERNAME:videostep}}
    password: ${SPRING_DATASOURCE_PASSWORD:${DATABASE_PASSWORD:videostep}}
```

この設定により：
1. まず`SPRING_DATASOURCE_URL`環境変数を確認
2. なければ`DATABASE_URL`環境変数を確認
3. どちらもなければ、デフォルトのローカル接続を使用

### RailwayのDATABASE_URL形式

Railwayの`DATABASE_URL`は以下の形式です：
```
postgresql://postgres:password@host:port/database
```

Spring Bootは自動的に`jdbc:postgresql://`形式に変換しますが、`application.yml`で明示的に設定する場合は、`SPRING_DATASOURCE_URL`として設定することを推奨します。

## トラブルシューティング

### エラー: DATABASE_URL形式が正しくない

**解決方法**: Railwayの`DATABASE_URL`をそのまま`SPRING_DATASOURCE_URL`に設定してください。Spring Bootが自動的にJDBC URL形式に変換します。

### エラー: データベースサービス名が間違っている

**解決方法**: Railwayダッシュボードで、データベースサービスの実際の名前を確認してください。`${{service-name.DATABASE_URL}}`の`service-name`は、データベースサービスの正確な名前である必要があります。

### エラー: 認証に失敗する

**解決方法**: Railwayの`DATABASE_URL`には既に正しいユーザー名とパスワードが含まれています。`application.yml`の`username`と`password`は環境変数から自動的に読み込まれます。

## 確認事項チェックリスト

- [ ] 各データベースサービスが作成されている
- [ ] 各サービスの環境変数に`SPRING_DATASOURCE_URL`が設定されている
- [ ] データベースサービス名が正しい（`${{service-name.DATABASE_URL}}`）
- [ ] サービスが再デプロイされている
- [ ] ログでデータベース接続が成功している

## 次のステップ

データベース接続が成功したら：
1. サービスが正常に起動しているか確認
2. Eureka Dashboardでサービスが登録されているか確認
3. APIエンドポイントが正常に動作しているか確認
