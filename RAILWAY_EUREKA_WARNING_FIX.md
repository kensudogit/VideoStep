# Railway Eureka警告対応ガイド

## 現在の状況

Eureka Dashboardは正常に表示されていますが、以下の警告が表示されています：

```
EMERGENCY! EUREKA MAY BE INCORRECTLY CLAIMING INSTANCES ARE UP WHEN THEY'RE NOT. 
RENEWALS ARE LESSER THAN THRESHOLD AND HENCE THE INSTANCES ARE NOT BEING EXPIRED 
JUST TO BE SAFE.
```

また、**"No instances available"** と表示されています。

## 原因

この警告は、**他のサービス（Auth Service、Video Service、API Gatewayなど）がまだEurekaに登録されていない**ために表示されています。

- **Renews (last min): 0** - 他のサービスからの更新がない
- **Instances currently registered with Eureka: No instances available** - 登録されているインスタンスがない

## 解決方法

### ステップ1: 他のサービスをデプロイ

Service Registryは正常に動作しています。次に、他のサービスをデプロイする必要があります。

#### デプロイ順序

1. **Service Registry** ✅（完了）
2. **PostgreSQLデータベース**（各サービス用）
3. **Auth Service**
4. **Video Service**
5. **API Gateway**
6. **その他のサービス**

### ステップ2: Eureka Client設定の確認

他のサービスをデプロイする際、Eureka Clientの設定で**プライベートネットワーク名**を使用する必要があります。

#### Railwayプライベートネットワーク

画像から、Service Registryのプライベートネットワーク名は：
- **プライベートドメイン**: `videostep.railway.internal`
- **または、単に**: `videostep`

#### 環境変数の設定

各サービス（Auth Service、Video Service、API Gatewayなど）の環境変数で、以下のように設定：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
```

または：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep.railway.internal:8761/eureka/
```

**重要**: Railwayでは、サービス間通信にはプライベートネットワーク名を使用します。`service-registry` ではなく、実際のサービス名（この場合は `videostep`）を使用します。

### ステップ3: 各サービスのデプロイ

#### Auth Serviceのデプロイ

1. **Railwayダッシュボードで新しいサービスを作成**
   - "New Service" → "GitHub Repo" を選択
   - VideoStepリポジトリを選択

2. **設定**
   - **Root Directory**: `.`
   - **Dockerfile Path**: `services/auth-service/Dockerfile`
   - **Build Context**: `.`

3. **環境変数を設定**
   ```
   SPRING_DATASOURCE_URL=${{videostep-auth-db.DATABASE_URL}}
   JWT_SECRET=your-production-jwt-secret-key-here-change-this
   JWT_EXPIRATION=86400000
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
   ```

4. **PostgreSQLデータベースを作成**
   - "New Service" → "Database" → "Add PostgreSQL"
   - サービス名: `videostep-auth-db`

5. **デプロイ**

#### Video Serviceのデプロイ

同様の手順で、以下の環境変数を設定：

```
SPRING_DATASOURCE_URL=${{videostep-video-db.DATABASE_URL}}
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
```

#### API Gatewayのデプロイ

同様の手順で、以下の環境変数を設定：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
```

## 警告メッセージについて

この警告メッセージは、**他のサービスが登録されていない間は正常に表示されます**。以下のサービスをデプロイすると、警告は消えます：

1. Auth Service
2. Video Service
3. API Gateway
4. その他のサービス

## 確認方法

各サービスをデプロイした後：

1. **Eureka Dashboardをリロード**
   - `https://videostep-production.up.railway.app/`

2. **"Instances currently registered with Eureka" セクションを確認**
   - デプロイしたサービスが表示されることを確認

3. **警告メッセージが消えることを確認**
   - サービスが登録されると、警告は自動的に消えます

## トラブルシューティング

### サービスがEurekaに登録されない場合

1. **環境変数を確認**
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` が正しく設定されているか確認
   - プライベートネットワーク名（`videostep`）を使用しているか確認

2. **サービス名を確認**
   - RailwayダッシュボードでService Registryのプライベートネットワーク名を確認
   - その名前を使用して環境変数を設定

3. **ログを確認**
   - 各サービスのログで、Eurekaへの接続エラーがないか確認

## まとめ

**現在の状況**:
- ✅ Service Registryは正常に起動
- ⚠️ 他のサービスがまだ登録されていない（警告が表示される）

**次のステップ**:
1. PostgreSQLデータベースを作成
2. Auth Serviceをデプロイ
3. Video Serviceをデプロイ
4. API Gatewayをデプロイ
5. Eureka Dashboardでサービスが登録されていることを確認

サービスをデプロイすると、警告は自動的に消え、Eureka Dashboardにサービスが表示されます。

