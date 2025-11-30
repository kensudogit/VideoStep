# rootユーザーでDATABASE_URLを設定する方法

## Railwayでの環境変数参照形式

Railwayでは、**環境変数を直接参照することはできません**。代わりに、以下の方法を使用します：

### ❌ 間違った形式

```
mysql://root:${{MYSQL_ROOT_PASSWORD}}@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

この形式は**GitHub Actions**の形式であり、Railwayでは動作しません。

### ✅ 正しい方法

Railwayでは、環境変数の値を**直接入力**する必要があります。

## 設定手順

### ステップ1: MySQLサービスのMYSQL_ROOT_PASSWORDを確認

1. Railwayダッシュボードで**MySQL**サービスを開く
2. 「Variables」タブを開く
3. `MYSQL_ROOT_PASSWORD`環境変数を探す
4. 値がマスクされている場合：
   - 「...」メニューをクリック
   - 「Reveal」または「Show」を選択（可能な場合）
   - または、MySQLサービスを再作成して新しいパスワードを設定

**注意**: Railwayでは、セキュリティのため、パスワードがマスクされている場合があります。その場合は、以下の方法を試してください。

### ステップ2: MYSQL_ROOT_PASSWORDを確認する方法

#### 方法1: 値を表示する（可能な場合）

1. MySQLサービスの「Variables」タブで`MYSQL_ROOT_PASSWORD`を探す
2. 「...」メニューをクリック
3. 「Reveal」または「Show」を選択
4. パスワードをコピー

#### 方法2: MySQLサービスを再作成する

1. MySQLサービスを削除
2. 新しいMySQLサービスを作成
3. 新しい`MYSQL_ROOT_PASSWORD`が自動生成される
4. 新しいパスワードをコピー

#### 方法3: 既知のパスワードを使用する

MySQLサービスを作成した際に設定したパスワードを使用してください。

### ステップ3: Video ServiceのDATABASE_URLを設定

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く
3. `DATABASE_URL`環境変数を編集（存在しない場合は「+ New Variable」をクリック）
4. 以下の形式で値を入力：

   ```
   mysql://root:[実際のMYSQL_ROOT_PASSWORDの値]@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
   ```

   **例:**
   ```
   mysql://root:MySecurePassword123@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
   ```

   **重要**: `[実際のMYSQL_ROOT_PASSWORDの値]`を、ステップ2で確認した実際のパスワードに置き換えてください。

### ステップ4: パスワードに特殊文字が含まれている場合

パスワードに特殊文字（`@`, `:`, `/`, `?`, `#`, `[`, `]`など）が含まれている場合、URLエンコードする必要があります：

- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`

**例:**
```
元のパスワード: My@Password:123
URLエンコード後: My%40Password%3A123
DATABASE_URL: mysql://root:My%40Password%3A123@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

### ステップ5: Video Serviceを再デプロイ

1. 「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック
3. 再デプロイが完了するまで待つ（通常1-2分）

### ステップ6: 接続テスト

1. 「Logs」タブを開く
2. 以下のメッセージを探してください：

   **✅ 正常な接続:**
   ```
   DatabaseConfig: Connection test successful with authentication
   HikariPool-1 - Start completed.
   ```

   **❌ 認証エラー:**
   ```
   Access denied for user 'root'@'10.237.208.83' (using password: YES)
   ```
   - `MYSQL_ROOT_PASSWORD`が正しくない可能性があります
   - パスワードを再確認してください

   **❌ 接続タイムアウト:**
   ```
   Communications link failure
   Connect timed out
   ```
   - MySQLサービスが起動していない可能性があります
   - MySQLサービスの状態を確認してください

## 代替方法: SPRING_DATASOURCE_URLを使用

`DATABASE_URL`の代わりに、`SPRING_DATASOURCE_URL`を使用することもできます：

### 設定方法

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く
3. `SPRING_DATASOURCE_URL`環境変数を追加（存在しない場合）
4. 以下の形式で値を入力：

   ```
   jdbc:mysql://mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
   ```

5. `SPRING_DATASOURCE_USERNAME`環境変数を追加：
   ```
   root
   ```

6. `SPRING_DATASOURCE_PASSWORD`環境変数を追加：
   ```
   [実際のMYSQL_ROOT_PASSWORDの値]
   ```

**メリット:**
- パスワードを別の環境変数として管理できる
- URLエンコードが不要（パスワードに特殊文字が含まれている場合）

## トラブルシューティング

### 問題1: MYSQL_ROOT_PASSWORDが表示されない

**対応:**
- MySQLサービスを再作成して新しいパスワードを設定
- または、既知のパスワードを使用

### 問題2: 認証エラーが発生する

**対応:**
1. `MYSQL_ROOT_PASSWORD`が正しいか確認
2. パスワードに特殊文字が含まれている場合、URLエンコードされているか確認
3. `SPRING_DATASOURCE_URL`と`SPRING_DATASOURCE_PASSWORD`を使用する方法を試す

### 問題3: 接続タイムアウトが発生する

**対応:**
1. MySQLサービスの状態を確認（起動しているか）
2. `mysql.railway.internal`が正しいホスト名か確認
3. MySQLサービスのログを確認

## まとめ

### ❌ 使用しない形式

```
mysql://root:${{MYSQL_ROOT_PASSWORD}}@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

### ✅ 正しい形式

```
mysql://root:[実際のMYSQL_ROOT_PASSWORDの値]@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
```

**重要:**
- Railwayでは環境変数を直接参照できません
- `MYSQL_ROOT_PASSWORD`の実際の値を直接入力する必要があります
- パスワードに特殊文字が含まれている場合、URLエンコードが必要です

