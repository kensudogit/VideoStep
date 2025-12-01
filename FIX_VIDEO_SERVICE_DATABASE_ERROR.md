# Video Service データベースエラー修正

## 問題

Video Serviceが`SPRING_DATASOURCE_URL`または`DATABASE_URL`が設定されていないため、起動に失敗しています。

**エラーログ**:
```
ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
java.lang.IllegalStateException: SPRING_DATASOURCE_URL or DATABASE_URL must be set in Railway environment variables.
```

## 原因

現在のコードではH2フォールバックが許可されているはずですが、Railwayにデプロイされているコードが古いバージョンの可能性があります。

## 解決策

### 方法1: Video Serviceに`DATABASE_URL`を設定（推奨）

1. Railwayダッシュボードで`video-service`サービスを選択
2. 「Variables」タブを開く
3. 「+ New Variable」をクリック
4. 以下の変数を追加：

**変数名**: `DATABASE_URL`  
**変数値**: `mysql://root:[MYSQL_ROOT_PASSWORD]@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true`

**注意**: `[MYSQL_ROOT_PASSWORD]`は実際のMySQL rootパスワードに置き換えてください。

#### MySQL rootパスワードの確認方法

1. RailwayダッシュボードでMySQLサービスを選択
2. 「Variables」タブを開く
3. `MYSQL_ROOT_PASSWORD`の値を確認

#### `DATABASE_URL`の構築方法

MySQLサービスの環境変数から以下の情報を取得：
- `MYSQLHOST`: `mysql.railway.internal`（通常）
- `MYSQLPORT`: `3306`（通常）
- `MYSQL_ROOT_PASSWORD`: 実際のパスワード

**形式**:
```
mysql://root:[MYSQL_ROOT_PASSWORD]@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

### 方法2: 最新のコードをデプロイ（H2フォールバックを使用）

最新のコードでは、データベース接続情報が設定されていない場合でもH2フォールバックで起動できるようになっています。

1. 最新のコードをGitHubにプッシュ
2. Railwayが自動デプロイを実行
3. Video ServiceがH2フォールバックで起動（mockデータを使用）

## 緊急対応

### 即座に実行すべきこと

1. **Video Serviceの環境変数を確認**
   - Railwayダッシュボード → `video-service`サービス
   - 「Variables」タブで`DATABASE_URL`または`SPRING_DATASOURCE_URL`が設定されているか確認

2. **`DATABASE_URL`を設定**
   - 上記の方法1に従って`DATABASE_URL`を設定
   - または、MySQLサービスの「Connect Database」機能を使用

3. **Video Serviceを再デプロイ**
   - 「Settings」タブ → 「Redeploy」

## 確認方法

### Video Serviceのログを確認

1. Railwayダッシュボードで`video-service`サービスを選択
2. 「Logs」タブを開く
3. 以下のメッセージを確認：

**正常な起動ログ**:
- `Started VideoServiceApplication`
- `H2 database connection established successfully`（H2フォールバックの場合）

**エラーログがないことを確認**

### Video Serviceのヘルスチェック

Video Serviceが正常に起動している場合、以下のURLで確認できます：

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

**緊急対応**:
- ✅ Video Serviceに`DATABASE_URL`を設定
- ✅ Video Serviceを再デプロイ

**オプション対応**:
- 最新のコードをデプロイしてH2フォールバックを使用（データベース接続が不要）

