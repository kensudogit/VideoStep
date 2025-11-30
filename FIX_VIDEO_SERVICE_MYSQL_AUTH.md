# Video Service MySQL認証エラー修正

## 問題

Video Serviceのログから、以下のエラーが発生しています：

```
Access denied for user 'videostep'@'10.210.84.219' (using password: YES)
```

Video ServiceがMySQLデータベースに接続できず、H2データベース（フォールバック、mockデータ）に切り替わっています。

## 現在の状況

- **MySQL接続**: 失敗（認証エラー）
- **H2フォールバック**: 有効（メモリ内データベース、mockデータ）
- **Video Service**: 起動は成功しているが、実際のMySQLデータベースを使用していない

## 原因

MySQLデータベースへの認証に失敗しています。考えられる原因：

1. **パスワードが間違っている**
2. **ユーザー名が間違っている**
3. **MySQLユーザーの権限が不足している**
4. **DATABASE_URLの形式が正しくない**

## 解決方法

### ステップ1: MySQLサービスの環境変数を確認

1. Railwayダッシュボードで**MySQLサービス**を開く
2. 「Variables」タブを開く
3. 以下の環境変数の値を**コピー**してください：
   - `MYSQLHOST`
   - `MYSQLPORT`（通常：`3306`）
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

### ステップ2: Video ServiceのDATABASE_URLを確認・更新

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く
3. `DATABASE_URL`環境変数を確認

**現在の形式（推測）:**
```
mysql://videostep:videostep@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

### ステップ3: DATABASE_URLを正しい値に更新

ステップ1で取得したMySQLの認証情報を使用して、`DATABASE_URL`を以下の形式で設定：

```
mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=false&allowPublicKeyRetrieval=true
```

**例:**
```
mysql://root:actual_password@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

**重要**: 
- `[MYSQLUSER]`、`[MYSQLPASSWORD]`、`[MYSQLHOST]`、`[MYSQLPORT]`、`[MYSQLDATABASE]`を実際の値に置き換えてください
- パスワードに特殊文字が含まれている場合は、URLエンコードが必要な場合があります

### ステップ4: Video Serviceを再デプロイ

1. **VideoStep**サービスの「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック
3. 再デプロイが完了するまで待つ（通常1-2分）

### ステップ5: Video Serviceのログを確認

1. **VideoStep**サービスの「Logs」タブを開く
2. 以下のメッセージを確認：

**正常な接続:**
```
HikariPool-1 - Start completed.
```

**エラー（認証失敗）:**
```
Access denied for user 'videostep'@'10.210.84.219' (using password: YES)
```

**フォールバック（H2使用）:**
```
FALLBACK - Using H2 database (mock data) to continue processing
```

### ステップ6: MySQLユーザーの権限を確認（必要に応じて）

MySQLに接続して、ユーザーの権限を確認：

```sql
SELECT user, host FROM mysql.user WHERE user = 'videostep';
SHOW GRANTS FOR 'videostep'@'%';
```

必要に応じて、権限を付与：

```sql
GRANT ALL PRIVILEGES ON videostep.* TO 'videostep'@'%';
FLUSH PRIVILEGES;
```

## トラブルシューティング

### パスワードに特殊文字が含まれている場合

パスワードに特殊文字（`@`、`:`、`/`、`?`、`#`など）が含まれている場合は、URLエンコードが必要です：

- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `%` → `%25`

**例:**
```
パスワード: `p@ssw0rd`
URLエンコード: `p%40ssw0rd`
```

### DATABASE_URLの形式が正しくない場合

`DATABASE_URL`は以下の形式である必要があります：

```
mysql://[username]:[password]@[host]:[port]/[database]?[parameters]
```

**正しい例:**
```
mysql://videostep:videostep@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

### MySQLユーザーが存在しない場合

1. MySQLに接続
2. ユーザーを作成：

```sql
CREATE USER 'videostep'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON videostep.* TO 'videostep'@'%';
FLUSH PRIVILEGES;
```

## 次のステップ

MySQL接続が成功したら：

1. Video Serviceのログで「H2フォールバック」メッセージが消えていることを確認
2. Video Serviceが正常に動作していることを確認
3. Eureka接続を確認（Service Registryが正常に起動している場合）

