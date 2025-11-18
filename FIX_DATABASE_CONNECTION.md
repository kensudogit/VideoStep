# Railway データベース接続エラー修正ガイド

## 問題の症状

ログに以下のエラーが表示されます：
```
Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.
```

## 原因

Video Service（および他のサービス）が`localhost:5432`に接続しようとしていますが、RailwayではPostgreSQLデータベースは別のサービスとして存在し、環境変数で接続URLを設定する必要があります。

## 解決方法

### ステップ1: PostgreSQLデータベースサービスを作成

Railwayダッシュボードで、各サービス用のPostgreSQLデータベースを作成します：

1. **Railwayダッシュボードでプロジェクトを開く**
2. **「New」→「Database」→「Add PostgreSQL」をクリック**
3. **サービス名を設定**（例：`videostep-video-db`）
4. **作成されたデータベースの`DATABASE_URL`を確認**

必要なデータベース：
- `videostep-auth-db` (Auth Service用)
- `videostep-video-db` (Video Service用)
- `videostep-translation-db` (Translation Service用)
- `videostep-editing-db` (Editing Service用)
- `videostep-user-db` (User Service用)

### ステップ2: 各サービスに環境変数を設定

**重要**: 既に`SPRING_DATASOURCE_URL`が設定されている場合は、既存の値を削除してから新しい値を設定してください。

#### Video Service

1. **RailwayダッシュボードでVideo Serviceを開く**
2. **Settings → Variables を開く**
3. **既存の`SPRING_DATASOURCE_URL`がある場合は削除**
4. **以下の環境変数を追加**：

```
SPRING_DATASOURCE_URL=${{videostep-video-db.DATABASE_URL}}
```

**重要**: `videostep-video-db`は、ステップ1で作成したPostgreSQLデータベースのサービス名に置き換えてください。

#### Auth Service

1. **既存の`SPRING_DATASOURCE_URL`がある場合は削除**
2. **以下の環境変数を追加**：

```
SPRING_DATASOURCE_URL=${{videostep-auth-db.DATABASE_URL}}
```

#### Translation Service

1. **既存の`SPRING_DATASOURCE_URL`がある場合は削除**
2. **以下の環境変数を追加**：

```
SPRING_DATASOURCE_URL=${{videostep-translation-db.DATABASE_URL}}
```

#### Editing Service

1. **既存の`SPRING_DATASOURCE_URL`がある場合は削除**
2. **以下の環境変数を追加**：

```
SPRING_DATASOURCE_URL=${{videostep-editing-db.DATABASE_URL}}
```

#### User Service

1. **既存の`SPRING_DATASOURCE_URL`がある場合は削除**
2. **以下の環境変数を追加**：

```
SPRING_DATASOURCE_URL=${{videostep-user-db.DATABASE_URL}}
```

### ステップ3: Railway CLIで設定する場合

```bash
# Video Service
cd C:\devlop\VideoStep\services\video-service
railway link
railway variables set SPRING_DATASOURCE_URL='${{videostep-video-db.DATABASE_URL}}'

# Auth Service
cd C:\devlop\VideoStep\services\auth-service
railway link
railway variables set SPRING_DATASOURCE_URL='${{videostep-auth-db.DATABASE_URL}}'

# Translation Service
cd C:\devlop\VideoStep\services\translation-service
railway link
railway variables set SPRING_DATASOURCE_URL='${{videostep-translation-db.DATABASE_URL}}'

# Editing Service
cd C:\devlop\VideoStep\services\editing-service
railway link
railway variables set SPRING_DATASOURCE_URL='${{videostep-editing-db.DATABASE_URL}}'

# User Service
cd C:\devlop\VideoStep\services\user-service
railway link
railway variables set SPRING_DATASOURCE_URL='${{videostep-user-db.DATABASE_URL}}'
```

## 環境変数の形式

Railwayでは、他のサービスの環境変数を参照する際に以下の形式を使用します：

```
${{service-name.VARIABLE_NAME}}
```

例：
- `${{videostep-video-db.DATABASE_URL}}` - videostep-video-dbサービスのDATABASE_URLを参照
- `${{service-registry.PORT}}` - service-registryサービスのPORTを参照

## 確認手順

### 1. 環境変数が設定されているか確認

各サービスのRailwayダッシュボードで：
1. **Settings** → **Variables** を開く
2. `SPRING_DATASOURCE_URL` が設定されているか確認
3. 値が `${{service-name.DATABASE_URL}}` の形式であることを確認

### 2. サービスが再デプロイされているか確認

環境変数を追加/変更した後、サービスが自動的に再デプロイされます。デプロイが完了するまで待ちます。

### 3. ログを確認

各サービスのログで、データベース接続が成功しているか確認：

```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

エラーが表示されないことを確認してください。

## 環境変数の重複エラー

### 問題

Railwayダッシュボードで「SPRING_DATASOURCE_URLの設定値が重複しています」というエラーが表示される場合：

### 解決方法

1. **Railwayダッシュボードでサービスを開く**
2. **Settings → Variables を開く**
3. **既存の`SPRING_DATASOURCE_URL`を探す**
4. **既存の値を削除**（ゴミ箱アイコンをクリック）
5. **新しい値を追加**

**注意**: 環境変数は1つのサービスにつき1つだけ設定できます。複数の値がある場合は、正しい値のみを残してください。

### Railway CLIで確認・削除する場合

```bash
# 現在の環境変数を確認
railway variables

# 特定の環境変数を削除
railway variables remove SPRING_DATASOURCE_URL

# 新しい値を設定
railway variables set SPRING_DATASOURCE_URL='${{videostep-video-db.DATABASE_URL}}'
```

## トラブルシューティング

### データベース接続エラーが続く場合

1. **PostgreSQLデータベースサービスが作成されているか確認**
   - Railwayダッシュボードでデータベースサービスが存在するか確認

2. **サービス名が正しいか確認**
   - 環境変数の`${{service-name.DATABASE_URL}}`の`service-name`が、実際のデータベースサービスの名前と一致しているか確認

3. **環境変数の形式が正しいか確認**
   - `${{videostep-video-db.DATABASE_URL}}` の形式が正しいか確認
   - 引用符は不要です（CLIで設定する場合は必要）

4. **データベースサービスが起動しているか確認**
   - データベースサービスのログを確認
   - ステータスが「Active」であることを確認

### 環境変数が認識されない場合

1. **サービスを再デプロイ**
   - 環境変数を追加/変更した後、手動で再デプロイを実行

2. **環境変数の構文を確認**
   - `${{service-name.DATABASE_URL}}` の形式が正しいか確認
   - 大文字小文字が正しいか確認

## まとめ

1. ✅ 各サービス用のPostgreSQLデータベースを作成
2. ✅ 各サービスに `SPRING_DATASOURCE_URL=${{database-service.DATABASE_URL}}` を設定
3. ✅ サービスが再デプロイされるまで待つ
4. ✅ ログでデータベース接続が成功しているか確認

これで、すべてのサービスが正しくPostgreSQLデータベースに接続できるようになります！

