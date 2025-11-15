# Railway Video Service アクセス方法

## 現在の状況

`https://videostep-production.up.railway.app/` にアクセスしても、Video Serviceの画面が表示されない理由：

- **このURLはService Registry（Eureka Dashboard）のURLです**
- Video Serviceはまだデプロイされていません
- Eureka Dashboardには "No instances available" と表示されています

## 解決方法

### 方法1: Video Serviceをデプロイして公開URLを取得（推奨）

Video Serviceを個別にデプロイし、その公開URLにアクセスします。

#### ステップ1: Video Serviceをデプロイ

1. **Railwayダッシュボードで "New Service" → "GitHub Repo" を選択**
2. **VideoStepリポジトリを選択**
3. **設定**:
   - **Root Directory**: `.`
   - **Dockerfile Path**: `services/video-service/Dockerfile`
   - **Build Context**: `.`
4. **環境変数を設定**:
   ```
   SPRING_DATASOURCE_URL=${{videostep-video-db.DATABASE_URL}}
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
   ```
5. **デプロイを実行**
6. **公開URLを取得**:
   - "Settings" → "Networking" を開く
   - "Generate Domain" をクリック
   - 公開URLをコピー（例: `https://video-service-production.up.railway.app`）

#### ステップ2: Video ServiceのAPIにアクセス

Video Serviceの公開URLに直接アクセス：

```
https://video-service-production.up.railway.app/api/videos/public
```

### 方法2: API Gatewayを経由してアクセス（推奨）

API Gatewayをデプロイし、API Gateway経由でVideo Serviceにアクセスします。

#### ステップ1: API Gatewayをデプロイ

1. **Railwayダッシュボードで "New Service" → "GitHub Repo" を選択**
2. **VideoStepリポジトリを選択**
3. **設定**:
   - **Root Directory**: `.`
   - **Dockerfile Path**: `services/api-gateway/Dockerfile`
   - **Build Context**: `.`
4. **環境変数を設定**:
   ```
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
   ```
5. **デプロイを実行**
6. **公開URLを取得**:
   - "Settings" → "Networking" を開く
   - "Generate Domain" をクリック
   - 公開URLをコピー（例: `https://api-gateway-production.up.railway.app`）

#### ステップ2: API Gateway経由でVideo Serviceにアクセス

API Gatewayの公開URL経由でVideo ServiceのAPIにアクセス：

```
https://api-gateway-production.up.railway.app/api/videos/public
```

## Video Serviceの主要エンドポイント

Video Serviceがデプロイされると、以下のエンドポイントが利用可能になります：

### 公開エンドポイント（認証不要）

- **動画一覧**: `GET /api/videos/public`
- **動画詳細**: `GET /api/videos/{id}`
- **公開プレイリスト一覧**: `GET /api/playlists/public`

### 認証が必要なエンドポイント

- **動画アップロード**: `POST /api/videos`
- **動画いいね**: `POST /api/videos/{id}/like`
- **コメント投稿**: `POST /api/videos/{id}/comments`
- **プレイリスト作成**: `POST /api/playlists`

## 現在のURLの説明

### `https://videostep-production.up.railway.app/`

これは**Service Registry（Eureka Dashboard）**のURLです。

- **表示内容**: Eureka Dashboard（サービス登録状況の確認画面）
- **用途**: マイクロサービスがEurekaに登録されているか確認するための管理画面
- **Video Serviceの画面ではない**: これは管理画面であり、Video ServiceのAPIではありません

## 正しいアクセス方法

### Video ServiceのAPIにアクセスする場合

1. **Video Serviceをデプロイ**（まだの場合）
2. **Video Serviceの公開URLを取得**
3. **APIエンドポイントにアクセス**:
   ```
   https://video-service-production.up.railway.app/api/videos/public
   ```

### または、API Gateway経由でアクセス

1. **API Gatewayをデプロイ**（まだの場合）
2. **API Gatewayの公開URLを取得**
3. **API Gateway経由でアクセス**:
   ```
   https://api-gateway-production.up.railway.app/api/videos/public
   ```

## デプロイ状況の確認

### Eureka Dashboardで確認

1. **Eureka Dashboardにアクセス**
   - `https://videostep-production.up.railway.app/`

2. **"Instances currently registered with Eureka" セクションを確認**
   - Video Serviceがデプロイされていれば、`VIDEO-SERVICE` が表示される
   - 現在は "No instances available" と表示されているため、Video Serviceはまだデプロイされていない

## 次のステップ

1. **PostgreSQLデータベースを作成**
   - `videostep-video-db` を作成

2. **Video Serviceをデプロイ**
   - 上記の手順に従ってデプロイ

3. **API Gatewayをデプロイ**（推奨）
   - すべてのサービスへの統一エントリーポイントとして使用

4. **公開URLを取得**
   - Video ServiceまたはAPI Gatewayの公開URLを取得

5. **APIにアクセス**
   - 取得したURLでAPIエンドポイントにアクセス

## まとめ

**現在の状況**:
- ✅ Service Registry: 正常に起動（`https://videostep-production.up.railway.app/`）
- ❌ Video Service: まだデプロイされていない
- ❌ API Gateway: まだデプロイされていない

**解決方法**:
1. Video Serviceをデプロイして公開URLを取得
2. または、API Gatewayをデプロイして統一エントリーポイントとして使用
3. 取得したURLでAPIエンドポイントにアクセス

Service RegistryのURLは管理画面であり、Video ServiceのAPIではありません。Video Serviceの画面を表示するには、Video Serviceをデプロイする必要があります。

