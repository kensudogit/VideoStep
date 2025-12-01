# SPRING_DATASOURCE_URL 正しい設定値

## 設定形式

### JDBC URL形式（推奨）

```
jdbc:mysql://[HOST]:[PORT]/[DATABASE]?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

**注意**: MySQL 9.4.0以降では`sha256_password`が非推奨のため、`defaultAuthenticationPlugin=caching_sha2_password`を追加することを推奨します。

### 完全な形式（ユーザー名・パスワードを含む）

```
jdbc:mysql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

## Railwayでの設定方法

### 方法1: SPRING_DATASOURCE_URLを使用（推奨）

**変数名**: `SPRING_DATASOURCE_URL`  
**変数値**: 
```
jdbc:mysql://mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

**注意**: ユーザー名とパスワードは別途設定する必要があります（下記参照）

### 方法2: DATABASE_URLを使用（Railway推奨）

**変数名**: `DATABASE_URL`  
**変数値**: 
```
mysql://root:[MYSQL_ROOT_PASSWORD]@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

**注意**: `[MYSQL_ROOT_PASSWORD]`は実際のMySQL rootパスワードに置き換えてください

## MySQL接続情報の取得方法

### Railwayダッシュボードから取得

1. RailwayダッシュボードでMySQLサービスを選択
2. 「Variables」タブを開く
3. 以下の変数を確認：

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `MYSQLHOST` | MySQLホスト名 | `mysql.railway.internal` |
| `MYSQLPORT` | MySQLポート | `3306` |
| `MYSQLDATABASE` | データベース名 | `videostep` |
| `MYSQLUSER` | ユーザー名 | `videostep` または `root` |
| `MYSQLPASSWORD` | パスワード | （実際のパスワード） |
| `MYSQL_ROOT_PASSWORD` | rootパスワード | （実際のパスワード） |

## 設定例

### 例1: rootユーザーを使用（開発環境推奨）

**SPRING_DATASOURCE_URL**:
```
jdbc:mysql://mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

**追加で設定する環境変数**:
- `SPRING_DATASOURCE_USERNAME`: `root`
- `SPRING_DATASOURCE_PASSWORD`: `[MYSQL_ROOT_PASSWORD]`（実際の値）

### 例2: videostepユーザーを使用

**SPRING_DATASOURCE_URL**:
```
jdbc:mysql://mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

**追加で設定する環境変数**:
- `SPRING_DATASOURCE_USERNAME`: `videostep`
- `SPRING_DATASOURCE_PASSWORD`: `[MYSQLPASSWORD]`（実際の値）

### 例3: DATABASE_URLを使用（ユーザー名・パスワードを含む）

**DATABASE_URL**:
```
mysql://root:your_actual_root_password@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

**注意**: `your_actual_root_password`は実際のMySQL rootパスワードに置き換えてください

## パスワードに特殊文字が含まれる場合

パスワードに特殊文字（`@`, `:`, `/`, `?`, `#`, `[`, `]`など）が含まれる場合、URLエンコードが必要です：

| 文字 | URLエンコード |
|------|--------------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `[` | `%5B` |
| `]` | `%5D` |

**例**: パスワードが `p@ssw:rd` の場合
```
mysql://root:p%40ssw%3Ard@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

## Video Serviceでの設定手順

### ステップ1: MySQLサービスの環境変数を確認

1. RailwayダッシュボードでMySQLサービスを選択
2. 「Variables」タブを開く
3. `MYSQL_ROOT_PASSWORD`の値を確認（コピー）

### ステップ2: Video Serviceに環境変数を設定

1. Railwayダッシュボードで`video-service`サービスを選択
2. 「Variables」タブを開く
3. 「+ New Variable」をクリック

#### オプションA: SPRING_DATASOURCE_URLを使用

**変数名**: `SPRING_DATASOURCE_URL`  
**変数値**: 
```
jdbc:mysql://mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

**追加で設定**:
- **変数名**: `SPRING_DATASOURCE_USERNAME`  
  **変数値**: `root`

- **変数名**: `SPRING_DATASOURCE_PASSWORD`  
  **変数値**: `[MYSQL_ROOT_PASSWORD]`（ステップ1で確認した値）

#### オプションB: DATABASE_URLを使用（推奨）

**変数名**: `DATABASE_URL`  
**変数値**: 
```
mysql://root:[MYSQL_ROOT_PASSWORD]@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

**注意**: `[MYSQL_ROOT_PASSWORD]`を実際のパスワードに置き換えてください

### ステップ3: Video Serviceを再デプロイ

1. 「Settings」タブを開く
2. 「Redeploy」ボタンをクリック
3. ログで正常起動を確認

## 確認方法

### Video Serviceのログを確認

1. Railwayダッシュボードで`video-service`サービスを選択
2. 「Logs」タブを開く
3. 以下のメッセージを確認：

**正常な起動ログ**:
- `DatabaseConfig: Using JDBC URL = jdbc:mysql://...`
- `HikariPool-1 - Start completed.`
- `Started VideoServiceApplication`

**エラーログがないことを確認**

### ヘルスチェック

```
https://[video-service-url]/actuator/health
```

**期待される結果**:
```json
{
  "status": "UP"
}
```

## まとめ

### 推奨設定（DATABASE_URL）

**変数名**: `DATABASE_URL`  
**変数値**: 
```
mysql://root:[実際のrootパスワード]@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

### 代替設定（SPRING_DATASOURCE_URL）

**変数名**: `SPRING_DATASOURCE_URL`  
**変数値**: 
```
jdbc:mysql://mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true&defaultAuthenticationPlugin=caching_sha2_password
```

**追加で設定**:
- `SPRING_DATASOURCE_USERNAME`: `root`
- `SPRING_DATASOURCE_PASSWORD`: `[実際のrootパスワード]`

## トラブルシューティング

### 認証プラグインの警告について

MySQL 9.4.0以降では、`sha256_password`プラグインが非推奨になりました。ログに以下の警告が表示される場合：

```
'sha256_password' is deprecated and will be removed in a future release. Please use caching_sha2_password instead
```

**解決方法**: JDBC URLに`defaultAuthenticationPlugin=caching_sha2_password`パラメータを追加してください。

### 接続エラー（ERROR 1045）について

「ERROR 1045 (28000): Access denied」エラーが発生する場合：

1. **パスワードの確認**: Railwayダッシュボードで`MYSQL_ROOT_PASSWORD`の値を確認し、環境変数に正しく設定されているか確認
2. **ユーザー名の確認**: `SPRING_DATASOURCE_USERNAME`が`root`または正しいユーザー名になっているか確認
3. **認証プラグインの設定**: 上記の`defaultAuthenticationPlugin=caching_sha2_password`を追加
4. **サービス再デプロイ**: 設定変更後、必ずサービスを再デプロイ

## 注意事項

- **Service Registryには設定しない**: Service Registryはデータベースを使用しないため、`SPRING_DATASOURCE_URL`は不要です
- **パスワードの取り扱い**: パスワードは機密情報なので、適切に管理してください
- **特殊文字のエンコード**: パスワードに特殊文字が含まれる場合は、URLエンコードが必要です
- **認証プラグイン**: MySQL 9.4.0以降では`caching_sha2_password`を使用することを推奨します

