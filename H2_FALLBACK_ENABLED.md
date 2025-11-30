# H2フォールバック有効化

## 変更内容

Video Serviceがデータベース接続情報（`DATABASE_URL`または`SPRING_DATASOURCE_URL`）を設定していない場合でも、H2フォールバック（mockデータ）を使用して起動できるように修正しました。

## 修正したファイル

1. **`DatabaseEnvironmentPostProcessor.java`**
   - データベース接続情報が設定されていない場合、例外をスローせずに警告を出力して続行
   - H2フォールバックを使用することを示すメッセージを出力

2. **`DatabaseConfig.java`**
   - JDBC URLが設定されていない場合、デフォルトの`DataSourceProperties`を使用する代わりに、H2フォールバック（`createH2DataSource()`）を使用

## 動作

### 以前の動作

- データベース接続情報が設定されていない場合、`IllegalStateException`をスローしてアプリケーションの起動を停止
- エラーログ:
  ```
  ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
  IllegalStateException: SPRING_DATASOURCE_URL or DATABASE_URL must be set...
  ```

### 修正後の動作

- データベース接続情報が設定されていない場合、警告を出力してH2フォールバックを使用して起動を続行
- 警告ログ:
  ```
  WARNING - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
  FALLBACK MODE:
    - Application will start with H2 in-memory database (mock data)
    - This is a fallback mode for development/testing
  Continuing with H2 fallback (mock data)...
  ```
- H2フォールバックが正常に作成され、アプリケーションが起動

## メリット

1. **開発/テスト環境での利便性**: データベース接続を設定しなくても、アプリケーションを起動して動作確認できる
2. **段階的なデプロイ**: データベース接続を後から設定しても、アプリケーションは起動できる
3. **エラー回避**: データベース接続情報の設定ミスがあっても、アプリケーションは起動できる（H2フォールバックを使用）

## 注意事項

- **本番環境**: 本番環境では、必ずデータベース接続情報を設定してください
- **データの永続化**: H2フォールバックはインメモリデータベースのため、アプリケーション再起動時にデータが失われます
- **機能制限**: 一部の機能が制限される可能性があります（mockデータベースのため）

## 次のステップ

1. RailwayでVideo Serviceを再デプロイ
2. Video Serviceのログを確認して、H2フォールバックが使用されていることを確認
3. 必要に応じて、データベース接続情報を設定（本番環境の場合）

## ログの確認方法

Video Serviceのログで以下のメッセージを確認してください：

```
DatabaseEnvironmentPostProcessor: WARNING - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
DatabaseEnvironmentPostProcessor: Continuing with H2 fallback (mock data)...
DatabaseConfig: WARNING - JDBC URL is not configured
DatabaseConfig: FALLBACK - Using H2 in-memory database (mock data)
DatabaseConfig: H2データベース接続が正常に確立されました
DatabaseConfig: H2 database connection established successfully
DatabaseConfig: 注意: これはフォールバックデータベース（mockデータ）です
DatabaseConfig: Note: This is a fallback database with mock data
```

