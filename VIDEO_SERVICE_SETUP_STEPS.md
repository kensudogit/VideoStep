# Video Service 設定手順（完全版）

## 概要

Video ServiceをRailwayで正常に動作させるために必要な設定手順です。

## 必要な設定

1. **データベース接続**（MySQL）
2. **Eureka接続**（Service Registry）

## ステップ1: MySQLの接続情報を取得

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **MySQLサービス**をクリック（MySQLのカードをクリック）
4. 「Variables」タブを開く
5. 以下の環境変数の値を**メモまたはコピー**してください：

   - `MYSQLHOST`（例：`containers-us-west-xxx.railway.app`）
   - `MYSQLPORT`（通常：`3306`）
   - `MYSQLDATABASE`（データベース名）
   - `MYSQLUSER`（ユーザー名）
   - `MYSQLPASSWORD`（パスワード）

## ステップ2: Video Serviceを開く

1. Railwayダッシュボードで、**Video Serviceサービス**を開く
   - サービス一覧から`{} video-service`を探す
   - または、`video-service`という名前のサービスを探す
2. 「Variables」タブを開く

## ステップ3: データベース接続の環境変数を設定

「Variables」タブで「+ New Variable」ボタンをクリックし、以下の環境変数を追加します。

### 方法A: DATABASE_URLを使用（推奨・簡単）

**1つ目の環境変数：**

```
変数名: DATABASE_URL
変数値: mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]
```

**実際の例**（ステップ1で取得した値を使用）：
```
DATABASE_URL=mysql://root:password123@containers-us-west-xxx.railway.app:3306/videostep_video
```

**重要**: 
- `[MYSQLUSER]`を実際のユーザー名に置き換える
- `[MYSQLPASSWORD]`を実際のパスワードに置き換える
- `[MYSQLHOST]`を実際のホスト名に置き換える
- `[MYSQLPORT]`を実際のポート番号に置き換える（通常は`3306`）
- `[MYSQLDATABASE]`を実際のデータベース名に置き換える（または`videostep_video`などの新しいデータベース名）

### 方法B: SPRING_DATASOURCE_URLを使用

**1つ目の環境変数：**

```
変数名: SPRING_DATASOURCE_URL
変数値: jdbc:mysql://[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=true&allowPublicKeyRetrieval=true
```

**2つ目の環境変数：**

```
変数名: SPRING_DATASOURCE_USERNAME
変数値: [MYSQLUSER]
```

**3つ目の環境変数：**

```
変数名: SPRING_DATASOURCE_PASSWORD
変数値: [MYSQLPASSWORD]
```

**実際の例**：
```
SPRING_DATASOURCE_URL=jdbc:mysql://containers-us-west-xxx.railway.app:3306/videostep_video?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password123
```

## ステップ4: Eureka接続の環境変数を設定

同じ「Variables」タブで、以下の環境変数も追加します。

**4つ目の環境変数：**

```
変数名: EUREKA_CLIENT_ENABLED
変数値: true
```

**5つ目の環境変数：**

```
変数名: EUREKA_CLIENT_REGISTER_WITH_EUREKA
変数値: true
```

**6つ目の環境変数：**

```
変数名: EUREKA_CLIENT_FETCH_REGISTRY
変数値: true
```

**7つ目の環境変数：**

```
変数名: EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE
変数値: https://service-registry-production-6ee0.up.railway.app/eureka/
```

**重要**: 
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値は、実際のService RegistryのパブリックURLに置き換えてください
- Service RegistryのパブリックURLは、Service Registryサービスの「Settings」→「Networking」で確認できます
- URLは`https://`で始まり、`/eureka/`で終わる必要があります

## ステップ5: 環境変数の確認

設定した環境変数が正しいか確認：

1. 「Variables」タブで、設定した環境変数が表示されているか確認
2. 値が正しいか確認（特にパスワードやホスト名）
3. タイポがないか確認

## ステップ6: 再デプロイの確認

環境変数を設定すると、**自動的に再デプロイが開始されます**。

1. 「Deployments」タブを開く
2. 最新のデプロイメントの状態を確認
3. 「Active」になるまで待つ（1-2分）

**注意**: デプロイが完了するまで数分かかる場合があります。

## ステップ7: ログで確認

1. 「Logs」タブを開く
2. 以下を確認：

   ✅ **成功のサイン：**
   - `Started VideoServiceApplication`が表示されている
   - データベース接続エラーがない
   - Eurekaへの登録が成功している（`Registered instance`などのメッセージ）

   ❌ **エラーのサイン：**
   - `ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!`
   - `Cannot execute request on any known server`（Eureka接続エラー）
   - データベース接続エラー

## 設定する環境変数の完全なリスト

Video Serviceに設定する環境変数の完全なリスト：

### データベース接続（方法A: DATABASE_URL - 推奨）

```
DATABASE_URL=mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]
```

### データベース接続（方法B: SPRING_DATASOURCE_URL）

```
SPRING_DATASOURCE_URL=jdbc:mysql://[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=[MYSQLUSER]
SPRING_DATASOURCE_PASSWORD=[MYSQLPASSWORD]
```

### Eureka接続

```
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

### Eureka接続エラーが続く場合

1. **Service Registryが正常に動作しているか確認**
   - Service Registryサービスのログを確認
   - Service Registryが正常に起動しているか確認

2. **Service RegistryのパブリックURLが正しいか確認**
   - Service Registryサービスの「Settings」→「Networking」で確認
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値が正しいか確認（`https://`で始まり、`/eureka/`で終わる）

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
- [ ] `EUREKA_CLIENT_ENABLED=true`を設定済み
- [ ] `EUREKA_CLIENT_REGISTER_WITH_EUREKA=true`を設定済み
- [ ] `EUREKA_CLIENT_FETCH_REGISTRY=true`を設定済み
- [ ] `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`を設定済み
- [ ] 環境変数の値が正しいか確認済み
- [ ] 再デプロイが完了している
- [ ] ログに`Started VideoServiceApplication`が表示されている
- [ ] データベース接続エラーがない
- [ ] Eureka接続エラーがない

## 次のステップ

Video Serviceが正常に起動したら：

1. Service RegistryのEurekaダッシュボードで、Video Serviceが登録されているか確認
   - Service RegistryのパブリックURLにアクセス
   - Eurekaダッシュボードで`VIDEO-SERVICE`が表示されているか確認

2. API GatewayからVideo Serviceにアクセスできるか確認

3. 他のサービス（Translation Service、Editing Serviceなど）も同様に設定

