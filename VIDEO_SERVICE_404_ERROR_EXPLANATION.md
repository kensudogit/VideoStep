# Video Service 404エラーについて

## エラーの説明

`localhost:8082`にアクセスして、以下のエラーが表示されています：

```
Whitelabel Error Page
This application has no explicit mapping for /error, so you are seeing this as a fallback.
There was an unexpected error (type=Not Found, status=404).
```

## これは正常な動作です ✅

**Video Serviceは正常に起動しています**。404エラーが表示される理由は、**ルートパス（`/`）にマッピングがない**ためです。

Video Serviceは**マイクロサービス**であり、通常はルートパスには何もマッピングされていません。代わりに、特定のAPIエンドポイントが提供されています。

## Video Serviceの正しいエンドポイント

### ヘルスチェックエンドポイント

Video Serviceが正常に起動しているか確認するには、以下のエンドポイントにアクセスしてください：

```
http://localhost:8082/actuator/health
```

**期待される結果:**
```json
{
  "status": "UP"
}
```

### APIエンドポイント

Video ServiceのAPIエンドポイントは以下の通りです：

#### 動画関連エンドポイント

- **公開動画一覧**: `http://localhost:8082/videos/public`
- **動画詳細**: `http://localhost:8082/videos/{id}`
- **ユーザーの動画一覧**: `http://localhost:8082/videos/user/{userId}`
- **動画検索**: `http://localhost:8082/videos/search?keyword={keyword}`
- **カテゴリ別動画**: `http://localhost:8082/videos/category/{category}`

#### おすすめ動画エンドポイント

- **人気動画**: `http://localhost:8082/videos/recommendations/popular`
- **最新動画**: `http://localhost:8082/videos/recommendations/latest`
- **カテゴリ別おすすめ**: `http://localhost:8082/videos/recommendations/category/{category}`
- **関連動画**: `http://localhost:8082/videos/recommendations/related/{videoId}`

#### 動画インタラクションエンドポイント

- **いいね**: `http://localhost:8082/videos/{id}/like` (POST/GET)
- **コメント**: `http://localhost:8082/videos/{id}/comments` (POST/GET)
- **お気に入り**: `http://localhost:8082/videos/{id}/favorite` (POST/GET)
- **お気に入り一覧**: `http://localhost:8082/videos/favorites` (GET)

#### プレイリストエンドポイント

- **プレイリスト一覧**: `http://localhost:8082/playlists`
- **プレイリスト詳細**: `http://localhost:8082/playlists/{id}`
- **公開プレイリスト**: `http://localhost:8082/playlists/public`

#### 通知エンドポイント

- **通知一覧**: `http://localhost:8082/notifications`
- **未読通知**: `http://localhost:8082/notifications/unread`
- **未読数**: `http://localhost:8082/notifications/count`

#### 視聴履歴エンドポイント

- **視聴履歴**: `http://localhost:8082/videos/history`
- **視聴位置**: `http://localhost:8082/videos/history/{videoId}/position`

**注意**: これらのエンドポイントの多くは、`X-User-Id`ヘッダーが必要です。

## 確認方法

### 方法1: ヘルスチェックエンドポイントにアクセス

ブラウザで以下にアクセス：

```
http://localhost:8082/actuator/health
```

- ✅ **正常な場合**: `{"status":"UP"}`が返される
- ❌ **エラーの場合**: 404エラーまたは500エラーが返される

### 方法2: Dockerログを確認

ターミナルで以下を実行：

```bash
docker logs videostep-video-service
```

以下のメッセージを探してください：

**✅ 正常な起動:**
```
Started VideoServiceApplication in XX.XX seconds
Tomcat started on port 8082 (http) with context path ''
```

### 方法3: コントローラーのパスを確認

Video Serviceのコントローラーファイルを確認して、実際のエンドポイントパスを確認してください。

## まとめ

- ✅ **Video Serviceは正常に起動しています**
- ✅ **404エラーは正常な動作です**（ルートパスにマッピングがないため）
- ✅ **ヘルスチェックエンドポイント**: `http://localhost:8082/actuator/health`で確認できます

## 次のステップ

1. **ヘルスチェックエンドポイントにアクセス**: `http://localhost:8082/actuator/health`
2. **APIエンドポイントを確認**: コントローラーファイルを確認して、実際のエンドポイントパスを確認
3. **API Gateway経由でアクセス**: 通常、マイクロサービスにはAPI Gateway経由でアクセスします

## ローカル環境での動作確認

### Docker Composeを使用している場合

ターミナルログから、Docker Composeを使用してサービスを起動していることが確認できます：

```
✔ Container videostep-video-service        Started
```

### サービスへのアクセス方法

1. **直接アクセス**: `http://localhost:8082/actuator/health`
2. **API Gateway経由**: `http://localhost:8080/api/video-service/...`（API Gatewayが起動している場合）

## 注意事項

- Video Serviceは**マイクロサービス**であり、通常はルートパス（`/`）には何もマッピングされていません
- 404エラーが表示されることは**正常な動作**です
- 実際のAPIエンドポイントは、コントローラーの`@RequestMapping`アノテーションで定義されています

