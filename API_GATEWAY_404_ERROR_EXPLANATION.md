# API Gateway 404エラーについて

## エラーの説明

`localhost:8080`にアクセスして、以下のエラーが表示されています：

```
Whitelabel Error Page
This application has no configured error view, so you are seeing this as a fallback.
There was an unexpected error (type=Not Found, status=404).
```

## これは正常な動作です ✅

**API Gatewayは正常に起動しています**。404エラーが表示される理由は、**ルートパス（`/`）にマッピングがない**ためです。

API Gatewayは**プロキシサーバー**であり、ルートパスには何もマッピングされていません。代わりに、特定のAPIエンドポイントがルーティングされています。

## API Gatewayの正しいエンドポイント

### ヘルスチェックエンドポイント

API Gatewayが正常に起動しているか確認するには、以下のエンドポイントにアクセスしてください：

```
http://localhost:8080/actuator/health
```

**期待される結果:**
```json
{
  "status": "UP"
}
```

### APIエンドポイント

API Gateway経由で各マイクロサービスにアクセスするには、以下のエンドポイントを使用してください：

#### Video Service

- **公開動画一覧**: `http://localhost:8080/api/videos/public`
- **動画詳細**: `http://localhost:8080/api/videos/{id}`
- **動画検索**: `http://localhost:8080/api/videos/search?keyword={keyword}`
- **カテゴリ別動画**: `http://localhost:8080/api/videos/category/{category}`
- **人気動画**: `http://localhost:8080/api/videos/recommendations/popular`
- **最新動画**: `http://localhost:8080/api/videos/recommendations/latest`

#### Auth Service

- **ログイン**: `http://localhost:8080/api/auth/login`
- **登録**: `http://localhost:8080/api/auth/register`

#### User Service

- **ユーザー情報**: `http://localhost:8080/api/users/{userId}`
- **プロフィール**: `http://localhost:8080/api/users/{userId}/profile`

#### Playlist Service

- **プレイリスト一覧**: `http://localhost:8080/api/playlists`
- **プレイリスト詳細**: `http://localhost:8080/api/playlists/{id}`
- **公開プレイリスト**: `http://localhost:8080/api/playlists/public`

#### Translation Service

- **翻訳**: `http://localhost:8080/api/translations/video/{videoId}?targetLanguage={lang}`

#### Editing Service

- **編集**: `http://localhost:8080/api/editing/{id}`

## ルーティングの仕組み

API Gatewayは以下のようにリクエストをルーティングします：

```
http://localhost:8080/api/videos/public
    ↓
API Gatewayが /api/videos/** を検出
    ↓
StripPrefix=1 により /api を削除
    ↓
Video Service (localhost:8082) に /videos/public として転送
```

## 確認方法

### 方法1: ヘルスチェックエンドポイントにアクセス

ブラウザで以下にアクセス：

```
http://localhost:8080/actuator/health
```

- ✅ **正常な場合**: `{"status":"UP"}`が返される
- ❌ **エラーの場合**: 404エラーまたは500エラーが返される

### 方法2: APIエンドポイントにアクセス

ブラウザで以下にアクセス：

```
http://localhost:8080/api/videos/public
```

- ✅ **正常な場合**: 動画一覧データ（JSON形式）が返される
- ❌ **エラーの場合**: 404エラーまたは500エラーが返される

### 方法3: Dockerログを確認

ターミナルで以下を実行：

```bash
docker logs videostep-api-gateway --tail 50
```

以下のメッセージを探してください：

**✅ 正常な起動:**
```
Started ApiGatewayApplication in X.XXX seconds
Netty started on port 8080
```

## まとめ

- ✅ **API Gatewayは正常に起動しています**
- ✅ **404エラーは正常な動作です**（ルートパスにマッピングがないため）
- ✅ **ヘルスチェックエンドポイント**: `http://localhost:8080/actuator/health`で確認できます
- ✅ **APIエンドポイント**: `/api/**` パスで各マイクロサービスにアクセスできます

## 次のステップ

1. **ヘルスチェックエンドポイントにアクセス**: `http://localhost:8080/actuator/health`
2. **APIエンドポイントを確認**: `http://localhost:8080/api/videos/public`
3. **フロントエンドからアクセス**: フロントエンドは自動的にAPI Gateway経由でアクセスします

## フロントエンドからのアクセス

フロントエンド（`npm run dev`）は、環境変数 `NEXT_PUBLIC_API_BASE_URL` で設定されたAPI GatewayのURL（デフォルト: `http://localhost:8080`）を使用して、自動的にAPI Gateway経由で各マイクロサービスにアクセスします。

**例**:
- フロントエンド: `http://localhost:3000/videos`
- APIリクエスト: `http://localhost:8080/api/videos/public`
- API Gateway: `http://localhost:8082/videos/public` (Video Service) に転送

