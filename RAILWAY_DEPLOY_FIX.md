# Railway デプロイ修正と完全公開モード設定ガイド

## 🔧 修正内容

### 問題
- `SPRING_DATASOURCE_URL` が設定されているが認証情報（ユーザー名・パスワード）が含まれていない
- `DATABASE_URL` から認証情報を取得できない
- 結果として `FATAL: password authentication failed for user "videostep"` エラーが発生

### 解決策
すべてのサービス（video-service, auth-service, editing-service, translation-service, user-service）の `DatabaseEnvironmentPostProcessor` を更新し、以下の機能を追加：

1. `SPRING_DATASOURCE_URL` に認証情報が含まれていない場合、`DATABASE_URL` から認証情報を自動的に抽出
2. 認証情報が見つからない場合、明確なエラーメッセージを表示
3. `DATABASE_URL` が優先的に使用されるように改善

## 🚀 Railway デプロイ手順

### ステップ1: PostgreSQLデータベースの作成

1. Railwayダッシュボードにアクセス: https://railway.app
2. プロジェクトを選択（または新規作成）
3. 「+ New」→「Database」→「PostgreSQL」を選択
4. データベースが作成されるまで待つ（数分）

### ステップ2: 各サービスにデータベースを接続

以下のサービスそれぞれに対して、データベースを接続してください：

- `video-service`
- `auth-service`
- `editing-service`
- `translation-service`
- `user-service`

**接続手順（各サービスに対して）:**

1. サービスを開く
2. 「Variables」タブを開く
3. 「Connect Database」ボタンをクリック
4. PostgreSQLサービスを選択
5. ✅ `DATABASE_URL` が自動的に設定されます

### ステップ3: サービスを完全公開モードで設定

各サービスを公開するには：

1. サービスを開く
2. 「Settings」タブを開く
3. 「Generate Domain」をクリックして公開URLを生成
4. または「Custom Domain」で独自のドメインを設定

### ステップ4: 環境変数の確認

各サービスの「Variables」タブで以下が設定されていることを確認：

- ✅ `DATABASE_URL` - PostgreSQL接続URL（自動設定）
- ✅ `SPRING_DATASOURCE_URL` - 設定されている場合は問題なし（認証情報が含まれていない場合、`DATABASE_URL`から自動取得）

### ステップ5: デプロイの確認

1. 各サービスが正常にデプロイされているか確認
2. ログを確認して、以下のメッセージが表示されていることを確認：
   ```
   DatabaseEnvironmentPostProcessor: Database configuration set successfully
   DatabaseEnvironmentPostProcessor: Username extracted from DATABASE_URL
   DatabaseEnvironmentPostProcessor: Password extracted from DATABASE_URL
   ```

## 📋 チェックリスト

### データベース接続
- [ ] PostgreSQLデータベースサービスが作成されている
- [ ] video-serviceにデータベースが接続されている
- [ ] auth-serviceにデータベースが接続されている
- [ ] editing-serviceにデータベースが接続されている
- [ ] translation-serviceにデータベースが接続されている
- [ ] user-serviceにデータベースが接続されている

### 環境変数
- [ ] 各サービスの「Variables」タブで`DATABASE_URL`が表示されている
- [ ] すべてのサービスが再デプロイされている

### 公開設定
- [ ] 各サービスに公開URLが設定されている
- [ ] サービスが正常に起動している
- [ ] ログにエラーメッセージが表示されていない

## 🔍 トラブルシューティング

### エラー: "password authentication failed for user"

**原因**: `DATABASE_URL` が設定されていない、または認証情報が正しく抽出されていない

**解決方法**:
1. サービスの「Variables」タブで `DATABASE_URL` が設定されているか確認
2. `DATABASE_URL` が設定されていない場合、「Connect Database」ボタンで接続
3. サービスを再デプロイ

### エラー: "Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set"

**原因**: 環境変数が設定されていない

**解決方法**:
1. サービスの「Variables」タブを開く
2. 「Connect Database」ボタンでデータベースを接続
3. `DATABASE_URL` が自動的に設定されることを確認

### サービスが起動しない

**確認事項**:
1. ログを確認してエラーメッセージを確認
2. `DATABASE_URL` が正しく設定されているか確認
3. データベースサービスが正常に動作しているか確認
4. サービスを再デプロイ

## 📝 注意事項

1. **各サービスに個別にデータベースを接続する必要があります**
   - 1つのサービスに接続しても、他のサービスには影響しません
   - すべてのサービス（5つ）に接続してください

2. **「Connect Database」ボタンが表示されない場合**
   - まずPostgreSQLデータベースサービスを作成してください
   - その後、各サービスで「Connect Database」ボタンが表示されます

3. **環境変数の優先順位**
   - `DATABASE_URL` が最優先で使用されます
   - `SPRING_DATASOURCE_URL` が設定されている場合でも、認証情報がない場合は `DATABASE_URL` から取得します

## 🎉 完了後の確認

すべての設定が完了したら、以下を確認してください：

1. ✅ すべてのサービスのログに成功メッセージが表示されている
2. ✅ エラーメッセージが表示されていない
3. ✅ アプリケーションが正常に起動している
4. ✅ 各サービスに公開URLが設定されている
5. ✅ APIエンドポイントにアクセスできる

## 🔗 関連ドキュメント

- [RAILWAY_QUICK_SETUP.md](./RAILWAY_QUICK_SETUP.md) - クイックセットアップガイド
- [RAILWAY_ENV_SETUP_STEP_BY_STEP.md](./RAILWAY_ENV_SETUP_STEP_BY_STEP.md) - ステップバイステップガイド
- [CURRENT_STATUS.md](./CURRENT_STATUS.md) - 現在の状況

