# データベース環境変数修正完了サマリー

## 修正日時
2025年1月16日

## 修正内容

### 1. application.ymlの修正

すべてのサービス（`video-service`, `editing-service`, `auth-service`, `user-service`, `translation-service`）の`application.yml`から、デフォルトの`localhost:5432`を削除しました。

#### 修正前
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:${DATABASE_URL:jdbc:postgresql://localhost:5432/videostep_video}}
```

#### 修正後
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
```

これにより、環境変数が設定されていない場合、アプリケーションは起動時にエラーで停止し、誤った接続先に接続することがなくなります。

### 2. DatabaseEnvironmentPostProcessorの強化

すべてのサービスで`DatabaseEnvironmentPostProcessor`を更新し、以下の機能を実装しました：

#### 優先順位
1. **SPRING_DATASOURCE_URL**（最優先）
   - Railwayで直接設定された場合、これを優先使用
   - `jdbc:`プレフィックスがない場合は自動的に追加

2. **DATABASE_URL**（フォールバック）
   - `SPRING_DATASOURCE_URL`が未設定の場合、`DATABASE_URL`を確認
   - `postgresql://`形式の場合は、自動的に`jdbc:postgresql://`形式に変換
   - 既に`jdbc:postgresql://`形式の場合は、そのまま使用

3. **エラー処理**
   - どちらも設定されていない場合、明確なエラーメッセージを出力して起動を停止

#### 実装された機能
- 環境変数の優先順位による自動解決
- URL形式の自動変換（`postgresql://` → `jdbc:postgresql://`）
- 詳細なデバッグログ出力
- 明確なエラーメッセージ

### 3. Spring Bootへの登録確認

すべてのサービスの`META-INF/spring.factories`に正しく登録されていることを確認しました：

- `video-service/src/main/resources/META-INF/spring.factories`
- `editing-service/src/main/resources/META-INF/spring.factories`
- `auth-service/src/main/resources/META-INF/spring.factories`
- `user-service/src/main/resources/META-INF/spring.factories`
- `translation-service/src/main/resources/META-INF/spring.factories`

## Railwayでの設定方法

### 方法1: Railwayでデータベースサービスを接続（推奨）

1. Railwayダッシュボードで各サービスを開く
2. 「Variables」タブを開く
3. 「Connect Database」ボタンをクリック
4. PostgreSQLサービスを選択して接続
5. `DATABASE_URL`が自動的に設定されます

### 方法2: 環境変数を直接設定

各サービスに以下を設定：

```
SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database
SPRING_DATASOURCE_USERNAME=username
SPRING_DATASOURCE_PASSWORD=password
```

## 確認方法

アプリケーション起動時のログで、以下のメッセージが表示されることを確認してください：

### 成功パターン

```
DatabaseEnvironmentPostProcessor: Starting environment post-processing
DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL = jdbc:postgresql://...
DatabaseEnvironmentPostProcessor: Using SPRING_DATASOURCE_URL from environment variable
```

または

```
DatabaseEnvironmentPostProcessor: Starting environment post-processing
DatabaseEnvironmentPostProcessor: DATABASE_URL = postgresql://...
DatabaseEnvironmentPostProcessor: Converting DATABASE_URL to JDBC format = jdbc:postgresql://...
DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL
```

### エラーパターン

```
DatabaseEnvironmentPostProcessor: ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
DatabaseEnvironmentPostProcessor: Please set one of the following environment variables in Railway:
DatabaseEnvironmentPostProcessor:   1. SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database
DatabaseEnvironmentPostProcessor:   2. DATABASE_URL=postgresql://user:password@host:port/database
```

このエラーが表示された場合は、Railwayで環境変数を設定してください。

## 修正されたファイル一覧

### application.yml
- `services/video-service/src/main/resources/application.yml`
- `services/editing-service/src/main/resources/application.yml`
- `services/auth-service/src/main/resources/application.yml`
- `services/user-service/src/main/resources/application.yml`
- `services/translation-service/src/main/resources/application.yml`

### DatabaseEnvironmentPostProcessor.java
- `services/video-service/src/main/java/com/videostep/video/config/DatabaseEnvironmentPostProcessor.java`
- `services/editing-service/src/main/java/com/videostep/editing/config/DatabaseEnvironmentPostProcessor.java`
- `services/auth-service/src/main/java/com/videostep/auth/config/DatabaseEnvironmentPostProcessor.java`
- `services/user-service/src/main/java/com/videostep/user/config/DatabaseEnvironmentPostProcessor.java`
- `services/translation-service/src/main/java/com/videostep/translation/config/DatabaseEnvironmentPostProcessor.java`

## 期待される効果

1. **localhost接続エラーの解消**
   - デフォルトの`localhost:5432`を削除したため、誤った接続先に接続することがなくなります

2. **明確なエラーメッセージ**
   - 環境変数が設定されていない場合、明確なエラーメッセージが表示されます

3. **柔軟な設定方法**
   - `SPRING_DATASOURCE_URL`または`DATABASE_URL`のどちらでも設定可能です

4. **自動変換**
   - Railwayの標準形式（`postgresql://`）を自動的にJDBC形式（`jdbc:postgresql://`）に変換します

## 次のステップ

1. Railwayで各サービスにデータベースを接続するか、環境変数を設定する
2. サービスを再デプロイする
3. ログを確認して、正しく接続されていることを確認する

詳細は`RAILWAY_DATABASE_SETUP.md`を参照してください。

