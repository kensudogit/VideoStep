# Service RegistryをRailwayにデプロイ

## デプロイ方法

Service RegistryをRailwayにデプロイする方法は2つあります：

### 方法1: Railwayダッシュボードからデプロイ（推奨）

#### ステップ1: Railwayダッシュボードを開く

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く

#### ステップ2: Service Registryサービスを確認

1. サービス一覧から「service-registry」サービスを探す
2. 存在しない場合は、新規作成する

#### ステップ3: GitHubリポジトリからデプロイ

1. プロジェクト内で「New」→「GitHub Repo」をクリック
2. VideoStepリポジトリを選択
3. サービス名を「service-registry」に設定
4. **Root Directory**: `.`（空のまま、または`.`を指定）
5. Railwayは自動的に`services/service-registry/railway.toml`を検出します
6. 「Deploy」をクリック

#### ステップ4: デプロイの進行を確認

1. 「Deployments」タブを開く
2. デプロイの進行状況を確認：
   - **「Building」** = ビルド中
   - **「Deploying」** = デプロイ中
   - **「Active」** = デプロイ完了
   - **「Failed」** = デプロイ失敗（ログを確認）

#### ステップ5: パブリックURLを生成

デプロイが完了したら：

1. 「Settings」タブを開く
2. 「Networking」セクションを開く
3. 「Generate Domain」をクリック
4. パブリックURLを確認
5. **このURLをメモしてください**（後でAPI Gatewayの環境変数で使用）

### 方法2: Railway CLIを使用（オプション）

#### ステップ1: Service Registryディレクトリに移動

```bash
cd services/service-registry
```

#### ステップ2: Railwayプロジェクトにリンク

```bash
railway link
```

プロジェクトとサービスを選択します。

#### ステップ3: デプロイ

```bash
railway up
```

## デプロイ後の確認

### 1. ログを確認

1. RailwayダッシュボードでService Registryサービスを開く
2. 「Deployments」タブで最新のデプロイメントを選択
3. ログを確認：
   - `Started EurekaServerApplication`が表示されているか
   - エラーメッセージがないか

### 2. ヘルスチェック

ブラウザで以下のURLにアクセス：

```
https://service-registry-production-xxxx.up.railway.app/actuator/health
```

正常に応答することを確認。

### 3. Eurekaダッシュボード

ブラウザで以下のURLにアクセス：

```
https://service-registry-production-xxxx.up.railway.app/
```

または

```
https://service-registry-production-xxxx.up.railway.app/eureka/
```

Eurekaダッシュボードが表示されることを確認。

## トラブルシューティング

### デプロイが失敗する場合

1. **ログを確認**
   - 「Deployments」タブで失敗したデプロイメントを選択
   - ログを確認してエラーメッセージを特定

2. **よくあるエラー**
   - ビルドエラー: コードを確認
   - メモリ不足: Railwayのプランをアップグレード
   - ポートエラー: 環境変数`PORT`を設定しない（Railwayが自動設定）

3. **再デプロイ**
   - エラーを修正した後、再デプロイを実行

### Service Registryが起動しない場合

1. **ログを確認**
   - 起動エラーのメッセージを確認

2. **設定を確認**
   - `railway.toml`が正しく設定されているか確認
   - `Dockerfile`が正しく設定されているか確認

3. **再デプロイ**
   - 設定を修正した後、再デプロイを実行

## 次のステップ

Service Registryが正常にデプロイされたら：

1. Service RegistryのパブリックURLを確認
2. API Gatewayの環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`を設定
3. 他のサービス（Video Service、Auth Serviceなど）の環境変数も設定
4. すべてのサービスを再デプロイ
5. Service RegistryのEurekaダッシュボードで、すべてのサービスが登録されていることを確認

