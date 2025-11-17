# Railway データベース設定ガイド

## 概要

このプロジェクトでは、RailwayでPostgreSQLデータベースを接続する必要があります。環境変数の設定方法は2通りあります。

## 設定方法

### 方法1: Railwayでデータベースサービスを接続（推奨）

RailwayでPostgreSQLサービスを追加し、各サービスに接続すると、`DATABASE_URL`環境変数が自動的に設定されます。

#### 手順

1. Railwayダッシュボードにアクセス
   - https://railway.app にログイン

2. プロジェクトを選択
   - `VideoStep`プロジェクトを選択

3. PostgreSQLサービスを追加
   - 「+ New」→「Database」→「PostgreSQL」を選択
   - 各サービス用に個別のデータベースを作成するか、1つのデータベースを共有するか選択

4. 各サービスにデータベースを接続
   - `video-service`、`editing-service`、`auth-service`、`user-service`、`translation-service`の各サービスを開く
   - 「Variables」タブを開く
   - 「Connect Database」ボタンをクリック
   - PostgreSQLサービスを選択して接続

5. 確認
   - 接続後、各サービスの環境変数に`DATABASE_URL`が自動的に設定されます
   - 形式: `postgresql://user:password@host:port/database`

### 方法2: 環境変数を直接設定

Railwayで直接`SPRING_DATASOURCE_URL`を設定することもできます。

#### 手順

1. Railwayダッシュボードで各サービスを開く
2. 「Variables」タブを開く
3. 以下の環境変数を追加：

```
SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database
SPRING_DATASOURCE_USERNAME=username
SPRING_DATASOURCE_PASSWORD=password
```

**注意**: `SPRING_DATASOURCE_URL`は`jdbc:postgresql://`で始まる必要があります。

## 環境変数の優先順位

1. **SPRING_DATASOURCE_URL**（最優先）
   - Railwayで直接設定された場合、これが使用されます
   - `jdbc:`プレフィックスがない場合は自動的に追加されます

2. **DATABASE_URL**（フォールバック）
   - `SPRING_DATASOURCE_URL`が設定されていない場合、`DATABASE_URL`が使用されます
   - `postgresql://`形式の場合は、自動的に`jdbc:postgresql://`形式に変換されます
   - 既に`jdbc:postgresql://`形式の場合は、そのまま使用されます

3. **エラー**
   - どちらも設定されていない場合、アプリケーションは起動時にエラーで停止します

## 各サービスに必要なデータベース

以下のサービスは、それぞれ専用のデータベースが必要です：

- `video-service` → `videostep_video`
- `editing-service` → `videostep_editing`
- `auth-service` → `videostep_auth`
- `user-service` → `videostep_user`
- `translation-service` → `videostep_translation`

## 確認方法

アプリケーション起動時のログで、以下のメッセージが表示されることを確認してください：

### 成功パターン

```
DatabaseEnvironmentPostProcessor: Starting environment post-processing
DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL = jdbc:postgresql://...
DatabaseEnvironmentPostProcessor: Using SPRING_DATASOURCE_URL from environment variable
```

または

```
DatabaseEnvironmentPostProcessor: Starting environment post-processing
DatabaseEnvironmentPostProcessor: DATABASE_URL = postgresql://...
DatabaseEnvironmentPostProcessor: Converting DATABASE_URL to JDBC format = jdbc:postgresql://...
DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL
```

### エラーパターン

```
DatabaseEnvironmentPostProcessor: ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
DatabaseEnvironmentPostProcessor: Please set one of the following environment variables in Railway:
DatabaseEnvironmentPostProcessor:   1. SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database
DatabaseEnvironmentPostProcessor:   2. DATABASE_URL=postgresql://user:password@host:port/database
```

このエラーが表示された場合は、Railwayで環境変数を設定してください。

## トラブルシューティング

### エラー: `Driver org.postgresql.Driver claims to not accept jdbcUrl, ${SPRING_DATASOURCE_URL}`

**原因**: 環境変数が解決されていません。

**解決方法**:
1. Railwayで`SPRING_DATASOURCE_URL`または`DATABASE_URL`が正しく設定されているか確認
2. 環境変数の値が正しい形式（`jdbc:postgresql://...`または`postgresql://...`）であることを確認
3. サービスを再デプロイ

### エラー: `Connection to localhost:5432 refused`

**原因**: デフォルトの`localhost:5432`に接続しようとしています。

**解決方法**:
1. Railwayでデータベースサービスが接続されているか確認
2. 環境変数が正しく設定されているか確認
3. ログで`DatabaseEnvironmentPostProcessor`の出力を確認

