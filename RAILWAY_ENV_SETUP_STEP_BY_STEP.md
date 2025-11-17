# Railway 環境変数設定 - ステップバイステップガイド

## 📋 現在の状況

ログに以下のメッセージが表示されています：
```
DatabaseEnvironmentPostProcessor: Checking environment variables...
DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL from System.getenv() = null
DatabaseEnvironmentPostProcessor: DATABASE_URL from System.getenv() = null
DatabaseEnvironmentPostProcessor: ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
```

これは、**Railwayで環境変数が設定されていない**ことを示しています。

## ✅ 解決方法：Railwayでデータベースを接続

### ステップ1: Railwayダッシュボードにアクセス

1. ブラウザで https://railway.app にアクセス
2. ログイン
3. VideoStepプロジェクトを選択

### ステップ2: PostgreSQLデータベースサービスを作成（まだ作成していない場合）

1. プロジェクトダッシュボードで「**+ New**」をクリック
2. 「**Database**」を選択
3. 「**PostgreSQL**」を選択
4. データベースサービスが作成されるまで待つ（30秒程度）

**重要**: データベースサービスが作成されていないと、「Connect Database」ボタンが表示されません。

### ステップ3: video-serviceにデータベースを接続

1. **video-service**サービスをクリックして開く
2. 上部のタブから「**Variables**」タブをクリック
3. 「**Connect Database**」ボタン（または「**+ New**」→「**Database**」）をクリック
4. 表示されるリストからPostgreSQLサービスを選択
5. 「**Connect**」または「**Add**」をクリック

**確認**: 「Variables」タブに`DATABASE_URL`が表示されていることを確認してください。

### ステップ4: 他のサービスにもデータベースを接続

以下のサービスにも同じ手順でデータベースを接続してください：

1. **editing-service**
   - 「Variables」タブ → 「Connect Database」 → PostgreSQLサービスを選択

2. **auth-service**
   - 「Variables」タブ → 「Connect Database」 → PostgreSQLサービスを選択

3. **user-service**
   - 「Variables」タブ → 「Connect Database」 → PostgreSQLサービスを選択

4. **translation-service**
   - 「Variables」タブ → 「Connect Database」 → PostgreSQLサービスを選択

### ステップ5: 再デプロイの確認

各サービスにデータベースを接続すると、自動的に再デプロイが開始されます。

1. 各サービスの「**Deployments**」タブを確認
2. 最新のデプロイメントが「**Building**」または「**Deploying**」になっていることを確認
3. デプロイメントが完了するまで待つ（2-3分）

### ステップ6: ログで成功を確認

再デプロイ後、各サービスのログで以下のメッセージが表示されることを確認してください：

```
DatabaseEnvironmentPostProcessor: Starting environment post-processing
DatabaseEnvironmentPostProcessor: Checking environment variables...
DatabaseEnvironmentPostProcessor: DATABASE_URL from System.getenv() = set
DatabaseEnvironmentPostProcessor: Converting DATABASE_URL to JDBC format = jdbc:postgresql://...
DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL
```

## 🔍 トラブルシューティング

### 問題1: 「Connect Database」ボタンが表示されない

**原因**: PostgreSQLデータベースサービスが作成されていない可能性があります。

**解決方法**:
1. ステップ2を実行してPostgreSQLデータベースサービスを作成してください
2. その後、「Connect Database」ボタンが表示されます

### 問題2: 環境変数を設定したが、まだエラーが表示される

**確認事項**:
1. **環境変数が正しく設定されているか確認**
   - 各サービスの「Variables」タブで`DATABASE_URL`が表示されているか確認
   - 値が`postgresql://`で始まっているか確認

2. **サービスが再デプロイされているか確認**
   - 「Deployments」タブで最新のデプロイメントを確認
   - デプロイメントが完了しているか確認
   - 必要に応じて手動で再デプロイ

3. **ログで新しいデバッグ情報が表示されているか確認**
   - `Checking environment variables...`というメッセージが表示されているか確認
   - 表示されていない場合は、新しいコードがデプロイされていない可能性があります

### 問題3: ログに「Checking environment variables...」が表示されない

**原因**: 新しいコードがまだデプロイされていない可能性があります。

**解決方法**:
1. コードがGitHubにプッシュされているか確認
2. Railwayが最新のコードを取得しているか確認
3. 手動で再デプロイを実行

## 📝 手動で環境変数を設定する場合

「Connect Database」ボタンが使用できない場合、手動で環境変数を設定できます：

### 手順

1. 各サービスの「Variables」タブを開く
2. 「**+ New Variable**」をクリック
3. 以下の情報を入力：

   **Name**: `DATABASE_URL`
   
   **Value**: PostgreSQLサービスの「Variables」タブから`DATABASE_URL`の値をコピーして貼り付け
   
   形式: `postgresql://user:password@host:port/database`

4. 「**Add**」をクリック
5. サービスが自動的に再デプロイされます

### PostgreSQLサービスのDATABASE_URLを取得する方法

1. PostgreSQLデータベースサービスを開く
2. 「Variables」タブを開く
3. `DATABASE_URL`の値をコピー
4. 各サービス（video-service、editing-serviceなど）の「Variables」タブに貼り付け

## ✅ 完了確認

すべての設定が完了したら、以下を確認してください：

1. ✅ すべてのサービス（video-service、editing-service、auth-service、user-service、translation-service）に`DATABASE_URL`が設定されている
2. ✅ すべてのサービスが正常にデプロイされている
3. ✅ ログにエラーメッセージが表示されていない
4. ✅ ログに成功メッセージ（`SPRING_DATASOURCE_URL set successfully from DATABASE_URL`）が表示されている

## 🆘 まだ問題が解決しない場合

1. Railwayのサポートに問い合わせる
2. ログの全文を確認して、他のエラーメッセージがないか確認
3. PostgreSQLサービスが正常に起動しているか確認

