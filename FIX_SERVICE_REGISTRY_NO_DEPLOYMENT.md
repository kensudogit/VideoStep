# Service Registry デプロイメントなし - 緊急対応

## 問題

Service Registryにアクティブなデプロイメントがありません。

画面に表示されているメッセージ：
```
There is no active deployment for this service.
```

## 原因

Service Registryがデプロイされていない、またはデプロイが失敗している可能性があります。

これが502 Bad Gatewayエラーの根本原因です。API GatewayがService Registryに接続しようとしても、Service Registryが起動していないため、502エラーが発生しています。

## 対応手順

### ステップ1: デプロイを開始

1. Service Registryサービスの画面で「Make a deployment to get started →」をクリック
2. または、「Deployments」タブで「New Deployment」ボタンを探す

### ステップ2: GitHubリポジトリからデプロイ

1. Railwayダッシュボードで「VideoStep」プロジェクトを開く
2. 「New」→「GitHub Repo」をクリック
3. VideoStepリポジトリを選択
4. サービス名を「service-registry」に設定
5. **Root Directory**: `.`（空のまま、または`.`を指定）
6. Railwayは自動的に`services/service-registry/railway.toml`を検出します
7. 「Deploy」をクリック

### ステップ3: デプロイの進行を確認

1. 「Deployments」タブを開く
2. デプロイの進行状況を確認：
   - **「Building」** = ビルド中
   - **「Deploying」** = デプロイ中
   - **「Active」** = デプロイ完了
   - **「Failed」** = デプロイ失敗（ログを確認）

### ステップ4: ログを確認

1. デプロイ中にログを確認
2. 以下のメッセージが表示されることを確認：
   ```
   Started EurekaServerApplication
   ```
3. エラーメッセージがないか確認

### ステップ5: パブリックURLを生成

デプロイが完了したら：

1. 「Settings」タブを開く
2. 「Networking」セクションを開く
3. 「Generate Domain」をクリック
4. パブリックURLを確認
5. **このURLをメモしてください**（後でAPI Gatewayの環境変数で使用）

### ステップ6: Service Registryの動作確認

ブラウザで以下のURLにアクセス：

```
https://service-registry-production-xxxx.up.railway.app/
```

または

```
https://service-registry-production-xxxx.up.railway.app/eureka/
```

Eurekaダッシュボードが表示されることを確認。

### ステップ7: API Gatewayの環境変数を設定

Service Registryが正常に起動したら、API Gatewayの環境変数を設定：

1. API Gatewayサービス（`videostep-production`など）を開く
2. 「Variables」タブを開く
3. 以下の環境変数を設定：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-xxxx.up.railway.app/eureka/
```

**重要**: `service-registry-production-xxxx`の部分は、ステップ5で確認した実際のService RegistryのパブリックURLに置き換えてください。

### ステップ8: API Gatewayを再デプロイ

環境変数を設定した後、API Gatewayを再デプロイ：

1. 「Settings」タブを開く
2. 「Deploy」セクションを開く
3. 「Redeploy」ボタンをクリック
4. デプロイが完了するまで待つ

### ステップ9: 確認

1. Service RegistryのEurekaダッシュボードにアクセス
2. API Gatewayが登録されているか確認
3. API Gatewayのヘルスチェックエンドポイントにアクセス：
   ```
   https://videostep-production.up.railway.app/actuator/health
   ```
4. 正常に応答することを確認
5. メインURLにアクセス：
   ```
   https://videostep-production.up.railway.app/
   ```
6. 502エラーが解消されていることを確認

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

- [ ] Service Registryのデプロイを開始した
- [ ] デプロイが「Active」になっている
- [ ] ログに`Started EurekaServerApplication`が表示されている
- [ ] パブリックURLを生成した
- [ ] Service RegistryのEurekaダッシュボードにアクセスできる
- [ ] API Gatewayの環境変数を設定した
- [ ] API Gatewayを再デプロイした
- [ ] Service RegistryのEurekaダッシュボードでAPI Gatewayが登録されている
- [ ] API Gatewayのヘルスチェックエンドポイントが応答している
- [ ] メインURLで502エラーが解消された

## 重要な注意事項

⚠️ **Service Registryが起動していないことが502エラーの根本原因です**

Service Registryをデプロイしない限り、502エラーは解決しません。

⚠️ **デプロイが完了するまで待ってください**

デプロイが完了するまで5-10分かかります。「Active」と表示されるまで待ってください。

⚠️ **パブリックURLを必ず生成してください**

Service RegistryのパブリックURLを生成しないと、API Gatewayが接続できません。

## 次のステップ

1. Service Registryのデプロイを開始
2. デプロイが完了するまで待つ
3. パブリックURLを生成
4. API Gatewayの環境変数を設定
5. API Gatewayを再デプロイ
6. 動作確認

