# 緊急対応: 502 Bad Gatewayエラー完全修正

## 現在の状況

ブラウザで`https://videostep-production.up.railway.app/`にアクセスすると、502 Bad Gatewayエラーが発生しています。

## 根本原因

以下の問題が連鎖的に発生しています：

1. **Service Registryが正常に起動していない**
   - 不要なEurekaクライアント設定が原因の可能性
   - Actuatorは追加済みだが、環境変数の問題で起動に失敗している可能性

2. **Video Serviceが起動していない**
   - `DATABASE_URL`環境変数が未設定

3. **API GatewayがService Registryに接続できない**
   - Service Registryが502を返しているため

## 今すぐ実行する手順

### ステップ1: Service Registryの環境変数を修正（最優先）

1. Railwayダッシュボードで**service-registry**サービスを開く
2. 「Variables」タブを開く
3. 以下の環境変数を**削除**してください：
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

4. Service Registryを再デプロイ
   - 「Deployments」タブを開く
   - 「Redeploy」ボタンをクリック

5. Service Registryのログを確認
   - 「Logs」タブを開く
   - 以下のメッセージを確認：
     ```
     Started ServiceRegistryApplication
     Tomcat started on port(s): 8761 (http)
     ```

6. Service Registryのヘルスチェックを確認
   - ブラウザで以下にアクセス：
     ```
     https://service-registry-production-6ee0.up.railway.app/actuator/health
     ```
   - 正常な場合：`{"status":"UP"}`が返される

### ステップ2: Video ServiceにDATABASE_URLを設定

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

6. Video Serviceのログを確認
   - 「Logs」タブを開く
   - 以下のメッセージを確認：
     ```
     Started VideoServiceApplication
     Tomcat started on port 8082 (http)
     ```

### ステップ3: Video ServiceのEureka環境変数を確認

1. **VideoStep**サービスの「Variables」タブを開く
2. 以下の環境変数が正しく設定されているか確認：

   ```
   EUREKA_CLIENT_ENABLED=true
   EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
   EUREKA_CLIENT_FETCH_REGISTRY=true
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
   ```

3. 設定されていない場合は追加

### ステップ4: API GatewayのEureka環境変数を確認

1. Railwayダッシュボードで**API Gateway**サービスを開く
2. 「Variables」タブを開く
3. 以下の環境変数が正しく設定されているか確認：

   ```
   EUREKA_CLIENT_ENABLED=true
   EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
   EUREKA_CLIENT_FETCH_REGISTRY=true
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
   ```

4. 設定されていない場合は追加

### ステップ5: すべてのサービスを再デプロイ

1. **Service Registry**を再デプロイ（ステップ1で完了）
2. **Video Service**を再デプロイ（ステップ2で完了）
3. **API Gateway**を再デプロイ（必要に応じて）

### ステップ6: 動作確認

1. Service RegistryのEurekaダッシュボードにアクセス：
   ```
   https://service-registry-production-6ee0.up.railway.app
   ```
   - 正常な場合：Eurekaダッシュボードが表示される
   - 「Instances currently registered with Eureka」セクションで、**VIDEO-SERVICE**が登録されていることを確認

2. フロントエンドにアクセス：
   ```
   https://videostep-production.up.railway.app
   ```
   - 正常な場合：アプリケーションが表示される
   - エラーの場合：502 Bad Gatewayが返される

## トラブルシューティング

### Service Registryがまだ502を返す場合

1. Service Registryのログを詳細に確認
2. 環境変数が正しく削除されているか確認
3. Service Registryを完全に再デプロイ

### Video ServiceがMySQL認証エラーを返す場合

1. MySQLサービスの環境変数から正しい認証情報を取得
2. Video Serviceの`DATABASE_URL`を更新
3. Video Serviceを再デプロイ

### API Gatewayがまだ502を返す場合

1. Service Registryが正常に起動しているか確認
2. Video ServiceがEurekaに登録されているか確認
3. API GatewayのEureka環境変数が正しく設定されているか確認

## 次のステップ

すべてのサービスが正常に起動したら：

1. フロントエンドからAPI Gateway経由でVideo Serviceにアクセスできることを確認
2. 他のサービス（Translation Service、Editing Service、User Service）も同様に設定
3. 本番環境での動作を確認

