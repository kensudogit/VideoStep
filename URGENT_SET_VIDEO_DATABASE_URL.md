# 緊急対応: Video Service DATABASE_URL設定

## 問題

Video Serviceのログから、以下のエラーが発生しています：

```
ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
java.lang.IllegalStateException: SPRING_DATASOURCE_URL or DATABASE_URL must be set in Railway environment variables.
```

Video Serviceに`DATABASE_URL`または`SPRING_DATASOURCE_URL`環境変数が設定されていないため、起動に失敗しています。

## 今すぐ実行する手順

### ステップ1: MySQLサービスの環境変数を取得

1. Railwayダッシュボードで**MySQLサービス**を開く
2. 「Variables」タブを開く
3. 以下の環境変数の値を**コピー**してください：
   - `MYSQLHOST`（例：`mysql.railway.internal`）
   - `MYSQLPORT`（通常：`3306`）
   - `MYSQLDATABASE`（データベース名、例：`videostep`）
   - `MYSQLUSER`（ユーザー名、例：`root`または`videostep`）
   - `MYSQLPASSWORD`（パスワード）

### ステップ2: Video Serviceの環境変数を設定

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く
3. 「+ New Variable」をクリック
4. 以下の環境変数を追加：

#### 方法A: DATABASE_URLを使用（推奨）

**変数名:** `DATABASE_URL`

**値:** 
```
mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=false&allowPublicKeyRetrieval=true
```

**例:**
```
mysql://root:videostep@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

**重要**: 
- `[MYSQLUSER]`、`[MYSQLPASSWORD]`、`[MYSQLHOST]`、`[MYSQLPORT]`、`[MYSQLDATABASE]`をステップ1で取得した実際の値に置き換えてください
- パスワードに特殊文字が含まれている場合は、URLエンコードが必要な場合があります

#### 方法B: SPRING_DATASOURCE_URLを使用

**変数名:** `SPRING_DATASOURCE_URL`

**値:**
```
jdbc:mysql://[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=false&allowPublicKeyRetrieval=true
```

**例:**
```
jdbc:mysql://mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

**追加の環境変数:**
- `SPRING_DATASOURCE_USERNAME` = `[MYSQLUSER]`
- `SPRING_DATASOURCE_PASSWORD` = `[MYSQLPASSWORD]`

### ステップ3: Video Serviceを再デプロイ

1. **VideoStep**サービスの「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック
3. 再デプロイが完了するまで待つ（通常1-2分）

### ステップ4: Video Serviceのログを確認

1. **VideoStep**サービスの「Logs」タブを開く
2. 以下のメッセージを確認：

**正常な起動:**
```
Started VideoServiceApplication
Tomcat started on port 8082 (http)
```

**エラー（環境変数未設定）:**
```
ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
```

**エラー（認証失敗）:**
```
Access denied for user 'videostep'@'10.210.84.219' (using password: YES)
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

Video Serviceが正常に起動したら：

1. MySQL接続が成功していることを確認（ログで「H2フォールバック」メッセージが消えていることを確認）
2. Eureka接続を確認（Service Registryが正常に起動している場合）
3. フロントエンドからAPI Gateway経由でVideo Serviceにアクセスできることを確認

