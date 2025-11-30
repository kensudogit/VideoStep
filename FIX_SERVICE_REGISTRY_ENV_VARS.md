# Service Registry環境変数修正

## 問題

Service Registryの環境変数に以下の問題があります：

### 問題1: 不要なEurekaクライアント設定

Service Registryは**Eureka Server**であり、自分自身にEurekaクライアントとして接続する必要はありません。

現在設定されている環境変数：
- `EUREKA_CLIENT_ENABLED=true` ❌ **不要**
- `EUREKA_CLIENT_REGISTER_WITH_EUREKA=true` ❌ **不要**（自分自身に登録しない）
- `EUREKA_CLIENT_FETCH_REGISTRY=true` ❌ **不要**（自分自身から取得しない）
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/` ❌ **不要**

### 問題2: 不要なデータベース設定

Service Registryはデータベースを使用しません。

現在設定されている環境変数：
- `DATABASE_URL=mysql://videostep:videostep@mysql.railway.internal:3306/videostep` ❌ **不要**

## 解決方法

### ステップ1: Service Registryの環境変数を確認

1. Railwayダッシュボードで**service-registry**サービスを開く
2. 「Variables」タブを開く

### ステップ2: 不要な環境変数を削除

以下の環境変数を**削除**してください：

1. `EUREKA_CLIENT_ENABLED`
2. `EUREKA_CLIENT_REGISTER_WITH_EUREKA`
3. `EUREKA_CLIENT_FETCH_REGISTRY`
4. `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`
5. `DATABASE_URL`
6. `MYSQL_DATABASE`
7. `MYSQL_PUBLIC_URL`
8. `MYSQL_URL`
9. `MYSQLDATABASE`
10. `MYSQLHOST`

**削除方法:**
1. 各環境変数の右側の「...」メニューをクリック
2. 「Delete」を選択
3. 確認ダイアログで「Delete」をクリック

### ステップ3: 必要な環境変数のみを残す

Service Registryに必要な環境変数：
- `OPENAI_API_KEY`（必要に応じて）
- `EUREKA_INSTANCE_HOSTNAME`（設定されていない場合は削除または空にする）

**注意**: Railwayが自動的に設定した環境変数（`> 8 variables added by Railway`と表示されているもの）は、削除しても自動的に再作成される場合があります。その場合は、無視して構いません。

### ステップ4: Service Registryを再デプロイ

1. **service-registry**サービスの「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック
3. 再デプロイが完了するまで待つ（通常1-2分）

### ステップ5: Service Registryのログを確認

1. **service-registry**サービスの「Logs」タブを開く
2. 以下のメッセージを確認：

**正常な起動:**
```
Started ServiceRegistryApplication
Tomcat started on port(s): 8761 (http)
```

**エラー（Eurekaクライアント関連）:**
```
ERROR - Eureka client configuration error
```

### ステップ6: Service Registryのヘルスチェックを確認

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

正常な場合：`{"status":"UP"}`が返される

### ステップ7: Eurekaダッシュボードを確認

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app
```

正常な場合：Eurekaダッシュボードが表示される

## なぜこれらの環境変数が問題なのか

### Eurekaクライアント設定の問題

Service RegistryはEureka Serverとして動作します。Eureka Serverは：
- 他のサービス（Video Service、API Gatewayなど）からの登録を受け付ける
- 自分自身に登録する必要はない
- 自分自身からサービス一覧を取得する必要はない

`EUREKA_CLIENT_ENABLED=true`を設定すると、Service Registryが自分自身にEurekaクライアントとして接続しようとし、循環参照や起動エラーの原因になる可能性があります。

### データベース設定の問題

Service Registryはデータベースを使用しません。Eureka Serverは：
- メモリ内でサービス登録情報を管理する
- データベースへの永続化は行わない（デフォルト設定の場合）

不要な`DATABASE_URL`が設定されていると、Service Registryがデータベース接続を試みてエラーになる可能性があります。

## 次のステップ

Service Registryの環境変数を修正し、再デプロイしたら：

1. Service Registryが正常に起動することを確認
2. Video ServiceのEureka接続を確認
3. API GatewayのEureka接続を確認

