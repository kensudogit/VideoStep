# MySQLユーザー設定ガイド

## 現在の設定確認

スクリーンショットから確認できるMySQLサービスの環境変数：

- `MYSQLUSER`: `videostep`
- `MYSQLPASSWORD`: `videostep`
- `MYSQLPORT`: `3306`
- `MYSQL_ROOT_PASSWORD`: `*******` (マスクされている)

## 問題の分析

### 現在の状況

Video Serviceのログで以下の認証エラーが発生していました：

```
Access denied for user 'videostep'@'10.237.208.83' (using password: YES)
```

### 考えられる原因

1. **`videostep`ユーザーが存在しない**
   - MySQLサービスが初期化された際に、`videostep`ユーザーが作成されていない可能性

2. **パスワードが一致しない**
   - `MYSQLPASSWORD`と実際のMySQLパスワードが一致していない可能性

3. **IPアドレスからの接続が許可されていない**
   - `videostep`ユーザーが特定のIPアドレスからの接続のみ許可されている可能性

## 解決策

### オプション1: `root`ユーザーを使用する（推奨：開発環境）

**メリット:**
- RailwayのMySQLサービスでは、`root`ユーザーがデフォルトで提供される
- すべての権限を持っているため、接続エラーが発生しにくい
- 開発環境では問題ない

**デメリット:**
- 本番環境ではセキュリティリスクがある
- すべての権限を持つため、誤操作のリスクがある

**設定方法:**

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く
3. `DATABASE_URL`または`SPRING_DATASOURCE_URL`環境変数を編集
4. 以下の形式で値を更新：
   ```
   mysql://root:[MYSQL_ROOT_PASSWORD]@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
   ```
   - `[MYSQL_ROOT_PASSWORD]`をMySQLサービスの`MYSQL_ROOT_PASSWORD`環境変数の値に置き換えてください

**注意**: `MYSQL_ROOT_PASSWORD`はマスクされているため、値を確認するには：
- MySQLサービスの「Variables」タブで`MYSQL_ROOT_PASSWORD`の「...」メニューから「Reveal」を選択（可能な場合）
- または、MySQLサービスを再作成して新しいパスワードを設定

### オプション2: `videostep`ユーザーを確認・修正する

**メリット:**
- 本番環境に適している
- 最小権限の原則に従う

**デメリット:**
- ユーザーが正しく作成されている必要がある
- 権限設定が必要な場合がある

**設定方法:**

1. **MySQLサービスの環境変数を確認**
   - `MYSQLUSER`: `videostep`
   - `MYSQLPASSWORD`: `videostep`
   - `MYSQLDATABASE`: `videostep`（推測）

2. **Video ServiceのDATABASE_URLを確認**
   - Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
   - 「Variables」タブを開く
   - `DATABASE_URL`または`SPRING_DATASOURCE_URL`を確認
   - 以下の形式であることを確認：
     ```
     mysql://videostep:videostep@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
     ```

3. **MySQLサービスを再作成（必要に応じて）**
   - `videostep`ユーザーが正しく作成されていない場合、MySQLサービスを再作成する必要がある場合があります

## 推奨設定（開発環境）

### 開発環境の場合

**`root`ユーザーを使用することを推奨します：**

1. MySQLサービスの`MYSQL_ROOT_PASSWORD`を確認（可能な場合）
2. Video Serviceの`DATABASE_URL`を以下の形式に更新：
   ```
   mysql://root:[MYSQL_ROOT_PASSWORD]@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
   ```

### 本番環境の場合

**`videostep`ユーザーを使用することを推奨します：**

1. MySQLサービスの環境変数を確認
2. Video Serviceの`DATABASE_URL`を以下の形式に更新：
   ```
   mysql://videostep:videostep@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
   ```

## 現在の設定の確認

### MySQLサービスの環境変数

スクリーンショットから確認できる設定：
- ✅ `MYSQLUSER`: `videostep` - 設定済み
- ✅ `MYSQLPASSWORD`: `videostep` - 設定済み
- ✅ `MYSQLPORT`: `3306` - 設定済み
- ✅ `MYSQL_ROOT_PASSWORD`: 設定済み（マスクされている）

### Video ServiceのDATABASE_URL

現在の設定を確認してください：

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く
3. `DATABASE_URL`または`SPRING_DATASOURCE_URL`を確認

**期待される形式:**
```
mysql://videostep:videostep@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

または（rootユーザーを使用する場合）:
```
mysql://root:[MYSQL_ROOT_PASSWORD]@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

## 次のステップ

### ステップ1: Video ServiceのDATABASE_URLを確認

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く
3. `DATABASE_URL`または`SPRING_DATASOURCE_URL`を確認
4. 上記の形式と一致しているか確認

### ステップ2: rootユーザーを使用する場合

1. MySQLサービスの`MYSQL_ROOT_PASSWORD`を確認（可能な場合）
2. Video Serviceの`DATABASE_URL`を更新：
   ```
   mysql://root:[MYSQL_ROOT_PASSWORD]@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
   ```
3. Video Serviceを再デプロイ

### ステップ3: videostepユーザーを使用する場合

1. Video Serviceの`DATABASE_URL`を確認：
   ```
   mysql://videostep:videostep@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
   ```
2. Video Serviceを再デプロイ
3. Video Serviceのログで認証エラーが解消されているか確認

### ステップ4: 接続テスト

1. Video Serviceのログを確認
2. 以下のメッセージを探してください：

   **✅ 正常な接続:**
   ```
   DatabaseConfig: Connection test successful with authentication
   HikariPool-1 - Start completed.
   ```

   **❌ 認証エラー（rootユーザーを使用する場合）:**
   ```
   Access denied for user 'root'@'10.237.208.83' (using password: YES)
   ```
   - `MYSQL_ROOT_PASSWORD`が正しくない可能性があります

   **❌ 認証エラー（videostepユーザーを使用する場合）:**
   ```
   Access denied for user 'videostep'@'10.237.208.83' (using password: YES)
   ```
   - `videostep`ユーザーが存在しない、またはパスワードが間違っている可能性があります

## 結論

### 開発環境の場合

**`root`ユーザーを使用することを推奨します：**

- RailwayのMySQLサービスでは、`root`ユーザーがデフォルトで提供される
- 接続エラーが発生しにくい
- 開発環境では問題ない

### 本番環境の場合

**`videostep`ユーザーを使用することを推奨します：**

- セキュリティベストプラクティスに従う
- 最小権限の原則に従う
- ただし、ユーザーが正しく作成されている必要がある

## 現在の設定の確認方法

1. **MySQLサービスの環境変数:**
   - `MYSQLUSER`: `videostep` ✅
   - `MYSQLPASSWORD`: `videostep` ✅
   - `MYSQLPORT`: `3306` ✅
   - `MYSQL_ROOT_PASSWORD`: 設定済み ✅

2. **Video ServiceのDATABASE_URL:**
   - 現在の設定を確認してください
   - `videostep`ユーザーを使用している場合、認証エラーが発生する可能性があります
   - `root`ユーザーを使用する場合、`MYSQL_ROOT_PASSWORD`が必要です

## 推奨アクション

**開発環境の場合:**
1. `root`ユーザーを使用するように`DATABASE_URL`を更新
2. `MYSQL_ROOT_PASSWORD`を確認（可能な場合）
3. Video Serviceを再デプロイ

**本番環境の場合:**
1. `videostep`ユーザーが正しく作成されているか確認
2. Video Serviceの`DATABASE_URL`を確認
3. 認証エラーが継続する場合、`root`ユーザーに切り替えることを検討

