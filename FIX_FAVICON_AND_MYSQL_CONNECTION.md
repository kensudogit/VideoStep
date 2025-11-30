# Faviconエラー修正とMySQL接続確認手順

## 1. Faviconエラーの修正

### 問題

Next.js 13+のApp Routerで、`src/app/favicon.ico`が自動的にメタデータとして処理されますが、ファイルが破損しているか、無効な形式である可能性があります。

### 修正内容

1. `src/app/favicon.ico`を削除（Next.jsの自動処理を無効化）
2. `layout.tsx`からfaviconの明示的な指定を削除
3. `public/favicon.ico`を使用（Next.jsの標準的な方法）

### 修正後の動作

- `public/favicon.ico`が自動的に`/favicon.ico`として提供されます
- Next.jsが自動的にfaviconを処理します

---

## 2. MySQLサーバーのIPアドレス疎通確認手順

### ステップ1: MySQLサービスのIPアドレスを確認

#### Railwayダッシュボードで確認

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **MySQL**サービスをクリック
4. 「Variables」タブを開く
5. 以下の環境変数を確認：
   - `MYSQLHOST`: MySQLサーバーのホスト名（例: `mysql.railway.internal`）
   - `MYSQLPORT`: MySQLサーバーのポート（通常: `3306`）

#### 内部ネットワークでの接続確認

Railwayの内部ネットワークでは、`mysql.railway.internal`というホスト名が使用されます。

### ステップ2: Video ServiceからMySQLへの接続確認

#### 方法1: Video Serviceのログを確認

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Logs」タブを開く
3. 以下のメッセージを探してください：

   **✅ 正常な接続:**
   ```
   DatabaseConfig: Connection test successful with authentication
   HikariPool-1 - Start completed.
   ```

   **❌ 接続エラー:**
   ```
   Access denied for user 'videostep'@'10.237.208.83' (using password: YES)
   Communications link failure
   Connect timed out
   ```

#### 方法2: Video Serviceの環境変数を確認

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く
3. 以下の環境変数を確認：
   - `DATABASE_URL`または`SPRING_DATASOURCE_URL`
   - `MYSQLHOST`（MySQLサービスの環境変数から取得）

### ステップ3: MySQLユーザーのIPアドレス許可を確認

#### RailwayのMySQLサービスで確認

1. Railwayダッシュボードで**MySQL**サービスを開く
2. 「Variables」タブを開く
3. 以下の環境変数を確認：
   - `MYSQLUSER`: MySQLユーザー名
   - `MYSQLPASSWORD`: MySQLパスワード
   - `MYSQLHOST`: MySQLホスト名
   - `MYSQLPORT`: MySQLポート

#### MySQLユーザーのIPアドレス許可を確認（MySQL CLIを使用）

**注意**: RailwayのMySQLサービスでは、通常、すべてのIPアドレスからの接続が許可されています（`%`ワイルドカード）。

もしMySQL CLIにアクセスできる場合：

```sql
-- MySQLユーザーの権限を確認
SELECT user, host FROM mysql.user WHERE user = 'videostep';

-- 特定のIPアドレスからの接続を許可（必要に応じて）
GRANT ALL PRIVILEGES ON videostep.* TO 'videostep'@'%' IDENTIFIED BY 'videostep';
FLUSH PRIVILEGES;
```

### ステップ4: ネットワーク接続の確認

#### Video ServiceからMySQLへの接続テスト

Video Serviceのログで、以下のエラーメッセージを確認：

1. **認証エラー:**
   ```
   Access denied for user 'videostep'@'10.237.208.83' (using password: YES)
   ```
   - **原因**: MySQLユーザーの認証情報が正しくない
   - **対応**: MySQLサービスの環境変数から正しい認証情報を取得して、Video Serviceの`DATABASE_URL`を更新

2. **接続タイムアウト:**
   ```
   Communications link failure
   Connect timed out
   ```
   - **原因**: MySQLサーバーに到達できない、またはMySQLサービスが起動していない
   - **対応**: MySQLサービスの状態を確認

3. **ホスト名解決エラー:**
   ```
   Unknown host: mysql.railway.internal
   ```
   - **原因**: 内部ネットワークのホスト名が解決できない
   - **対応**: Railwayの内部ネットワーク設定を確認

### ステップ5: MySQLサービスの状態確認

1. Railwayダッシュボードで**MySQL**サービスを開く
2. 「Deployments」タブを開く
3. 最新のデプロイメントが「Active」であることを確認
4. 「Logs」タブを開く
5. 以下のメッセージを探してください：

   **✅ 正常な起動:**
   ```
   MySQL init process done. Ready for start up.
   mysqld: ready for connections.
   ```

   **❌ エラー:**
   ```
   ERROR
   Failed to start
   ```

### ステップ6: Video ServiceのDATABASE_URLを確認・更新

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く
3. `DATABASE_URL`または`SPRING_DATASOURCE_URL`を確認
4. 以下の形式であることを確認：
   ```
   mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=false&allowPublicKeyRetrieval=true
   ```
5. MySQLサービスの環境変数から正しい値を取得して更新

### ステップ7: 接続テスト

1. Video Serviceを再デプロイ
2. Video Serviceのログを確認
3. 以下のメッセージを確認：

   **✅ 正常な接続:**
   ```
   DatabaseConfig: Connection test successful with authentication
   HikariPool-1 - Start completed.
   ```

   **❌ エラー（H2フォールバック使用）:**
   ```
   DatabaseConfig: フォールバック - H2データベース（mockデータ）を使用して処理を継続します
   DatabaseConfig: H2 database connection established successfully
   ```

---

## トラブルシューティング

### 問題1: MySQL認証エラー

**エラーメッセージ:**
```
Access denied for user 'videostep'@'10.237.208.83' (using password: YES)
```

**対応:**
1. MySQLサービスの環境変数から正しい認証情報を取得
2. Video Serviceの`DATABASE_URL`を更新
3. Video Serviceを再デプロイ

### 問題2: 接続タイムアウト

**エラーメッセージ:**
```
Communications link failure
Connect timed out
```

**対応:**
1. MySQLサービスの状態を確認（起動しているか）
2. MySQLサービスのログを確認
3. `MYSQLHOST`と`MYSQLPORT`が正しいか確認

### 問題3: ホスト名解決エラー

**エラーメッセージ:**
```
Unknown host: mysql.railway.internal
```

**対応:**
1. Railwayの内部ネットワーク設定を確認
2. `MYSQLHOST`が正しいか確認（通常は`mysql.railway.internal`）

### 問題4: H2フォールバックが使用されている

**ログメッセージ:**
```
DatabaseConfig: フォールバック - H2データベース（mockデータ）を使用して処理を継続します
```

**対応:**
- これは正常な動作です（MySQL接続に失敗した場合のフォールバック）
- MySQL接続を確立するには、上記の手順を実行してください

---

## チェックリスト

- [ ] MySQLサービスの状態を確認（起動しているか）
- [ ] MySQLサービスの環境変数を確認（`MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`）
- [ ] Video Serviceの`DATABASE_URL`を確認・更新
- [ ] Video Serviceを再デプロイ
- [ ] Video Serviceのログで接続エラーがないか確認
- [ ] MySQL接続が成功しているか確認（H2フォールバックが使用されていないか）

---

## 注意事項

1. **Railwayの内部ネットワーク**: Railwayのサービス間通信では、`mysql.railway.internal`という内部ホスト名が使用されます。これは外部からアクセスできません。

2. **IPアドレスの動的変更**: Railwayでは、サービスのIPアドレスが動的に変更される可能性があります。そのため、特定のIPアドレスを許可するのではなく、`%`ワイルドカードを使用することを推奨します。

3. **H2フォールバック**: MySQL接続に失敗した場合、Video Serviceは自動的にH2フォールバック（mockデータ）を使用します。これは開発/テスト環境では問題ありませんが、本番環境ではMySQL接続を確立する必要があります。

