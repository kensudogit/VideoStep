# Video Service データベース接続エラー対応

## エラー内容

ログから以下のエラーが確認されました：

```
java.lang.IllegalStateException: SPRING_DATASOURCE_URL or DATABASE_URL must be set in Railway environment variables. See logs above for setup instructions.
```

## 原因

Video Serviceがデータベース接続情報（`SPRING_DATASOURCE_URL`または`DATABASE_URL`）を必要としていますが、環境変数が設定されていないため起動に失敗しています。

## 対応手順

### 方法1: Railwayでデータベースを接続（推奨）

#### ステップ1: MySQLデータベースを作成

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. 「New」→「Database」→「Add MySQL」を選択
4. データベース名を設定（例：`videostep_video`）
5. データベースが作成されるまで待つ

#### ステップ2: Video Serviceにデータベースを接続

1. Video Serviceサービスを開く
2. 「Variables」タブを開く
3. 「Connect Database」ボタンをクリック（または「Add Variable」→「Connect Database」）
4. 作成したMySQLデータベースを選択
5. `DATABASE_URL`が自動的に設定されます

### 方法2: 環境変数を手動で設定

#### ステップ1: MySQLデータベースの接続情報を取得

1. MySQLデータベースサービスを開く
2. 「Variables」タブを開く
3. 以下の情報をコピー：
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

#### ステップ2: Video Serviceの環境変数を設定

1. Video Serviceサービスを開く
2. 「Variables」タブを開く
3. 「New Variable」をクリック
4. 以下の環境変数を追加：

**方法A: SPRING_DATASOURCE_URLを使用**

```
SPRING_DATASOURCE_URL=jdbc:mysql://[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MYSQLUSER]
SPRING_DATASOURCE_PASSWORD=[MYSQLPASSWORD]
```

**方法B: DATABASE_URLを使用**

```
DATABASE_URL=mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]
```

**重要**: `[MYSQLHOST]`、`[MYSQLPORT]`などの部分を、ステップ1で取得した実際の値に置き換えてください。

### ステップ3: 再デプロイ

環境変数を設定すると、Railwayが自動的に再デプロイを開始します。

1. 「Deployments」タブを開く
2. 新しいデプロイメントが開始されていることを確認
3. デプロイが完了するまで待つ（5-10分）

### ステップ4: ログを確認

デプロイ完了後、ログを確認：

1. 「Deployments」タブで最新のデプロイメントを選択
2. ログを確認
3. 以下のメッセージが表示されていることを確認：
   ```
   Started VideoServiceApplication
   ```
4. データベース接続エラーがないことを確認

## 必要な環境変数（まとめ）

Video Serviceで設定が必要な環境変数：

### Eureka接続（必須）
```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

### データベース接続（必須）
```
SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_video?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MySQLユーザー名]
SPRING_DATASOURCE_PASSWORD=[MySQLパスワード]
```
または
```
DATABASE_URL=mysql://[MySQLユーザー名]:[MySQLパスワード]@[MySQLホスト]:3306/videostep_video
```

### OpenAI API Key（オプション、機能によっては必須）
```
OPENAI_API_KEY=[あなたのOpenAI APIキー]
```

## トラブルシューティング

### データベース接続エラーが続く場合

1. **接続情報が正しいか確認**
   - MySQLデータベースの接続情報を再確認
   - 環境変数の値が正しいか確認

2. **データベースが作成されているか確認**
   - MySQLデータベースサービスが正常に起動しているか確認
   - データベース名が正しいか確認

3. **SSL設定を確認**
   - RailwayのMySQLはSSL必須のため、`useSSL=true`を設定

### デプロイが失敗する場合

1. **ログを確認**
   - エラーメッセージを特定
   - データベース接続エラーがないか確認

2. **環境変数を再確認**
   - すべての環境変数が正しく設定されているか確認
   - タイポがないか確認

## 確認チェックリスト

- [ ] MySQLデータベースが作成されている
- [ ] Video Serviceにデータベースが接続されている（または環境変数が設定されている）
- [ ] `SPRING_DATASOURCE_URL`または`DATABASE_URL`が設定されている
- [ ] `SPRING_DATASOURCE_USERNAME`と`SPRING_DATASOURCE_PASSWORD`が設定されている（SPRING_DATASOURCE_URLを使用する場合）
- [ ] Eureka接続の環境変数が設定されている
- [ ] Video Serviceを再デプロイ済み
- [ ] ログに`Started VideoServiceApplication`が表示されている
- [ ] データベース接続エラーがない

## 次のステップ

Video Serviceが正常に起動したら：

1. Service RegistryのEurekaダッシュボードで、Video Serviceが登録されているか確認
2. 他のサービス（Translation Service、Editing Serviceなど）も同様にデータベース接続を設定
3. API GatewayからVideo Serviceにアクセスできるか確認

