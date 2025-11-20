# Railway 完全公開モード デプロイ手順

## 概要

Video ServiceをRailwayに完全公開モードでデプロイする手順です。

## 前提条件

- Railwayアカウント（https://railway.app）
- GitHubリポジトリに最新のコードがプッシュされていること
- PostgreSQLデータベースがRailwayに作成されていること

## デプロイ手順

### ステップ1: Railwayダッシュボードにアクセス

1. https://railway.app にログイン
2. VideoStepプロジェクトを開く（または新規作成）

### ステップ2: Video Serviceのデプロイ

#### 2.1 新しいサービスを作成（既に存在する場合はスキップ）

1. **"New Service" をクリック**
2. **"GitHub Repo" を選択**
3. **VideoStepリポジトリを選択**

#### 2.2 サービス設定

1. **"Settings" タブを開く**

2. **"Source" セクション**
   - **Root Directory**: `.` を設定（空欄のままでも可）

3. **"Build" セクション**
   - **Builder**: `Dockerfile` を選択
   - **Dockerfile Path**: `services/video-service/Dockerfile` を設定
   - **Build Context**: `.` を設定（ルートディレクトリ）

4. **"Deploy" セクション**
   - **Start Command**: `java -jar app.jar` を設定
   - **Healthcheck Path**: `/actuator/health` を設定

#### 2.3 環境変数の設定

1. **"Variables" タブを開く**

2. **以下の環境変数を追加**:

   ```
   SPRING_DATASOURCE_URL=${{videostep-video-db.DATABASE_URL}}
   DATABASE_URL=${{videostep-video-db.DATABASE_URL}}
   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://videostep:8761/eureka/
   ```

   **重要**:
   - `${{videostep-video-db.DATABASE_URL}}` は、作成したPostgreSQLデータベースのサービス名を使用
   - サービス名が異なる場合は、適切なサービス名に置き換えてください
   - `DATABASE_URL` も設定することで、`DatabaseEnvironmentPostProcessor`が正しく認証情報を抽出できます

3. **"Save" をクリック**

#### 2.4 デプロイの実行

1. **"Deployments" タブを開く**
2. **"Redeploy" をクリック**（既にデプロイされている場合）
   - または、GitHubにプッシュすると自動的にデプロイが開始されます
3. **ビルドログを確認**
   - エラーがないか確認
   - ビルドが成功することを確認
   - データベース接続が成功することを確認

### ステップ3: 完全公開モードの設定（公開URLの生成）

1. **"Settings" タブを開く**

2. **"Networking" セクションに移動**

3. **"Generate Domain" をクリック**
   - これにより、公開URLが生成されます
   - 例: `https://video-service-production.up.railway.app`

4. **公開URLをコピー**
   - 後で使用するため、URLを保存してください

5. **"Public Networking" が有効になっていることを確認**
   - デフォルトで有効になっているはずです

### ステップ4: デプロイの確認

#### 4.1 Health Check

以下のURLにアクセスして、サービスが正常に動作していることを確認：

```
https://<your-video-service-url>/actuator/health
```

正常な場合、以下のようなJSONが返されます：

```json
{
  "status": "UP"
}
```

#### 4.2 API エンドポイントの確認

以下のURLにアクセスして、APIが正常に動作していることを確認：

```
https://<your-video-service-url>/api/videos/public
```

#### 4.3 ログの確認

1. **"Deployments" タブを開く**
2. **最新のデプロイメントをクリック**
3. **"Logs" タブを開く**
4. **以下のログが表示されることを確認**:
   - `DatabaseEnvironmentPostProcessor: Using SPRING_DATASOURCE_URL from environment variable`
   - `DatabaseEnvironmentPostProcessor: Credentials extracted from DATABASE_URL`（認証情報が抽出された場合）
   - `Started VideoServiceApplication`（アプリケーションが正常に起動した場合）
   - データベース接続エラーがないことを確認

## トラブルシューティング

### データベース接続エラーが発生する場合

1. **環境変数を確認**
   - `SPRING_DATASOURCE_URL` と `DATABASE_URL` の両方が設定されているか確認
   - データベースサービス名が正しいか確認

2. **ログを確認**
   - `DatabaseEnvironmentPostProcessor` のログを確認
   - 認証情報が正しく抽出されているか確認

3. **データベースが作成されているか確認**
   - Railwayダッシュボードでデータベースサービスが存在するか確認
   - データベースの接続情報が正しいか確認

### ビルドエラーが発生する場合

1. **Dockerfileのパスを確認**
   - `services/video-service/Dockerfile` が正しいか確認

2. **Build Contextを確認**
   - Build Contextが `.`（ルートディレクトリ）に設定されているか確認

3. **ビルドログを確認**
   - エラーメッセージを確認
   - 依存関係の問題がないか確認

### 公開URLにアクセスできない場合

1. **"Networking" 設定を確認**
   - "Generate Domain" が実行されているか確認
   - "Public Networking" が有効になっているか確認

2. **デプロイが完了しているか確認**
   - デプロイが正常に完了しているか確認
   - サービスが起動しているか確認

3. **Health Checkを確認**
   - `/actuator/health` エンドポイントが正常に動作しているか確認

## チェックリスト

- [ ] PostgreSQLデータベースが作成されている
- [ ] Video ServiceがRailwayにデプロイされている
- [ ] 環境変数が正しく設定されている（`SPRING_DATASOURCE_URL` と `DATABASE_URL`）
- [ ] デプロイが正常に完了している
- [ ] 公開URLが生成されている
- [ ] Health Checkが正常である
- [ ] APIエンドポイントが正常に動作している
- [ ] ログにエラーがない

## 次のステップ

1. **API Gatewayの設定**
   - API Gatewayの環境変数に、Video Serviceの公開URLを設定
   - または、Eurekaサービスレジストリを使用してサービスを発見

2. **フロントエンドの設定**
   - Vercelダッシュボードで `NEXT_PUBLIC_API_BASE_URL` を設定
   - API Gatewayの公開URLを設定

3. **その他のサービスのデプロイ**
   - 必要に応じて、他のサービスも同様の手順でデプロイ

