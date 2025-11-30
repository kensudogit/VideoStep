# Video Serviceサービスを表示する方法

## 現在の状況

RailwayダッシュボードにVideo Serviceサービスが表示されない場合、以下の可能性があります：

1. **Video Serviceがまだデプロイされていない**
2. **サービス名が異なる**（例：`VideoStep`という名前で表示されている）
3. **別のプロジェクトにデプロイされている**

## 確認方法

### 方法1: VideoStepサービスを確認

スクリーンショットを見ると、**`VideoStep`**というサービスが表示されています。これがVideo Serviceの可能性があります。

1. **`VideoStep`**カードをクリック
2. サービス詳細ページを開く
3. 「Variables」タブを開く
4. これがVideo Serviceかどうか確認

**注意**: `VideoStep`がフロントエンドサービスの場合、Video Serviceは別のサービスとして存在する必要があります。

### 方法2: サービス一覧を確認

1. Railwayダッシュボードで、プロジェクトのサービス一覧を確認
2. 以下のような名前のサービスを探す：
   - `video-service`
   - `Video Service`
   - `video`
   - `VideoStep`（フロントエンドの可能性）

### 方法3: すべてのサービスを確認

1. Railwayダッシュボードで、プロジェクトのすべてのサービスを表示
2. 各サービスをクリックして、Video Serviceかどうか確認
3. 「Settings」タブで「Root Directory」を確認
4. `services/video-service`が設定されているサービスがVideo Serviceです

## Video Serviceが存在しない場合

Video Serviceがまだデプロイされていない場合は、デプロイする必要があります。

### デプロイ方法（Railwayダッシュボード）

1. **新しいサービスを作成**
   - Railwayダッシュボードで「+ New」をクリック
   - 「GitHub Repo」を選択
   - リポジトリを選択

2. **サービス名を設定**
   - サービス名を`video-service`に設定

3. **ルートディレクトリを設定**
   - 「Settings」→「Source」を開く
   - 「Root Directory」を`services/video-service`に設定

4. **デプロイを開始**
   - 自動的にデプロイが開始されます
   - または「Deployments」タブで「Deploy」をクリック

### デプロイ方法（Railway CLI）

1. **Railway CLIをインストール**（まだの場合）
   ```bash
   npm install -g @railway/cli
   ```

2. **Railwayにログイン**
   ```bash
   railway login
   ```

3. **プロジェクトを選択**
   ```bash
   cd C:\devlop\VideoStep
   railway link
   ```

4. **Video Serviceをデプロイ**
   ```bash
   railway up --service video-service
   ```

## Video Serviceの確認方法

Video Serviceがデプロイされているかどうかを確認する方法：

### 1. サービス一覧で確認

1. Railwayダッシュボードで、プロジェクトのサービス一覧を確認
2. `video-service`という名前のサービスを探す

### 2. ログで確認

1. 各サービスをクリック
2. 「Logs」タブを開く
3. `VideoServiceApplication`という文字列を検索
4. 見つかったサービスがVideo Serviceです

### 3. 設定ファイルで確認

1. 各サービスをクリック
2. 「Settings」タブを開く
3. 「Root Directory」を確認
4. `services/video-service`が設定されているサービスがVideo Serviceです

## VideoStepサービスがVideo Serviceの場合

`VideoStep`サービスがVideo Serviceの場合：

1. **`VideoStep`カードをクリック**
2. サービス詳細ページを開く
3. 「Variables」タブを開く
4. データベース接続とEureka接続の環境変数を設定

## 次のステップ

Video Serviceが見つかったら：

1. Video Serviceサービスを開く
2. 「Variables」タブを開く
3. データベース接続とEureka接続の環境変数を設定
4. 詳細は`VIDEO_SERVICE_SETUP_STEPS.md`を参照

Video Serviceが見つからない場合は、上記のデプロイ方法を参照してデプロイしてください。
