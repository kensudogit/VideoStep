# ステップバイステップ: 502エラー修正ガイド

## 現在の状況

- フロントエンド: `https://videostep-production.up.railway.app/` → 502 Bad Gateway
- Service Registry: 502 Bad Gateway
- Video Service: Service Registryに接続できない

## 修正手順（必ずこの順序で実行）

### 🔴 ステップ1: Service Registryの環境変数を修正

#### 1-1. Service Registryを開く

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **service-registry**サービスをクリック

#### 1-2. 不要な環境変数を削除

1. 「Variables」タブを開く
2. 以下の環境変数を**1つずつ削除**してください：

   **削除する環境変数リスト:**
   - `EUREKA_CLIENT_ENABLED` → 「...」メニュー → 「Delete」
   - `EUREKA_CLIENT_REGISTER_WITH_EUREKA` → 「...」メニュー → 「Delete」
   - `EUREKA_CLIENT_FETCH_REGISTRY` → 「...」メニュー → 「Delete」
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` → 「...」メニュー → 「Delete」
   - `DATABASE_URL` → 「...」メニュー → 「Delete」
   - `MYSQL_DATABASE` → 「...」メニュー → 「Delete」
   - `MYSQL_PUBLIC_URL` → 「...」メニュー → 「Delete」
   - `MYSQL_URL` → 「...」メニュー → 「Delete」
   - `MYSQLDATABASE` → 「...」メニュー → 「Delete」
   - `MYSQLHOST` → 「...」メニュー → 「Delete」

   **注意**: Railwayが自動的に設定した環境変数（`> 8 variables added by Railway`と表示されているもの）は、削除しても自動的に再作成される場合があります。その場合は、無視して構いません。

#### 1-3. Service Registryを再デプロイ

1. 「Deployments」タブを開く
2. 最新のデプロイメントの「...」メニューをクリック
3. 「Redeploy」を選択
4. 再デプロイが完了するまで待つ（通常1-2分）

#### 1-4. Service Registryのログを確認

1. 「Logs」タブを開く
2. 以下のメッセージを探してください：

   **✅ 正常な起動:**
   ```
   Started ServiceRegistryApplication
   Tomcat started on port(s): 8761 (http)
   ```

   **❌ エラー（起動失敗）:**
   ```
   ERROR
   Exception
   Failed to start
   ```

#### 1-5. Service Registryのヘルスチェック

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

- ✅ **正常な場合**: `{"status":"UP"}`が返される
- ❌ **エラーの場合**: 502 Bad Gatewayが返される

**重要**: Service Registryが正常に起動するまで、次のステップに進まないでください。

---

### 🔴 ステップ2: Video ServiceにDATABASE_URLを設定

#### 2-1. Video Serviceを開く

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く

#### 2-2. DATABASE_URL環境変数を追加

1. 「+ New Variable」をクリック
2. 以下の値を入力：

   **変数名:** `DATABASE_URL`
   
   **値:** 
   ```
   mysql://videostep:videostep@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
   ```

3. 「Add」をクリック

**注意**: MySQL認証エラーが発生する場合は、ステップ2-3を参照してください。

#### 2-3. MySQL認証エラーが発生した場合

1. **MySQLサービス**の「Variables」タブを開く
2. 以下の環境変数の値を**コピー**：
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
3. **VideoStep**サービスの「Variables」タブに戻る
4. `DATABASE_URL`環境変数を編集（「...」メニュー → 「Edit」）
5. 以下の形式で値を更新：
   ```
   mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=false&allowPublicKeyRetrieval=true
   ```
   - `[MYSQLUSER]`、`[MYSQLPASSWORD]`などを実際の値に置き換えてください

#### 2-4. Video Serviceを再デプロイ

1. 「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック
3. 再デプロイが完了するまで待つ（通常1-2分）

#### 2-5. Video Serviceのログを確認

1. 「Logs」タブを開く
2. 以下のメッセージを探してください：

   **✅ 正常な起動:**
   ```
   Started VideoServiceApplication
   Tomcat started on port 8082 (http)
   ```

   **❌ エラー（環境変数未設定）:**
   ```
   ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!
   ```

   **❌ エラー（認証失敗）:**
   ```
   Access denied for user 'videostep'@'10.210.84.219' (using password: YES)
   ```

---

### 🔴 ステップ3: Video ServiceのEureka環境変数を確認

#### 3-1. Video Serviceの環境変数を確認

1. **VideoStep**サービスの「Variables」タブを開く
2. 以下の環境変数が設定されているか確認：

   ```
   EUREKA_CLIENT_ENABLED=true
   EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
   EUREKA_CLIENT_FETCH_REGISTRY=true
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
   ```

#### 3-2. 環境変数が設定されていない場合

1. 「+ New Variable」をクリック
2. 各環境変数を1つずつ追加：
   - `EUREKA_CLIENT_ENABLED` = `true`
   - `EUREKA_CLIENT_REGISTER_WITH_EUREKA` = `true`
   - `EUREKA_CLIENT_FETCH_REGISTRY` = `true`
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` = `https://service-registry-production-6ee0.up.railway.app/eureka/`

#### 3-3. Video Serviceを再デプロイ

1. 「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック

---

### 🔴 ステップ4: 動作確認

#### 4-1. Service RegistryのEurekaダッシュボードを確認

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app
```

- ✅ **正常な場合**: Eurekaダッシュボードが表示される
- ✅ **VIDEO-SERVICEが登録されているか確認**: 「Instances currently registered with Eureka」セクションで、**VIDEO-SERVICE**が表示されていることを確認

#### 4-2. フロントエンドにアクセス

ブラウザで以下にアクセス：

```
https://videostep-production.up.railway.app
```

- ✅ **正常な場合**: アプリケーションが表示される
- ❌ **エラーの場合**: 502 Bad Gatewayが返される

---

## トラブルシューティング

### Service Registryがまだ502を返す場合

1. Service Registryのログを詳細に確認
2. 環境変数が正しく削除されているか確認
3. Service Registryを完全に再デプロイ

### Video ServiceがMySQL認証エラーを返す場合

1. MySQLサービスの環境変数から正しい認証情報を取得
2. Video Serviceの`DATABASE_URL`を更新
3. Video Serviceを再デプロイ

### Video ServiceがEurekaに登録されない場合

1. Service Registryが正常に起動しているか確認
2. Video ServiceのEureka環境変数が正しく設定されているか確認
3. Video ServiceのログでEureka接続エラーがないか確認

---

## 実行チェックリスト

- [ ] ステップ1: Service Registryの環境変数を修正
- [ ] Service Registryを再デプロイ
- [ ] Service Registryのヘルスチェックが`{"status":"UP"}`を返すことを確認
- [ ] ステップ2: Video ServiceにDATABASE_URLを設定
- [ ] Video Serviceを再デプロイ
- [ ] Video Serviceが正常に起動することを確認
- [ ] ステップ3: Video ServiceのEureka環境変数を確認
- [ ] Video Serviceを再デプロイ
- [ ] ステップ4: Service RegistryのEurekaダッシュボードでVIDEO-SERVICEが登録されていることを確認
- [ ] フロントエンドが正常に表示されることを確認

---

## 重要事項

1. **必ず順序通りに実行してください**: Service Registryが正常に起動しない限り、Video ServiceやAPI Gatewayは正常に動作しません。

2. **各ステップの完了を確認**: 各ステップが完了したことを確認してから、次のステップに進んでください。

3. **ログを確認**: 各サービスのログを確認して、エラーメッセージがないか確認してください。

