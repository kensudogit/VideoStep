# MySQL接続タイムアウトエラー対応

## 問題

Video Serviceのログに以下のエラーが表示されています：

```
com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure
Caused by: java.net.SocketTimeoutException: Connect timed out
```

ログから、以下の接続情報が使用されています：

```
JDBC URL: jdbc:mysql://mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
Username: videostep
Password: videostep (length: 9)
```

## 原因

`mysql.railway.internal:3306`への接続がタイムアウトしています。これは以下の可能性があります：

1. **MySQLサービスが起動していない**
2. **MySQLサービスのホスト名が異なる**（`mysql.railway.internal`ではなく、別のホスト名）
3. **MySQLサービスのポートが正しく公開されていない**
4. **Railwayの内部ネットワーク設定の問題**

## 解決方法

### ステップ1: MySQLサービスの状態を確認

1. Railwayダッシュボードで**MySQLサービス**を開く
2. 「Deployments」タブを開く
3. 最新のデプロイメントが「Active」になっているか確認
4. 「Logs」タブを開く
5. MySQLが正常に起動しているか確認（`ready for connections`などのメッセージ）

### ステップ2: MySQLサービスの環境変数を確認

1. **MySQLサービス**の「Variables」タブを開く
2. 以下の環境変数の値を**確認**してください：

   - `MYSQLHOST`（実際のホスト名）
   - `MYSQLPORT`（通常：`3306`）
   - `MYSQLDATABASE`（データベース名）
   - `MYSQLUSER`（ユーザー名）
   - `MYSQLPASSWORD`（パスワード）

**重要**: `MYSQLHOST`の値が`mysql.railway.internal`であることを確認してください。もし異なる場合は、その値を使用する必要があります。

### ステップ3: MySQLサービスのパブリックホスト名を確認

Railwayの内部ネットワークでは、`mysql.railway.internal`が使用されますが、接続できない場合は、パブリックホスト名を試す必要があるかもしれません。

1. **MySQLサービス**の「Settings」タブを開く
2. 「Networking」セクションを確認
3. パブリックホスト名があるか確認（例：`containers-us-west-xxx.railway.app`）

### ステップ4: Video Serviceの環境変数を修正

**方法A: パブリックホスト名を使用（推奨）**

もしMySQLサービスにパブリックホスト名がある場合：

1. **Video Serviceサービス**の「Variables」タブを開く
2. 既存の`SPRING_DATASOURCE_URL`を編集、または削除して再作成
3. 以下の環境変数を設定：

```
変数名: SPRING_DATASOURCE_URL
変数値: jdbc:mysql://[MYSQL_PUBLIC_HOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=true&allowPublicKeyRetrieval=true
```

**実際の例**（MySQLサービスのパブリックホスト名を使用）：
```
SPRING_DATASOURCE_URL=jdbc:mysql://containers-us-west-xxx.railway.app:3306/videostep?useSSL=true&allowPublicKeyRetrieval=true
```

**方法B: 内部ホスト名を確認**

`mysql.railway.internal`が正しい場合：

1. **MySQLサービス**が正常に起動しているか確認
2. MySQLサービスのログで、`ready for connections`が表示されているか確認
3. MySQLサービスの「Deployments」タブで、最新のデプロイメントが「Active」になっているか確認

### ステップ5: MySQLサービスを再デプロイ

MySQLサービスが起動していない、またはクラッシュしている場合：

1. **MySQLサービス**の「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック
3. デプロイが完了するまで待つ（1-2分）
4. MySQLサービスの「Logs」タブで、`ready for connections`が表示されているか確認

### ステップ6: Video Serviceの環境変数を再確認

Video Serviceの「Variables」タブで、以下の環境変数が正しく設定されているか確認：

```
SPRING_DATASOURCE_URL=jdbc:mysql://[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MYSQLUSER]
SPRING_DATASOURCE_PASSWORD=[MYSQLPASSWORD]
```

または、`DATABASE_URL`を使用している場合：

```
DATABASE_URL=mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]
```

**重要**: 
- `[MYSQLHOST]`を実際のホスト名に置き換える（`mysql.railway.internal`またはパブリックホスト名）
- `[MYSQLPORT]`を実際のポート番号に置き換える（通常は`3306`）
- `[MYSQLDATABASE]`を実際のデータベース名に置き換える
- `[MYSQLUSER]`を実際のユーザー名に置き換える
- `[MYSQLPASSWORD]`を実際のパスワードに置き換える

### ステップ7: 再デプロイの確認

環境変数を修正すると、**自動的に再デプロイが開始されます**。

1. 「Deployments」タブを開く
2. 最新のデプロイメントの状態を確認
3. 「Active」になるまで待つ（1-2分）

### ステップ8: ログで確認

1. 「Logs」タブを開く
2. 以下を確認：

   ✅ **成功のサイン：**
   - `Started VideoServiceApplication`が表示されている
   - データベース接続エラーがない
   - `HikariPool-1 - Start completed`が表示されている

   ❌ **エラーのサイン：**
   - `Connect timed out`
   - `Communications link failure`
   - `Failed to initialize pool`

## トラブルシューティング

### MySQLサービスが起動していない場合

1. **MySQLサービス**の「Logs」タブを開く
2. エラーメッセージを確認
3. MySQLサービスの「Deployments」タブで「Redeploy」をクリック
4. デプロイが完了するまで待つ

### 接続タイムアウトが続く場合

1. **MySQLサービスのホスト名を確認**
   - MySQLサービスの「Variables」タブで`MYSQLHOST`を確認
   - もし`mysql.railway.internal`ではなく、別のホスト名が設定されている場合は、その値を使用

2. **パブリックホスト名を試す**
   - MySQLサービスの「Settings」→「Networking」でパブリックホスト名を確認
   - パブリックホスト名がある場合は、それを使用

3. **MySQLサービスのポートを確認**
   - MySQLサービスの「Variables」タブで`MYSQLPORT`を確認
   - 通常は`3306`ですが、異なる場合はその値を使用

4. **MySQLサービスが同じプロジェクト内にあるか確認**
   - Railwayでは、同じプロジェクト内のサービスは内部ネットワークで通信できます
   - 異なるプロジェクトのMySQLサービスに接続しようとしている場合は、パブリックホスト名を使用する必要があります

### 認証エラーが発生する場合

1. **ユーザー名とパスワードを確認**
   - MySQLサービスの「Variables」タブで`MYSQLUSER`と`MYSQLPASSWORD`を確認
   - Video Serviceの環境変数で、これらの値が正しく設定されているか確認

2. **データベース名を確認**
   - MySQLサービスの「Variables」タブで`MYSQLDATABASE`を確認
   - Video Serviceの環境変数で、この値が正しく設定されているか確認

## 確認チェックリスト

- [ ] MySQLサービスの「Deployments」タブで、最新のデプロイメントが「Active」になっている
- [ ] MySQLサービスの「Logs」タブで、`ready for connections`が表示されている
- [ ] MySQLサービスの「Variables」タブで、`MYSQLHOST`、`MYSQLPORT`、`MYSQLDATABASE`、`MYSQLUSER`、`MYSQLPASSWORD`を確認済み
- [ ] Video Serviceの「Variables」タブで、`SPRING_DATASOURCE_URL`（または`DATABASE_URL`）が正しく設定されている
- [ ] Video Serviceの「Variables」タブで、`SPRING_DATASOURCE_USERNAME`と`SPRING_DATASOURCE_PASSWORD`が正しく設定されている（`SPRING_DATASOURCE_URL`を使用している場合）
- [ ] 環境変数の値が正しいか確認済み（ホスト名、ポート、データベース名、ユーザー名、パスワード）
- [ ] 再デプロイが完了している
- [ ] ログに`Started VideoServiceApplication`が表示されている
- [ ] データベース接続エラーがない
- [ ] `HikariPool-1 - Start completed`が表示されている

## 次のステップ

Video Serviceが正常に起動し、データベースに接続できたら：

1. Service RegistryのEurekaダッシュボードで、Video Serviceが登録されているか確認
2. API GatewayからVideo Serviceにアクセスできるか確認
3. 他のサービス（Translation Service、Editing Serviceなど）も同様に設定

