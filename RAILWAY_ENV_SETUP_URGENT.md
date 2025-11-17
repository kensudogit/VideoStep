# Railway 環境変数設定 - 緊急対応ガイド

## 現在のエラー

ログに以下のエラーが表示されています：
```
DatabaseEnvironmentPostProcessor: ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
```

これは、Railwayで環境変数が設定されていないことを示しています。

## 即座に実行すべき手順

### 方法1: Railwayでデータベースサービスを接続（推奨・最も簡単）

1. **Railwayダッシュボードにアクセス**
   - https://railway.app にログイン
   - VideoStepプロジェクトを選択

2. **PostgreSQLデータベースサービスを作成（まだ作成していない場合）**
   - 「+ New」→「Database」→「PostgreSQL」を選択
   - データベース名を設定（例: `videostep-video-db`）

3. **各サービスにデータベースを接続**
   
   **video-serviceの場合：**
   - `video-service`サービスを開く
   - 「Variables」タブを開く
   - 「Connect Database」ボタンをクリック（または「+ New」→「Database」）
   - PostgreSQLサービスを選択して接続
   - **これにより、`DATABASE_URL`環境変数が自動的に設定されます**

   **他のサービス（editing-service, auth-service, user-service, translation-service）も同様に：**
   - 各サービスを開く
   - 「Variables」タブを開く
   - 「Connect Database」ボタンをクリック
   - PostgreSQLサービスを選択して接続

4. **確認**
   - 接続後、「Variables」タブで`DATABASE_URL`が表示されていることを確認
   - 形式: `postgresql://user:password@host:port/database`

5. **再デプロイ**
   - 各サービスが自動的に再デプロイされます
   - または、「Deployments」タブから手動で再デプロイ

### 方法2: 環境変数を手動で設定

もし「Connect Database」ボタンが表示されない、または手動で設定したい場合：

1. **Railwayダッシュボードで各サービスを開く**
   - `video-service`、`editing-service`、`auth-service`、`user-service`、`translation-service`

2. **「Variables」タブを開く**

3. **環境変数を追加**
   - 「+ New Variable」をクリック
   - 以下のいずれかを設定：

   **オプションA: DATABASE_URLを設定（推奨）**
   ```
   Name: DATABASE_URL
   Value: postgresql://user:password@host:port/database
   ```
   
   **オプションB: SPRING_DATASOURCE_URLを設定**
   ```
   Name: SPRING_DATASOURCE_URL
   Value: jdbc:postgresql://host:port/database
   ```
   
   **注意**: `SPRING_DATASOURCE_URL`を設定する場合、ユーザー名とパスワードも別途設定する必要があります：
   ```
   Name: SPRING_DATASOURCE_USERNAME
   Value: username
   
   Name: SPRING_DATASOURCE_PASSWORD
   Value: password
   ```

4. **保存**
   - 「Add」または「Save」をクリック

5. **再デプロイ**
   - サービスが自動的に再デプロイされます

## 各サービスに必要なデータベース

以下のサービスは、それぞれ専用のデータベースが必要です：

- `video-service` → `videostep_video` データベース
- `editing-service` → `videostep_editing` データベース
- `auth-service` → `videostep_auth` データベース
- `user-service` → `videostep_user` データベース
- `translation-service` → `videostep_translation` データベース

**注意**: 1つのPostgreSQLサービスで複数のデータベースを作成することも、各サービス用に個別のPostgreSQLサービスを作成することもできます。

## 確認方法

環境変数が正しく設定されたか確認するには：

1. **Railwayダッシュボードで各サービスを開く**
2. **「Variables」タブを開く**
3. **`DATABASE_URL`または`SPRING_DATASOURCE_URL`が表示されていることを確認**

再デプロイ後、ログで以下のメッセージが表示されることを確認してください：

### 成功パターン

```
DatabaseEnvironmentPostProcessor: Starting environment post-processing
DatabaseEnvironmentPostProcessor: Checking environment variables...
DatabaseEnvironmentPostProcessor: DATABASE_URL from System.getenv() = set
DatabaseEnvironmentPostProcessor: Converting DATABASE_URL to JDBC format = jdbc:postgresql://...
DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL
```

### エラーパターン（まだ環境変数が設定されていない場合）

```
DatabaseEnvironmentPostProcessor: ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
DatabaseEnvironmentPostProcessor: =========================================
DatabaseEnvironmentPostProcessor: RAILWAY SETUP REQUIRED:
...
```

## トラブルシューティング

### 問題: 「Connect Database」ボタンが表示されない

**解決方法**:
1. まずPostgreSQLデータベースサービスを作成してください
2. その後、各サービスで「Connect Database」ボタンが表示されます

### 問題: 環境変数を設定したが、まだエラーが表示される

**解決方法**:
1. 環境変数の値が正しい形式であることを確認
2. サービスを再デプロイしてください
3. ログを確認して、新しいデバッグ情報が表示されているか確認

### 問題: データベース接続エラーが発生する

**解決方法**:
1. PostgreSQLサービスが起動していることを確認
2. データベース名が正しいことを確認
3. ユーザー名とパスワードが正しいことを確認

## 重要な注意事項

- **環境変数は各サービスごとに設定する必要があります**
- **`DATABASE_URL`と`SPRING_DATASOURCE_URL`の両方を設定する必要はありません。どちらか一方で十分です**
- **`DATABASE_URL`を設定することを推奨します（Railwayの標準形式）**

