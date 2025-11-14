# Railway サービスアクセスURLガイド

## Service Registryの起動確認

ログから、Service Registryが正常に起動していることが確認できました：
- Spring Boot 3.2.0
- Java 21.0.9
- Tomcat on port 8761
- Eureka Server started

## RailwayでのアクセスURL取得方法

### 方法1: Railwayダッシュボードで確認

1. **Railwayダッシュボードにアクセス**
   - https://railway.app にログイン

2. **Service Registryサービスを開く**

3. **"Settings" タブを開く**

4. **"Networking" セクションを開く**
   - 右側のサイドバーで "Networking" をクリック

5. **公開URLを確認**
   - "Generate Domain" ボタンがある場合、クリックしてドメインを生成
   - または、既に生成されているドメインを確認
   - 例: `https://service-registry-production.up.railway.app`

### 方法2: Railway CLIで確認

```bash
cd C:\devlop\VideoStep\services\service-registry
railway link
railway status
railway domain
```

## Service RegistryのアクセスURL

### Eureka Dashboard

Service Registryの公開URLが取得できたら、以下のURLでアクセスできます：

```
https://<your-service-registry-url>/eureka
```

または、Eureka Dashboard:

```
https://<your-service-registry-url>/
```

### Health Check

```
https://<your-service-registry-url>/actuator/health
```

### Actuator Endpoints

```
https://<your-service-registry-url>/actuator
```

## 例

もしService Registryの公開URLが `https://service-registry-production.up.railway.app` の場合：

- **Eureka Dashboard**: `https://service-registry-production.up.railway.app/`
- **Health Check**: `https://service-registry-production.up.railway.app/actuator/health`
- **Actuator**: `https://service-registry-production.up.railway.app/actuator`

## 公開URLがまだ生成されていない場合

1. **Railwayダッシュボードでサービスを開く**
2. **"Settings" → "Networking" を開く**
3. **"Generate Domain" ボタンをクリック**
4. **生成されたURLをコピー**

## 次のステップ

Service RegistryのURLを取得したら：

1. **Eureka Dashboardにアクセス**
   - サービスが登録されているか確認

2. **他のサービスをデプロイ**
   - Auth Service
   - Video Service
   - API Gateway
   - など

3. **各サービスの公開URLを取得**
   - 同様の手順で各サービスの公開URLを取得

4. **フロントエンドの環境変数を更新**
   - API GatewayのURLを `NEXT_PUBLIC_API_BASE_URL` に設定

## トラブルシューティング

### URLにアクセスできない場合

1. **公開URLが生成されているか確認**
   - Railwayダッシュボードで確認

2. **ポートが正しく設定されているか確認**
   - Service Registryはポート8761を使用

3. **ネットワーク設定を確認**
   - Railwayダッシュボードで "Networking" セクションを確認

4. **ログを確認**
   - サービスが正常に起動しているか確認

## まとめ

**Service RegistryのアクセスURL**:
1. Railwayダッシュボードで "Settings" → "Networking" を開く
2. "Generate Domain" をクリック（まだ生成されていない場合）
3. 生成されたURLをコピー
4. `https://<your-url>/` でEureka Dashboardにアクセス

