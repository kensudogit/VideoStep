# Railway クイックセットアップガイド

## 🚀 5分で完了する設定手順

### ステップ1: PostgreSQLデータベースサービスを作成

1. Railwayダッシュボード（https://railway.app）にアクセス
2. VideoStepプロジェクトを選択
3. 「+ New」→「Database」→「PostgreSQL」をクリック
4. データベース名を設定（例: `videostep-db`）
5. 作成完了を待つ（30秒程度）

### ステップ2: 各サービスにデータベースを接続

以下の5つのサービスすべてにデータベースを接続してください：

#### ✅ video-service
1. `video-service`サービスを開く
2. 「Variables」タブを開く
3. 「Connect Database」ボタンをクリック
4. PostgreSQLサービスを選択
5. ✅ 完了

#### ✅ editing-service
1. `editing-service`サービスを開く
2. 「Variables」タブを開く
3. 「Connect Database」ボタンをクリック
4. PostgreSQLサービスを選択
5. ✅ 完了

#### ✅ auth-service
1. `auth-service`サービスを開く
2. 「Variables」タブを開く
3. 「Connect Database」ボタンをクリック
4. PostgreSQLサービスを選択
5. ✅ 完了

#### ✅ user-service
1. `user-service`サービスを開く
2. 「Variables」タブを開く
3. 「Connect Database」ボタンをクリック
4. PostgreSQLサービスを選択
5. ✅ 完了

#### ✅ translation-service
1. `translation-service`サービスを開く
2. 「Variables」タブを開く
3. 「Connect Database」ボタンをクリック
4. PostgreSQLサービスを選択
5. ✅ 完了

### ステップ3: 確認

各サービスの「Variables」タブで、`DATABASE_URL`が表示されていることを確認してください。

形式: `postgresql://user:password@host:port/database`

### ステップ4: 再デプロイ（自動）

各サービスは自動的に再デプロイされます。数分待ってから、ログを確認してください。

## ✅ チェックリスト

- [ ] PostgreSQLデータベースサービスを作成
- [ ] video-serviceにデータベースを接続
- [ ] editing-serviceにデータベースを接続
- [ ] auth-serviceにデータベースを接続
- [ ] user-serviceにデータベースを接続
- [ ] translation-serviceにデータベースを接続
- [ ] 各サービスの「Variables」タブで`DATABASE_URL`を確認
- [ ] 各サービスのログで成功メッセージを確認

## 🔍 成功の確認

再デプロイ後、各サービスのログで以下のメッセージが表示されることを確認してください：

```
DatabaseEnvironmentPostProcessor: Starting environment post-processing
DatabaseEnvironmentPostProcessor: Checking environment variables...
DatabaseEnvironmentPostProcessor: DATABASE_URL from System.getenv() = set
DatabaseEnvironmentPostProcessor: Converting DATABASE_URL to JDBC format = jdbc:postgresql://...
DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL
```

## ❌ エラーが続く場合

もしエラーが続く場合は、以下を確認してください：

1. **環境変数が正しく設定されているか**
   - 各サービスの「Variables」タブで`DATABASE_URL`が表示されているか確認

2. **サービスが再デプロイされているか**
   - 「Deployments」タブで最新のデプロイメントを確認
   - 必要に応じて手動で再デプロイ

3. **PostgreSQLサービスが起動しているか**
   - PostgreSQLサービスのログを確認

4. **ログで新しいデバッグ情報が表示されているか**
   - `Checking environment variables...`というメッセージが表示されているか確認
   - 表示されていない場合は、新しいコードがデプロイされていない可能性があります

## 📝 注意事項

- **各サービスは個別のデータベースを必要とします**
  - 1つのPostgreSQLサービスで複数のデータベースを作成するか、各サービス用に個別のPostgreSQLサービスを作成できます
  - データベース名は自動的に設定されます（例: `videostep_video`、`videostep_editing`など）

- **「Connect Database」ボタンが表示されない場合**
  - まずPostgreSQLデータベースサービスを作成してください
  - その後、各サービスで「Connect Database」ボタンが表示されます

## 🆘 サポート

問題が解決しない場合は、以下を確認してください：

1. `RAILWAY_ENV_SETUP_URGENT.md` - 詳細な設定手順
2. `RAILWAY_DATABASE_SETUP.md` - データベース設定の詳細
3. Railwayのログを確認して、エラーメッセージを確認

