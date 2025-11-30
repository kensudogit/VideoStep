# 緊急対応: Video Service データベース接続設定

## 問題

Video Serviceが以下のエラーで起動に失敗しています：

```
ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
java.lang.IllegalStateException: SPRING_DATASOURCE_URL or DATABASE_URL must be set in Railway environment variables.
```

## 解決方法（推奨）

### ステップ1: MySQLデータベースを作成

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. 左側の「+ New」ボタンをクリック
4. 「Database」を選択
5. 「Add MySQL」をクリック
6. データベースが作成されるまで待つ（数秒）

### ステップ2: Video Serviceにデータベースを接続

1. Video Serviceサービスを開く（サービス一覧から選択）
2. 上部の「Variables」タブをクリック
3. 「Connect Database」ボタンを探す（または「+ New Variable」の近く）
4. 「Connect Database」をクリック
5. 作成したMySQLデータベースを選択
6. `DATABASE_URL`が自動的に設定されます

### ステップ3: Eureka環境変数も設定

Video Serviceで以下も設定してください：

1. 「Variables」タブで「+ New Variable」をクリック
2. 以下の環境変数を追加：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

**重要**: `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値は、実際のService RegistryのパブリックURLに置き換えてください。

### ステップ4: 再デプロイの確認

環境変数を設定すると、自動的に再デプロイが開始されます。

1. 「Deployments」タブを開く
2. 最新のデプロイメントの状態を確認
3. 「Active」になるまで待つ（1-2分）

### ステップ5: ログで確認

1. 「Logs」タブを開く
2. 以下を確認：
   - `Started VideoServiceApplication`が表示されている
   - データベース接続エラーがない
   - Eurekaへの登録が成功している

## 確認チェックリスト

- [ ] MySQLデータベースを作成済み
- [ ] Video Serviceにデータベースを接続済み（`DATABASE_URL`が設定されている）
- [ ] Eureka環境変数を設定済み
- [ ] 再デプロイが完了している
- [ ] ログに`Started VideoServiceApplication`が表示されている
- [ ] データベース接続エラーがない

## トラブルシューティング

### データベースが見つからない場合

1. プロジェクト内のすべてのサービスを確認
2. MySQLデータベースが存在することを確認
3. 別のデータベースを作成して接続を試す

### `DATABASE_URL`が設定されない場合

手動で環境変数を設定：

1. 「Variables」タブで「+ New Variable」をクリック
2. 変数名: `DATABASE_URL`
3. 変数値: Railwayが提供するMySQL接続URL（例: `mysql://user:password@host:port/database`）
   - データベースサービスの「Variables」タブで確認できます

### Eureka接続エラーが続く場合

1. Service Registryが正常にデプロイされているか確認
2. Service RegistryのパブリックURLが正しいか確認
3. `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値が正しいか確認（`https://`で始まり、`/eureka/`で終わる）

## 次のステップ

Video Serviceが正常に起動したら：

1. Service RegistryのEurekaダッシュボードで、Video Serviceが登録されていることを確認
2. API GatewayからVideo Serviceにアクセスできることを確認
3. 他のサービス（Translation Service、Editing Serviceなど）も同様にデータベース接続を設定

