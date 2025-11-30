# Service Registry 502エラー対応手順

## 現在の状況

Service RegistryのActuatorヘルスチェックエンドポイント（`/actuator/health`）が502 Bad Gatewayを返しています。

## 確認手順

### ステップ1: Service Registryのデプロイメント状態を確認

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **service-registry**サービスをクリック
4. 「Deployments」タブを開く
5. 最新のデプロイメントの状態を確認：
   - **「Building」**: ビルド中（待つ）
   - **「Deploying」**: デプロイ中（待つ）
   - **「Active」**: デプロイ完了（次のステップへ）
   - **「Failed」**: デプロイ失敗（ログを確認）

### ステップ2: Service Registryのログを確認

1. **service-registry**サービスの「Logs」タブを開く
2. 以下のメッセージを探す：

   **正常な起動メッセージ：**
   ```
   Started ServiceRegistryApplication
   Tomcat started on port(s): 8761
   ```

   **エラーメッセージ：**
   - `ERROR`
   - `Exception`
   - `Failed to start`
   - `OutOfMemoryError`
   - `Port already in use`

### ステップ3: Service Registryを手動で再デプロイ

デプロイメントが「Failed」の場合、または最新のデプロイメントが古い場合：

1. **service-registry**サービスの「Deployments」タブを開く
2. 最新のデプロイメントの「...」メニューをクリック
3. 「Redeploy」を選択
4. 再デプロイが完了するまで待つ（通常1-2分）

### ステップ4: Service Registryの環境変数を確認

1. **service-registry**サービスの「Variables」タブを開く
2. 以下の環境変数が設定されているか確認：
   - `EUREKA_INSTANCE_HOSTNAME`（設定されていない場合は削除または空にする）
   - `OPENAI_API_KEY`（必要に応じて）

### ステップ5: Service Registryのルートエンドポイントを確認

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app
```

- **正常な場合**: Eurekaダッシュボードが表示される
- **エラーの場合**: 502 Bad Gatewayが返される

### ステップ6: Actuatorヘルスチェックを再確認

Service Registryが正常に起動した後、再度以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

- **正常な場合**: `{"status":"UP"}`が返される
- **エラーの場合**: 502 Bad Gatewayが返される

## トラブルシューティング

### デプロイメントが「Failed」の場合

1. **ログを確認**してエラーメッセージを特定
2. よくある原因：
   - **メモリ不足**: Railwayのリソース制限を確認
   - **ビルドエラー**: Gradleビルドが失敗している可能性
   - **ポート競合**: ポート8761が既に使用されている可能性

### ログに「Port already in use」が表示される場合

1. Service Registryを再デプロイ
2. Railwayのリソース制限を確認

### ログに「OutOfMemoryError」が表示される場合

1. Railwayダッシュボードで「Settings」→「Resources」を確認
2. メモリ制限を増やす（可能な場合）

### Actuatorエンドポイントが404を返す場合

1. `application.yml`の`management.endpoints.web.exposure.include`が正しく設定されているか確認
2. Service Registryを再デプロイ

### 502エラーが続く場合

1. Service Registryのログを詳細に確認
2. Railwayのサポートに問い合わせ
3. Service Registryを完全に削除して再作成（最後の手段）

## 次のステップ

Service Registryが正常に起動し、Actuatorヘルスチェックが`{"status":"UP"}`を返すようになったら：

1. Video ServiceのEureka接続を確認
2. API GatewayのEureka接続を確認
3. フロントエンドからAPI Gateway経由でサービスにアクセスできることを確認

