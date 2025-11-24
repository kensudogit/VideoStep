# Mockサンプル動画データの有効化

## 概要
このドキュメントでは、mockサンプル動画データを利用できるようにする方法を説明します。

## 現在の状態
- `mockData.ts`には20個のサンプル動画データが定義されています
- `api.ts`では、デフォルトでmockデータを使用する設定になっています
- 環境変数`NEXT_PUBLIC_USE_MOCK_DATA=true`を設定することで、確実にmockデータを使用できます

## 設定方法

### 方法1: 環境変数ファイルを作成（推奨）

プロジェクトルート（`frontend`ディレクトリ）に`.env.local`ファイルを作成し、以下の内容を追加してください：

```env
# Mock Data Configuration
# この環境変数を true に設定すると、常にmockサンプル動画データを使用します
NEXT_PUBLIC_USE_MOCK_DATA=true

# API Base URL (mockデータを使用する場合は設定不要)
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 方法2: 開発サーバー起動時に環境変数を設定

Windows (CMD):
```cmd
set NEXT_PUBLIC_USE_MOCK_DATA=true && npm run dev
```

Windows (PowerShell):
```powershell
$env:NEXT_PUBLIC_USE_MOCK_DATA="true"; npm run dev
```

Linux/Mac:
```bash
NEXT_PUBLIC_USE_MOCK_DATA=true npm run dev
```

### 方法3: package.jsonのスクリプトを修正

`package.json`の`dev`スクリプトを以下のように変更：

```json
{
  "scripts": {
    "dev": "cross-env NEXT_PUBLIC_USE_MOCK_DATA=true next dev"
  }
}
```

`cross-env`パッケージをインストールする必要があります：
```bash
npm install --save-dev cross-env
```

## 動作確認

1. 開発サーバーを起動：
   ```bash
   npm run dev
   ```

2. ブラウザで `http://localhost:3000` にアクセス

3. ブラウザの開発者ツール（F12）のコンソールを開く

4. 以下のようなログが表示されれば、mockデータが使用されています：
   ```
   [Mock Data] NEXT_PUBLIC_USE_MOCK_DATA=true が設定されています。mockデータを使用します。
   [Mock Data] Using mock data for endpoint: /api/videos/public
   ```

## 利用可能なMockデータ

### 動画データ
- 20個のサンプル動画（製造業、教育、安全、環境などのカテゴリ）
- 各動画には以下の情報が含まれます：
  - タイトル、説明、カテゴリ、タグ
  - 視聴回数、いいね数、再生時間
  - 動画URL（サンプル動画URL）
  - サムネイルURL

### ユーザーデータ
- 5人のサンプルユーザー

### コメントデータ
- 各動画に対するコメント（一部の動画のみ）

## Mockデータのエンドポイント対応

以下のエンドポイントがmockデータで動作します：

- `GET /api/videos/public` - 公開動画一覧（ページネーション対応）
- `GET /api/videos/category/{category}` - カテゴリ別動画一覧
- `GET /api/videos/search?keyword={keyword}` - キーワード検索
- `GET /api/videos/{id}` - 動画詳細
- `GET /api/videos/{id}/comments` - コメント一覧
- `GET /api/videos/recommendations` - おすすめ動画
- `GET /api/videos/recommendations/related/{id}` - 関連動画

## トラブルシューティング

### Mockデータが表示されない場合

1. **環境変数が正しく設定されているか確認**
   - `.env.local`ファイルが`frontend`ディレクトリに存在するか
   - 環境変数の値が`true`（文字列）であるか

2. **開発サーバーを再起動**
   - 環境変数を変更した場合は、開発サーバーを再起動する必要があります

3. **ブラウザのキャッシュをクリア**
   - Ctrl+Shift+Delete でキャッシュをクリア
   - ハードリロード（Ctrl+F5）

4. **コンソールログを確認**
   - ブラウザの開発者ツールで`[Mock Data]`で始まるログを確認

## 注意事項

- Mockデータは開発・デモ目的で使用します
- 本番環境で実際のAPIを使用する場合は、`NEXT_PUBLIC_USE_MOCK_DATA`を`false`に設定するか、環境変数を削除してください
- Mockデータの動画URLは外部のサンプル動画サービスを使用しています。インターネット接続が必要です

