# Service RegistryをRailwayにデプロイ - 実行手順

## デプロイ方法（Railwayダッシュボード推奨）

### ステップ1: Railwayダッシュボードを開く

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く

### ステップ2: Service Registryサービスを確認

1. サービス一覧から「service-registry」サービスを探す
2. **存在しない場合**は、ステップ3に進む
3. **存在する場合**は、ステップ4に進む

### ステップ3: Service Registryサービスを新規作成

1. プロジェクト内で「New」→「GitHub Repo」をクリック
2. VideoStepリポジトリを選択
3. サービス名を「service-registry」に設定
4. **Root Directory**: `.`（空のまま、または`.`を指定）
5. Railwayは自動的に`services/service-registry/railway.toml`を検出します
6. 「Deploy」をクリック

### ステップ4: Service Registryサービスを開く

1. サービス一覧から「service-registry」サービスをクリック
2. 「Deployments」タブを開く

### ステップ5: デプロイの状態を確認

1. 最新のデプロイメントの状態を確認：
   - **「Active」** = 正常にデプロイ済み
   - **「Building」** = ビルド中（待つ）
   - **「Deploying」** = デプロイ中（待つ）
   - **「Failed」** = デプロイ失敗（ログを確認）
   - **デプロイメントがない** = 新規デプロイが必要

### ステップ6: デプロイがない場合、手動でデプロイを開始

1. 「Deployments」タブで「New Deployment」ボタンを探す
2. または、「Settings」タブ→「Deploy」セクション→「Redeploy」ボタンをクリック
3. デプロイが開始されることを確認

### ステップ7: デプロイの進行を確認

1. 「Deployments」タブでデプロイの進行状況を確認
2. ログを確認：
   - ビルドが正常に完了しているか
   - エラーメッセージがないか
3. デプロイが完了するまで待つ（5-10分）

### ステップ8: ログで起動を確認

デプロイが完了したら、ログを確認：

1. 最新のデプロイメントを選択
2. ログを確認
3. 以下のメッセージが表示されていることを確認：
   ```
   Started EurekaServerApplication
   ```

### ステップ9: パブリックURLを生成

1. 「Settings」タブを開く
2. 「Networking」セクションを開く
3. 「Generate Domain」をクリック
4. パブリックURLを確認
   - 例: `https://service-registry-production-6ee0.up.railway.app`
5. **このURLをメモしてください**（後でAPI Gatewayの環境変数で使用）

### ステップ10: Service Registryの動作確認

ブラウザで以下のURLにアクセス：

#### 10.1 Eurekaダッシュボード
```
https://service-registry-production-6ee0.up.railway.app/
```
または
```
https://service-registry-production-6ee0.up.railway.app/eureka/
```

Eurekaダッシュボードが表示されることを確認。

#### 10.2 ヘルスチェック
```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

正常に応答することを確認（JSON形式のレスポンスが返ってくる）。

## 次のステップ

Service Registryが正常にデプロイされたら：

1. **API Gatewayの環境変数を設定**
   - `EUREKA_CLIENT_ENABLED=true`
   - `EUREKA_CLIENT_REGISTER_WITH_EUREKA=true`
   - `EUREKA_CLIENT_FETCH_REGISTRY=true`
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/`

2. **API Gatewayを再デプロイ**

3. **他のサービスも同様に環境変数を設定**

4. **Service RegistryのEurekaダッシュボードで、すべてのサービスが登録されていることを確認**

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

## 確認チェックリスト

- [ ] Service Registryサービスが存在する
- [ ] デプロイを開始した
- [ ] デプロイが「Active」になっている
- [ ] ログに`Started EurekaServerApplication`が表示されている
- [ ] パブリックURLを生成した
- [ ] Service RegistryのEurekaダッシュボードにアクセスできる
- [ ] ヘルスチェックエンドポイントが応答している

