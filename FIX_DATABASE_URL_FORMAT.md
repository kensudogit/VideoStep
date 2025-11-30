# DATABASE_URL形式エラー対応

## 問題

Video Serviceのログに以下のエラーが表示されています：

```
ERROR - Failed to parse mysql:// URL: No @ found in DATABASE_URL
java.lang.IllegalArgumentException: No @ found in DATABASE_URL
```

ログから、`DATABASE_URL`が以下の形式で設定されていることがわかります：

```
mysql://mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

## 原因

Railwayが自動的に設定した`DATABASE_URL`の形式が、アプリケーションが期待する形式と異なっています。

**アプリケーションが期待する形式：**
```
mysql://user:password@host:port/database
```

**Railwayが設定した形式：**
```
mysql://mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

`user:password@`の部分が欠けているため、パースエラーが発生しています。

## 解決方法

### 方法A: SPRING_DATASOURCE_URLを使用（推奨）

`DATABASE_URL`の代わりに、`SPRING_DATASOURCE_URL`を直接設定します。

#### ステップ1: MySQLの接続情報を取得

1. Railwayダッシュボードで**MySQLサービス**を開く
2. 「Variables」タブを開く
3. 以下の環境変数の値を**コピー**してください：

   - `MYSQLHOST`（例：`mysql.railway.internal`または`containers-us-west-xxx.railway.app`）
   - `MYSQLPORT`（通常：`3306`）
   - `MYSQLDATABASE`（データベース名、例：`videostep`）
   - `MYSQLUSER`（ユーザー名）
   - `MYSQLPASSWORD`（パスワード）

#### ステップ2: Video Serviceの環境変数を設定

1. **Video Serviceサービス**の「Variables」タブを開く
2. **既存の`DATABASE_URL`を削除**（または無視）
3. 「+ New Variable」をクリック
4. 以下の環境変数を追加：

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
SPRING_DATASOURCE_URL=jdbc:mysql://mysql.railway.internal:3306/videostep?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password123
```

**重要**: 
- `[MYSQLHOST]`を実際のホスト名に置き換える（`mysql.railway.internal`またはパブリックホスト名）
- `[MYSQLPORT]`を実際のポート番号に置き換える（通常は`3306`）
- `[MYSQLDATABASE]`を実際のデータベース名に置き換える（例：`videostep`）
- `[MYSQLUSER]`を実際のユーザー名に置き換える
- `[MYSQLPASSWORD]`を実際のパスワードに置き換える

### 方法B: DATABASE_URLを正しい形式に修正

既存の`DATABASE_URL`を削除し、正しい形式で再設定します。

#### ステップ1: MySQLの接続情報を取得

上記の「方法A: ステップ1」と同じ

#### ステップ2: Video Serviceの環境変数を修正

1. **Video Serviceサービス**の「Variables」タブを開く
2. **既存の`DATABASE_URL`を削除**
3. 「+ New Variable」をクリック
4. 以下の環境変数を追加：

```
変数名: DATABASE_URL
変数値: mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]
```

**実際の例**：
```
DATABASE_URL=mysql://root:password123@mysql.railway.internal:3306/videostep
```

**重要**: 
- `[MYSQLUSER]`を実際のユーザー名に置き換える
- `[MYSQLPASSWORD]`を実際のパスワードに置き換える
- `[MYSQLHOST]`を実際のホスト名に置き換える
- `[MYSQLPORT]`を実際のポート番号に置き換える（通常は`3306`）
- `[MYSQLDATABASE]`を実際のデータベース名に置き換える

### ステップ3: Eureka環境変数も設定

同じ「Variables」タブで、以下の環境変数も追加します。

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

**重要**: `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値は、実際のService RegistryのパブリックURLに置き換えてください。

### ステップ4: 再デプロイの確認

環境変数を設定すると、**自動的に再デプロイが開始されます**。

1. 「Deployments」タブを開く
2. 最新のデプロイメントの状態を確認
3. 「Active」になるまで待つ（1-2分）

### ステップ5: ログで確認

1. 「Logs」タブを開く
2. 以下を確認：

   ✅ **成功のサイン：**
   - `Started VideoServiceApplication`が表示されている
   - データベース接続エラーがない
   - `DATABASE_URL`のパースエラーがない

   ❌ **エラーのサイン：**
   - `ERROR - Failed to parse mysql:// URL: No @ found in DATABASE_URL`
   - データベース接続エラー

## 推奨される設定

**方法A（SPRING_DATASOURCE_URL）を推奨**します。理由：

1. **より明確**: ユーザー名とパスワードが分離されている
2. **より安全**: パスワードがURLに含まれない（環境変数として分離）
3. **より柔軟**: SSL設定などが直接指定できる

## 設定する環境変数の完全なリスト

Video Serviceに設定する環境変数の完全なリスト：

### データベース接続（方法A: SPRING_DATASOURCE_URL - 推奨）

```
SPRING_DATASOURCE_URL=jdbc:mysql://mysql.railway.internal:3306/videostep?useSSL=true&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password123
```

### データベース接続（方法B: DATABASE_URL）

```
DATABASE_URL=mysql://root:password123@mysql.railway.internal:3306/videostep
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
- [ ] 既存の`DATABASE_URL`を削除済み（または無視）
- [ ] `SPRING_DATASOURCE_URL`、`SPRING_DATASOURCE_USERNAME`、`SPRING_DATASOURCE_PASSWORD`を設定済み（方法A）
- [ ] または、正しい形式の`DATABASE_URL`を設定済み（方法B）
- [ ] Eureka環境変数を設定済み
- [ ] 環境変数の値が正しいか確認済み
- [ ] 再デプロイが完了している
- [ ] ログに`Started VideoServiceApplication`が表示されている
- [ ] `DATABASE_URL`のパースエラーがない
- [ ] データベース接続エラーがない

## トラブルシューティング

### DATABASE_URLのパースエラーが続く場合

1. **既存の`DATABASE_URL`を削除**
   - Video Serviceの「Variables」タブで、既存の`DATABASE_URL`を削除
   - Railwayが自動的に設定した`DATABASE_URL`が原因の可能性があります

2. **`SPRING_DATASOURCE_URL`を使用**
   - `DATABASE_URL`の代わりに、`SPRING_DATASOURCE_URL`を使用することを推奨
   - より明確で、エラーが発生しにくい

3. **接続情報が正しいか確認**
   - MySQLの`MYSQLHOST`、`MYSQLPORT`、`MYSQLDATABASE`、`MYSQLUSER`、`MYSQLPASSWORD`が正しいか確認
   - 環境変数の値にタイポがないか確認

## 次のステップ

Video Serviceが正常に起動したら：

1. Service RegistryのEurekaダッシュボードで、Video Serviceが登録されているか確認
2. API GatewayからVideo Serviceにアクセスできるか確認
3. 他のサービス（Translation Service、Editing Serviceなど）も同様に設定

