# データベース接続エラー修正

## 問題の概要

ログファイルを分析した結果、以下のエラーが発生していました：

```
java.sql.SQLException: Access denied for user 'videostep'@'10.208.3.91' (using password: YES)
```

**最新のログ分析結果:**
- パスワードは正しく抽出されている（`videostep`、9文字）
- 文字コードも正しい（`118,105,100,101,111,115,116,101,112`）
- しかし、MySQLへの接続が拒否されている
- **実際のデータベースのパスワードが`DATABASE_URL`のパスワードと一致していない可能性が高い**

## 原因分析

1. **パスワード抽出**: ログから、パスワードは正しく抽出されているように見えますが、実際のデータベースのパスワードと一致していない可能性があります。

2. **URLエンコード**: パスワードに特殊文字が含まれている場合、URLエンコードが必要ですが、現在のコードでは適切に処理されていない可能性があります。

3. **デバッグ情報不足**: 接続エラーが発生した際に、十分なデバッグ情報が出力されていませんでした。

## 実施した修正

### 1. DATABASE_URLの形式検証と正規化

`DatabaseEnvironmentPostProcessor.java` で、`DATABASE_URL`の形式を検証し、不正な形式を自動的に修正するようにしました：

- `mysql:/`を`mysql://`に自動修正
- `mysqlx:/`を`mysqlx://`に自動修正
- `@@`（二重の@）が含まれている場合の警告と処理
- URL形式の検証を強化

### 2. パスワードのURLデコード処理の改善

`DatabaseEnvironmentPostProcessor.java` と `DatabaseConfig.java` で、パスワードのURLデコード処理を改善しました：

- `%XX`形式のURLエンコードされた文字が含まれている場合のみデコードを実行
- URLエンコードされていない場合は、そのまま使用

### 3. エラーメッセージの詳細化

`DatabaseConfig.java` で、接続エラーが発生した際に、以下の情報を出力するようにしました：

- 使用されたユーザー名
- 使用されたパスワードの長さと最初の文字の文字コード
- JDBC URL
- DATABASE_URL（マスク済み）
- 詳細なトラブルシューティング手順（Railwayダッシュボードでの確認方法を含む）

### 4. DATABASE_URLからの認証情報抽出の改善

`DatabaseConfig.java` で、`DATABASE_URL`から認証情報を抽出する際に、URLデコードとトリム処理を追加しました。

## 根本原因の分析

ログを詳しく分析した結果、以下のことが判明しました：

1. **パスワード抽出は成功**: パスワード`videostep`（9文字）は正しく抽出されています
2. **文字コードも正しい**: `118,105,100,101,111,115,116,101,112`は`videostep`の文字コードと一致
3. **接続が拒否される**: MySQLが`Access denied`エラーを返している

**結論**: コード側の問題ではなく、**Railwayのデータベースの実際のパスワードが`DATABASE_URL`に含まれているパスワードと一致していない**可能性が非常に高いです。

## 次のステップ

### Railwayでの確認事項（重要）

1. **DATABASE_URLの確認**
   - Railwayダッシュボード > あなたのサービス > Variables
   - `DATABASE_URL`環境変数を確認
   - 形式: `mysql://user:password@host:port/database`
   - パスワード部分が正しいか確認

2. **データベースパスワードの確認（最重要）**
   - Railwayダッシュボード > あなたのMySQLサービス > Settings
   - 実際のデータベースパスワードを確認
   - `DATABASE_URL`のパスワードと一致しているか確認
   - **不一致の場合は、以下のいずれかを実行:**
     - オプションA: データベースのパスワードをリセットし、`DATABASE_URL`を更新
     - オプションB: `DATABASE_URL`のパスワードを実際のデータベースパスワードに更新

3. **ユーザー権限の確認**
   - ユーザー`videostep`が存在するか確認
   - ユーザーがIPアドレス`10.208.3.91`（または`%`）から接続する権限があるか確認
   - MySQLで以下を実行:
     ```sql
     SELECT user, host FROM mysql.user WHERE user = 'videostep';
     SHOW GRANTS FOR 'videostep'@'%';
     ```

### トラブルシューティング

接続エラーが発生した場合、以下の手順を試してください：

1. **環境変数の再設定**
   ```bash
   # Railwayダッシュボードで、DATABASE_URLを再設定
   # または、データベースを再接続
   ```

2. **パスワードのリセット**
   - Railwayのデータベースサービスで、パスワードをリセット
   - 新しいパスワードで`DATABASE_URL`を更新

3. **ログの確認**
   - 修正後のコードで、より詳細なエラーメッセージが出力されます
   - ログを確認して、問題を特定してください

## 修正ファイル

- `services/video-service/src/main/java/com/videostep/video/config/DatabaseConfig.java`
- `services/video-service/src/main/java/com/videostep/video/config/DatabaseEnvironmentPostProcessor.java`

## 注意事項

- パスワードに特殊文字が含まれている場合、URLエンコードが必要な場合があります
- Railwayの`DATABASE_URL`は、パスワードを自動的にURLエンコードする場合があります
- 修正後のコードは、URLエンコードされたパスワードとエンコードされていないパスワードの両方に対応しています

