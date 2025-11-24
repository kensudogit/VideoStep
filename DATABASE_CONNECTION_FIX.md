# データベース接続エラー修正

## 問題の概要

ログファイル `logs.1763952467653.log` を分析した結果、以下のエラーが発生していました：

```
java.sql.SQLException: Access denied for user 'videostep'@'10.206.169.16' (using password: YES)
```

## 原因分析

1. **パスワード抽出**: ログから、パスワードは正しく抽出されているように見えますが、実際のデータベースのパスワードと一致していない可能性があります。

2. **URLエンコード**: パスワードに特殊文字が含まれている場合、URLエンコードが必要ですが、現在のコードでは適切に処理されていない可能性があります。

3. **デバッグ情報不足**: 接続エラーが発生した際に、十分なデバッグ情報が出力されていませんでした。

## 実施した修正

### 1. パスワードのURLデコード処理の改善

`DatabaseEnvironmentPostProcessor.java` と `DatabaseConfig.java` で、パスワードのURLデコード処理を改善しました：

- `%XX`形式のURLエンコードされた文字が含まれている場合のみデコードを実行
- URLエンコードされていない場合は、そのまま使用

### 2. エラーメッセージの詳細化

`DatabaseConfig.java` で、接続エラーが発生した際に、以下の情報を出力するようにしました：

- 使用されたユーザー名
- 使用されたパスワードの長さ
- JDBC URL
- トラブルシューティング手順

### 3. DATABASE_URLからの認証情報抽出の改善

`DatabaseConfig.java` で、`DATABASE_URL`から認証情報を抽出する際に、URLデコードとトリム処理を追加しました。

## 次のステップ

### Railwayでの確認事項

1. **DATABASE_URLの確認**
   - Railwayダッシュボードで、`DATABASE_URL`環境変数を確認
   - パスワードが正しく設定されているか確認

2. **データベースパスワードの確認**
   - Railwayのデータベースサービスで、実際のパスワードを確認
   - `DATABASE_URL`のパスワードと一致しているか確認

3. **ユーザー権限の確認**
   - ユーザー`videostep`がIPアドレス`10.206.169.16`から接続する権限があるか確認
   - 必要に応じて、ユーザー権限を更新

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

