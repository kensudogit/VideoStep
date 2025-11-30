# 既存MySQLにVideo Serviceを接続

## 既存のMySQLを使用する場合

既にMySQLサーバが設定されている場合、新しいMySQLを作成する必要はありません。既存のMySQLデータベースにVideo Serviceを接続してください。

## 接続手順

### ステップ1: Video Serviceに既存のMySQLを接続

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **Video Service**サービスを開く（VideoStepサービスではなく、Video Serviceサービス）
4. 「Variables」タブを開く
5. 「Connect Database」ボタンをクリック
6. **既存のMySQLデータベース**を選択
7. `DATABASE_URL`が自動的に設定されます

### ステップ2: データベース名の確認

既存のMySQLが他のサービスで使用されている場合、データベース名を確認してください：

1. MySQLサービスの「Variables」タブを開く
2. `MYSQLDATABASE`の値を確認
3. Video Serviceが使用するデータベース名を確認

**注意**: 複数のサービスが同じMySQLインスタンスを使用する場合、各サービスは異なるデータベース名を使用する必要があります。

### ステップ3: データベース名を指定する場合

既存のMySQLを使用しつつ、Video Service専用のデータベース名を使用する場合：

1. Video Serviceの「Variables」タブを開く
2. 「Connect Database」で既存のMySQLを選択
3. `DATABASE_URL`が自動設定される
4. 必要に応じて、`MYSQLDATABASE`環境変数を追加してデータベース名を指定

または、`SPRING_DATASOURCE_URL`を手動で設定：

```
SPRING_DATASOURCE_URL=jdbc:mysql://[MYSQLHOST]:[MYSQLPORT]/videostep_video?useSSL=true&allowPublicKeyRetrieval=true
```

### ステップ4: Eureka環境変数を設定

Video Serviceで以下も設定してください：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

**重要**: `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値は、実際のService RegistryのパブリックURLに置き換えてください。

### ステップ5: 再デプロイの確認

環境変数を設定すると、自動的に再デプロイが開始されます。

1. 「Deployments」タブを開く
2. 最新のデプロイメントの状態を確認
3. 「Active」になるまで待つ（1-2分）

### ステップ6: ログで確認

1. 「Logs」タブを開く
2. 以下を確認：
   - `Started VideoServiceApplication`が表示されている
   - データベース接続エラーがない
   - Eurekaへの登録が成功している

## 既存MySQLを使用する場合の注意点

### 1. データベース名の競合

複数のサービスが同じMySQLインスタンスを使用する場合：
- 各サービスは異なるデータベース名を使用する必要があります
- 例：`videostep_video`、`videostep_user`、`videostep_translation`など

### 2. 接続数の制限

MySQLの接続数制限に注意：
- 複数のサービスが同じMySQLに接続する場合、接続プールの設定を調整する必要がある場合があります

### 3. パフォーマンス

複数のサービスが同じMySQLインスタンスを使用する場合：
- 負荷が分散されるため、パフォーマンスに影響する可能性があります
- 本番環境では、各サービスに専用のデータベースを用意することを推奨します

## 確認チェックリスト

- [ ] 既存のMySQLデータベースを確認済み
- [ ] Video Serviceに既存のMySQLを接続済み（`DATABASE_URL`が設定されている）
- [ ] データベース名が正しいか確認済み
- [ ] Eureka環境変数を設定済み
- [ ] 再デプロイが完了している
- [ ] ログに`Started VideoServiceApplication`が表示されている
- [ ] データベース接続エラーがない

## トラブルシューティング

### データベース接続エラーが続く場合

1. **既存のMySQLが正常に動作しているか確認**
   - MySQLサービスのログを確認
   - MySQLが正常に起動しているか確認

2. **接続情報が正しいか確認**
   - `DATABASE_URL`の値が正しいか確認
   - MySQLのホスト、ポート、データベース名が正しいか確認

3. **データベース名が存在するか確認**
   - MySQLに接続して、データベースが存在するか確認
   - データベース名のタイポがないか確認

## 次のステップ

Video Serviceが正常に起動したら：

1. Service RegistryのEurekaダッシュボードで、Video Serviceが登録されているか確認
2. 他のサービス（Translation Service、Editing Serviceなど）も同様に既存のMySQLに接続
3. API GatewayからVideo Serviceにアクセスできるか確認

