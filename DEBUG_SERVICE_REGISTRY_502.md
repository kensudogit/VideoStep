# Service Registry 502エラー デバッグ手順

## リソース確認結果

スクリーンショットから、Service Registryには十分なリソースが割り当てられています：
- **CPU**: 32 vCPU（プラン上限）
- **Memory**: 32 GB（プラン上限）

**結論**: リソース不足が原因ではありません。

## 次のステップ: Service Registryのログを確認

### ステップ1: Service Registryのログを開く

1. Railwayダッシュボードで**service-registry**サービスを開く
2. 「**Logs**」タブを開く
3. ログを上から順に確認

### ステップ2: 確認すべきエラーメッセージ

以下のキーワードを含むログを探してください：

#### 起動失敗のエラー
- `ERROR`
- `Exception`
- `Failed to start`
- `Application startup failed`
- `BeanCreationException`
- `PortConflictException`

#### ポート関連のエラー
- `Port already in use`
- `Address already in use`
- `BindException`

#### メモリ関連のエラー
- `OutOfMemoryError`
- `Heap space`
- `GC overhead limit exceeded`

#### Actuator関連のエラー
- `No mapping for GET /actuator/health`
- `Actuator endpoint not found`
- `Management endpoint configuration error`

#### ビルド・デプロイ関連のエラー
- `Build failed`
- `Docker build error`
- `Gradle build error`
- `JAR file not found`

### ステップ3: 正常な起動メッセージを確認

以下のメッセージが表示されているか確認：

```
Started ServiceRegistryApplication
Tomcat started on port(s): 8761 (http)
```

### ステップ4: デプロイメント状態を確認

1. **service-registry**サービスの「Deployments」タブを開く
2. 最新のデプロイメントの状態を確認：
   - **「Active」**: デプロイ完了（ログを確認）
   - **「Building」**: ビルド中（待つ）
   - **「Deploying」**: デプロイ中（待つ）
   - **「Failed」**: デプロイ失敗（ログを確認）

## よくある問題と対処

### 問題1: デプロイメントが「Failed」になっている

**対処**:
1. ログのエラーメッセージを確認
2. エラーメッセージに基づいて対処
3. 必要に応じて再デプロイ

### 問題2: ログに「Port already in use」が表示される

**対処**:
1. Service Registryを再デプロイ
2. Railwayのリソース制限を確認

### 問題3: ログに「Application startup failed」が表示される

**対処**:
1. エラーメッセージの詳細を確認
2. よくある原因：
   - 依存関係の不足
   - 設定ファイルのエラー
   - 環境変数の不足

### 問題4: ログに正常な起動メッセージがあるが、502エラーが続く

**対処**:
1. Railwayのヘルスチェック設定を確認
2. `railway.toml`の`healthcheckPath`が正しいか確認
3. Actuatorエンドポイントが正しく公開されているか確認

## ログを共有してください

Service Registryのログを確認したら、以下の情報を共有してください：

1. **最新のエラーメッセージ**（あれば）
2. **デプロイメントの状態**（Active / Building / Deploying / Failed）
3. **正常な起動メッセージがあるか**（`Started ServiceRegistryApplication`など）

これらの情報があれば、より具体的な対処方法を提案できます。

