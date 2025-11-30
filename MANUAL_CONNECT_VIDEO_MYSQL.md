# Video ServiceにMySQLを手動で接続

## 「Connect Database」ボタンが見つからない場合

「Connect Database」ボタンが見えない場合は、手動で環境変数を設定してください。

## 手動手順

### ステップ1: 既存のMySQLの接続情報を取得

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **MySQLサービス**を開く（MySQLのカードをクリック）
4. 「Variables」タブを開く
5. 以下の環境変数の値をコピー：
   - `MYSQLHOST`（例：`containers-us-west-xxx.railway.app`）
   - `MYSQLPORT`（通常：`3306`）
   - `MYSQLDATABASE`（データベース名）
   - `MYSQLUSER`（ユーザー名）
   - `MYSQLPASSWORD`（パスワード）

### ステップ2: Video Serviceの環境変数を設定

1. **Video Serviceサービス**を開く（`{} video-service`）
2. 「Variables」タブを開く
3. 「+ New Variable」ボタンをクリック
4. 以下の環境変数を追加：

#### 方法A: DATABASE_URLを使用（推奨）

```
変数名: DATABASE_URL
変数値: mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]
```

**例**：
```
DATABASE_URL=mysql://root:password123@containers-us-west-xxx.railway.app:3306/videostep_video
```

**重要**: `[MYSQLUSER]`、`[MYSQLPASSWORD]`などの部分を、ステップ1で取得した実際の値に置き換えてください。

#### 方法B: SPRING_DATASOURCE_URLを使用

```
変数名: SPRING_DATASOURCE_URL
変数値: jdbc:mysql://[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=true&allowPublicKeyRetrieval=true

変数名: SPRING_DATASOURCE_USERNAME
変数値: [MYSQLUSER]

変数名: SPRING_DATASOURCE_PASSWORD
変数値: [MYSQLPASSWORD]
```

**例**：
```
SPRING_DATASOURCE_URL=jdbc:mysql://containers-us-west-xxx.railway.app:3306/videostep_video?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password123
```

### ステップ3: データベース名を指定する場合

既存のMySQLを使用しつつ、Video Service専用のデータベース名を使用する場合：

1. MySQLに接続して、新しいデータベースを作成：
   ```sql
   CREATE DATABASE videostep_video;
   ```

2. または、`DATABASE_URL`でデータベース名を指定：
   ```
   DATABASE_URL=mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/videostep_video
   ```

### ステップ4: Eureka環境変数も設定

Video Serviceで以下も設定してください：

1. 「+ New Variable」をクリック
2. 以下の環境変数を追加：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

**重要**: `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値は、実際のService RegistryのパブリックURLに置き換えてください。

### ステップ5: 環境変数の確認

設定した環境変数が正しいか確認：

1. 「Variables」タブで、設定した環境変数が表示されているか確認
2. 値が正しいか確認（特にパスワードやホスト名）

### ステップ6: 再デプロイの確認

環境変数を設定すると、自動的に再デプロイが開始されます。

1. 「Deployments」タブを開く
2. 最新のデプロイメントの状態を確認
3. 「Active」になるまで待つ（1-2分）

### ステップ7: ログで確認

1. 「Logs」タブを開く
2. 以下を確認：
   - `Started VideoServiceApplication`が表示されている
   - データベース接続エラーがない
   - Eurekaへの登録が成功している

## 環境変数の設定例（完全版）

Video Serviceに設定する環境変数の完全なリスト：

```
# データベース接続（方法A: DATABASE_URL）
DATABASE_URL=mysql://root:password123@containers-us-west-xxx.railway.app:3306/videostep_video

# または（方法B: SPRING_DATASOURCE_URL）
SPRING_DATASOURCE_URL=jdbc:mysql://containers-us-west-xxx.railway.app:3306/videostep_video?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password123

# Eureka接続
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

## トラブルシューティング

### データベース接続エラーが続く場合

1. **接続情報が正しいか確認**
   - MySQLの`MYSQLHOST`、`MYSQLPORT`、`MYSQLUSER`、`MYSQLPASSWORD`が正しいか確認
   - 環境変数の値にタイポがないか確認

2. **データベース名が存在するか確認**
   - MySQLに接続して、データベースが存在するか確認
   - データベース名のタイポがないか確認

3. **SSL設定を確認**
   - RailwayのMySQLはSSL必須のため、`useSSL=true`を設定（SPRING_DATASOURCE_URLを使用する場合）

### 環境変数が反映されない場合

1. **再デプロイを確認**
   - 環境変数を設定した後、自動的に再デプロイが開始されるか確認
   - 手動で再デプロイする場合は、「Deployments」タブで「Redeploy」をクリック

2. **環境変数の値を確認**
   - 「Variables」タブで、設定した環境変数が正しく表示されているか確認
   - 値に特殊文字が含まれている場合、エスケープが必要な場合があります

## 確認チェックリスト

- [ ] MySQLサービスの接続情報を取得済み
- [ ] Video Serviceの「Variables」タブを開いた
- [ ] `DATABASE_URL`または`SPRING_DATASOURCE_URL`を設定済み
- [ ] Eureka環境変数を設定済み
- [ ] 環境変数の値が正しいか確認済み
- [ ] 再デプロイが完了している
- [ ] ログに`Started VideoServiceApplication`が表示されている
- [ ] データベース接続エラーがない

