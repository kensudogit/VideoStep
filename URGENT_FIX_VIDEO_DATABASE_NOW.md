# 緊急対応: Video Service データベース接続設定（今すぐ実行）

## 問題

Video Serviceが以下のエラーで起動に失敗しています：

```
ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
java.lang.IllegalStateException: SPRING_DATASOURCE_URL or DATABASE_URL must be set in Railway environment variables.
```

## 今すぐ実行する手順

### ステップ1: MySQLの接続情報を取得

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **MySQLサービス**をクリック（MySQLのカードをクリック）
4. 「Variables」タブを開く
5. 以下の環境変数の値を**コピー**してください：

   - `MYSQLHOST`（例：`containers-us-west-xxx.railway.app`）
   - `MYSQLPORT`（通常：`3306`）
   - `MYSQLDATABASE`（データベース名）
   - `MYSQLUSER`（ユーザー名）
   - `MYSQLPASSWORD`（パスワード）

### ステップ2: Video Serviceを開く

1. Railwayダッシュボードで、**Video Serviceサービス**を開く
   - `VideoStep`サービスをクリック（これがVideo Serviceの可能性があります）
   - または、`video-service`という名前のサービスを探す
2. 「Variables」タブを開く

### ステップ3: データベース接続の環境変数を設定

「Variables」タブで「+ New Variable」ボタンをクリックし、以下の環境変数を追加します。

#### 方法A: DATABASE_URLを使用（推奨・簡単）

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

#### 方法B: SPRING_DATASOURCE_URLを使用

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

### ステップ4: Eureka接続の環境変数も設定

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

### ステップ5: 再デプロイの確認

環境変数を設定すると、**自動的に再デプロイが開始されます**。

1. 「Deployments」タブを開く
2. 最新のデプロイメントの状態を確認
3. 「Active」になるまで待つ（1-2分）

### ステップ6: ログで確認

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

## Service Registryの502エラーについて

ターミナルのログを見ると、Eureka接続で502 Bad Gatewayエラーも発生しています：

```
502 Bad Gateway: "{"status":"error","code":502,"message":"Application failed to respond"}"
```

これは、**Service Registryがクラッシュしている**か、**正常に起動していない**ことを示しています。

### Service Registryの対応

1. **Service Registryサービス**を開く（`_ service-registry`カードをクリック）
2. 「Deployments」タブを開く
3. 「Redeploy」ボタンをクリック
4. デプロイが完了するまで待つ
5. Service Registryの「Logs」タブで、`Started EurekaServerApplication`が表示されているか確認

詳細は`FIX_502_EUREKA_ERROR.md`を参照してください。

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
- [ ] Service Registryが正常に起動している（502エラーがない）

## 次のステップ

Video Serviceが正常に起動したら：

1. Service RegistryのEurekaダッシュボードで、Video Serviceが登録されているか確認
2. API GatewayからVideo Serviceにアクセスできるか確認
3. 他のサービス（Translation Service、Editing Serviceなど）も同様に設定

