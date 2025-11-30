# Service Registry Actuator修正

## 問題

Service Registryが502 Bad Gatewayを返しています。原因は、`railway.toml`で`healthcheckPath = "/actuator/health"`が設定されているにもかかわらず、Service RegistryにActuatorの依存関係が含まれていないことです。

## 修正内容

### 1. build.gradleにActuator依存関係を追加

`services/service-registry/build.gradle`に以下を追加しました：

```gradle
implementation 'org.springframework.boot:spring-boot-starter-actuator'
```

### 2. application.ymlにActuator設定を追加

`services/service-registry/src/main/resources/application.yml`に以下を追加しました：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: always
```

## 次のステップ

### ステップ1: 変更をコミット・プッシュ

```bash
cd C:\devlop\VideoStep
git add services/service-registry/build.gradle services/service-registry/src/main/resources/application.yml
git commit -m "fix: Add Actuator to Service Registry for Railway health checks"
git push origin main
```

### ステップ2: RailwayでService Registryを再デプロイ

1. Railwayダッシュボードで**service-registry**サービスを開く
2. 「Deployments」タブを開く
3. 最新のデプロイメントが自動的に開始されるのを待つ（GitHub連携の場合）
4. または、「Redeploy」ボタンをクリックして手動で再デプロイ

### ステップ3: Service Registryのログを確認

1. **service-registry**サービスの「Logs」タブを開く
2. 以下のメッセージを確認：
   ```
   Started ServiceRegistryApplication
   Tomcat started on port(s): 8761
   ```

### ステップ4: ヘルスチェックを確認

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

正常な場合：`{"status":"UP"}`が返される  
エラーの場合：502 Bad Gatewayが返される

### ステップ5: Eurekaダッシュボードを確認

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app
```

正常な場合：Eurekaダッシュボードが表示される  
エラーの場合：502 Bad Gatewayが返される

### ステップ6: Video Serviceの接続を確認

Service Registryが正常に起動したら、Video ServiceがEurekaに接続できるようになります。

1. **VideoStep**サービス（Video Service）の「Logs」タブを開く
2. 以下のメッセージを確認：
   ```
   DiscoveryClient_VIDEO-SERVICE - registration status: 204
   ```
   または、エラーメッセージが消えていることを確認

## トラブルシューティング

### Actuatorエンドポイントが404を返す場合

1. `application.yml`の`management.endpoints.web.exposure.include`が正しく設定されているか確認
2. Service Registryを再デプロイ

### ヘルスチェックが502を返す場合

1. Service Registryのログを確認
2. ポート8761がリッスンしているか確認
3. Railwayのリソース制限を確認（メモリ不足の可能性）

### Video Serviceがまだ接続できない場合

1. Video Serviceの`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`が正しいURLに設定されているか確認
2. Video Serviceを再デプロイ

