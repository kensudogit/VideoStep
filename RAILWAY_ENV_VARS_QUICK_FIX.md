# Railway環境変数 クイック修正ガイド

## Service Registryの環境変数（削除）

Service RegistryはEureka Serverなので、以下の環境変数を**すべて削除**してください：

```
❌ EUREKA_CLIENT_ENABLED
❌ EUREKA_CLIENT_REGISTER_WITH_EUREKA
❌ EUREKA_CLIENT_FETCH_REGISTRY
❌ EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE
❌ DATABASE_URL
❌ SPRING_DATASOURCE_URL  ← 重要: ログで確認された不要な変数
❌ MYSQL_DATABASE
❌ MYSQL_PUBLIC_URL
❌ MYSQL_URL
❌ MYSQLDATABASE
❌ MYSQLHOST
❌ MYSQLUSER
❌ MYSQLPASSWORD
```

**削除方法**:
1. Railwayダッシュボード → `service-registry`サービス
2. 「Variables」タブ
3. 各変数の右側の「×」をクリックして削除

## API Gatewayの環境変数（設定）

API GatewayはEureka Clientなので、以下の環境変数を**設定**してください：

| 変数名 | 値 |
|--------|-----|
| `EUREKA_CLIENT_ENABLED` | `true` |
| `EUREKA_CLIENT_REGISTER_WITH_EUREKA` | `true` |
| `EUREKA_CLIENT_FETCH_REGISTRY` | `true` |
| `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` | `https://service-registry-production-6ee0.up.railway.app/eureka/` |

**設定方法**:
1. Railwayダッシュボード → `api-gateway`サービス
2. 「Variables」タブ
3. 「+ New Variable」をクリック
4. 変数名と値を入力して保存

**重要**: `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値の最後に`/eureka/`が含まれていることを確認してください。

## 環境変数設定後の手順

1. Service Registryを再デプロイ
2. API Gatewayを再デプロイ
3. ヘルスチェックで動作確認

## 確認URL

- Service Registry: `https://service-registry-production-6ee0.up.railway.app/actuator/health`
- API Gateway: `https://videostep-production.up.railway.app/actuator/health`

