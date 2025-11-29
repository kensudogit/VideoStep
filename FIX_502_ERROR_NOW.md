# 502 Bad Gateway エラー - 緊急対応

## 問題

```
GET https://videostep-production.up.railway.app/ 502 (Bad Gateway)
```

## 原因

API Gatewayの`application.yml`でEurekaのデフォルトURLが`http://localhost:8761/eureka/`になっているため、RailwayでService Registryに接続できていません。

## 対応

### ✅ 修正完了

API Gatewayの`application.yml`を修正しました：

```yaml
eureka:
  client:
    enabled: ${EUREKA_CLIENT_ENABLED:false}
    service-url:
      defaultZone: ${EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE:https://service-registry-production-6ee0.up.railway.app/eureka/}
    register-with-eureka: ${EUREKA_CLIENT_REGISTER_WITH_EUREKA:false}
    fetch-registry: ${EUREKA_CLIENT_FETCH_REGISTRY:false}
```

### 次のステップ

1. **変更をコミットしてプッシュ**

```bash
git add services/api-gateway/src/main/resources/application.yml
git commit -m "Fix API Gateway Eureka configuration for Railway"
git push origin main
```

2. **Railwayダッシュボードで環境変数を設定**

API Gatewayサービス（`videostep-production`または`api-gateway`）で以下の環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

**重要**: `service-registry-production-6ee0`の部分は、実際のService RegistryのパブリックURLに置き換えてください。

3. **再デプロイ**

Railwayダッシュボードで：
- API Gatewayサービスを開く
- 「Settings」→「Deploy」で「Redeploy」をクリック
- または、GitHubへのプッシュで自動的に再デプロイされます

4. **確認**

- デプロイが完了するまで待つ（数分）
- 以下のURLにアクセスして確認：
  - `https://videostep-production.up.railway.app/actuator/health`
  - `https://videostep-production.up.railway.app/api/videos/public`

## トラブルシューティング

### まだ502エラーが発生する場合

1. **Service Registryが正常に動作しているか確認**
   ```
   https://service-registry-production-6ee0.up.railway.app
   ```

2. **API Gatewayのログを確認**
   - RailwayダッシュボードでAPI Gatewayサービスを開く
   - 「Deployments」タブでログを確認
   - Eureka接続エラーがないか確認

3. **環境変数が正しく設定されているか確認**
   - Railwayダッシュボードで「Variables」タブを確認
   - すべての環境変数が設定されているか確認

4. **Service RegistryでAPI Gatewayが登録されているか確認**
   - Service RegistryのEurekaダッシュボードで確認
   - `api-gateway`サービスが表示されているか確認

### Service RegistryのURLが異なる場合

Service Registryの実際のパブリックURLを確認：

1. RailwayダッシュボードでService Registryサービスを開く
2. 「Settings」→「Networking」でパブリックURLを確認
3. そのURLを環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`に設定

## 確認チェックリスト

- [ ] コードをGitHubにプッシュ済み
- [ ] RailwayでAPI Gatewayが再デプロイ済み
- [ ] 環境変数が正しく設定されている
- [ ] Service Registryが正常に動作している
- [ ] API GatewayがService Registryに接続できている
- [ ] ヘルスチェックエンドポイントが応答している

