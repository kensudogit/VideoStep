# 今すぐ実行: 502エラー修正手順

## 現在の状況

- フロントエンド: `https://videostep-production.up.railway.app/` → 502 Bad Gateway
- Service Registry: 502 Bad Gateway（正常に起動していない）
- Video Service: Service Registryに接続できない（502エラー）

## 今すぐ実行する手順

### 🔴 ステップ1: Service Registryの環境変数を修正（最優先）

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **service-registry**サービスをクリック
4. 「Variables」タブを開く
5. 以下の環境変数を**削除**してください（各環境変数の右側の「...」メニューから「Delete」を選択）：

   ❌ **削除する環境変数:**
   - `EUREKA_CLIENT_ENABLED`
   - `EUREKA_CLIENT_REGISTER_WITH_EUREKA`
   - `EUREKA_CLIENT_FETCH_REGISTRY`
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`
   - `DATABASE_URL`
   - `MYSQL_DATABASE`
   - `MYSQL_PUBLIC_URL`
   - `MYSQL_URL`
   - `MYSQLDATABASE`
   - `MYSQLHOST`

   ✅ **残す環境変数:**
   - `OPENAI_API_KEY`（必要に応じて）
   - `EUREKA_INSTANCE_HOSTNAME`（設定されていない場合は削除または空にする）

6. Service Registryを再デプロイ
   - 「Deployments」タブを開く
   - 「Redeploy」ボタンをクリック
   - 再デプロイが完了するまで待つ（通常1-2分）

7. Service Registryのログを確認
   - 「Logs」タブを開く
   - 以下のメッセージを確認：
     ```
     Started ServiceRegistryApplication
     Tomcat started on port(s): 8761 (http)
     ```

8. Service Registryのヘルスチェックを確認
   - ブラウザで以下にアクセス：
     ```
     https://service-registry-production-6ee0.up.railway.app/actuator/health
     ```
   - ✅ 正常な場合：`{"status":"UP"}`が返される
   - ❌ エラーの場合：502 Bad Gatewayが返される

### 🔴 ステップ2: Video ServiceにDATABASE_URLを設定

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く
3. 「+ New Variable」をクリック
4. 以下の環境変数を追加：

   **変数名:** `DATABASE_URL`
   
   **値:** 
   ```
   mysql://videostep:videostep@mysql.railway.internal:3306/videostep?useSSL=false&allowPublicKeyRetrieval=true
   ```

   **注意**: MySQL認証エラーが発生する場合は、MySQLサービスの環境変数から正しい認証情報を取得してください。

5. Video Serviceを再デプロイ
   - 「Deployments」タブを開く
   - 「Redeploy」ボタンをクリック
   - 再デプロイが完了するまで待つ（通常1-2分）

6. Video Serviceのログを確認
   - 「Logs」タブを開く
   - 以下のメッセージを確認：
     ```
     Started VideoServiceApplication
     Tomcat started on port 8082 (http)
     ```

### 🔴 ステップ3: Video ServiceのEureka環境変数を確認

1. **VideoStep**サービスの「Variables」タブを開く
2. 以下の環境変数が正しく設定されているか確認：

   ```
   EUREKA_CLIENT_ENABLED=true
   EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
   EUREKA_CLIENT_FETCH_REGISTRY=true
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
   ```

3. 設定されていない場合は追加

### 🔴 ステップ4: 動作確認

1. **Service RegistryのEurekaダッシュボード**にアクセス：
   ```
   https://service-registry-production-6ee0.up.railway.app
   ```
   - ✅ 正常な場合：Eurekaダッシュボードが表示される
   - 「Instances currently registered with Eureka」セクションで、**VIDEO-SERVICE**が登録されていることを確認

2. **フロントエンド**にアクセス：
   ```
   https://videostep-production.up.railway.app
   ```
   - ✅ 正常な場合：アプリケーションが表示される
   - ❌ エラーの場合：502 Bad Gatewayが返される

## トラブルシューティング

### Service Registryがまだ502を返す場合

1. Service Registryのログを詳細に確認
2. 環境変数が正しく削除されているか確認
3. Service Registryを完全に再デプロイ

### Video ServiceがMySQL認証エラーを返す場合

1. MySQLサービスの環境変数から正しい認証情報を取得：
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
2. Video Serviceの`DATABASE_URL`を更新：
   ```
   mysql://[MYSQLUSER]:[MYSQLPASSWORD]@[MYSQLHOST]:[MYSQLPORT]/[MYSQLDATABASE]?useSSL=false&allowPublicKeyRetrieval=true
   ```
3. Video Serviceを再デプロイ

### API Gatewayがまだ502を返す場合

1. Service Registryが正常に起動しているか確認
2. Video ServiceがEurekaに登録されているか確認
3. API GatewayのEureka環境変数が正しく設定されているか確認

## 実行順序の重要性

**必ず以下の順序で実行してください：**

1. **Service Registry**の環境変数を修正 → 再デプロイ → 正常起動を確認
2. **Video Service**にDATABASE_URLを設定 → 再デプロイ → 正常起動を確認
3. **Video Service**のEureka環境変数を確認
4. **動作確認**

Service Registryが正常に起動しない限り、Video ServiceやAPI Gatewayは正常に動作しません。

