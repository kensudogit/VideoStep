# Railway Root Directory `.` 設定ガイド

## 現在のエラー

```
Could not find root directory:
```

Root Directoryフィールドを空にした場合、Railwayがエラーを出します。

## 解決方法

Root Directoryを**空**にするのではなく、**`.`（ドット）**を設定してください。

### Railwayダッシュボードでの設定

1. **Service Registryサービスを開く**

2. **"Settings" タブを開く**

3. **"Source" セクションを確認**

4. **"Root Directory" フィールドに `.` を入力**
   - 値: `.`（ドット1つ）
   - これにより、ルートディレクトリを明示的に指定します

5. **"Build" セクションを開く**
   - **"Dockerfile Path"**: `services/service-registry/Dockerfile` を確認
   - **"Build Context"**: `.` または空欄を確認

6. **"Save" をクリック**

7. **再デプロイを実行**

## 正しい設定

### Railwayダッシュボード

- **Root Directory**: `.`（ドット1つ、ルートディレクトリを明示的に指定）
- **Dockerfile Path**: `services/service-registry/Dockerfile`（明示的に設定）
- **Build Context**: `.`（ルートディレクトリ、明示的に設定、または空欄のまま）

### railway.toml（各サービス）

各サービスの `railway.toml` は以下のようになっている必要があります：

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/service-registry/Dockerfile"
buildContext = "."
# Root Directoryは `.` に設定（Railwayダッシュボードで）
# Build Contextを明示的にルートディレクトリ（.）に設定

[deploy]
startCommand = "java -jar app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## 重要なポイント

### Root Directoryの設定

- ❌ **間違い**: Root Directory = `/`（絶対パス）
- ❌ **間違い**: Root Directory = 空（エラーが発生）
- ✅ **正しい**: Root Directory = `.`（ルートディレクトリを明示的に指定）

### なぜ `.` なのか

- `.` は現在のディレクトリ（ルートディレクトリ）を表します
- Railwayでは、Root Directoryを空にするとエラーになる場合があります
- `.` を設定することで、ルートディレクトリを明示的に指定できます

## 確認手順

1. **Railwayダッシュボードで確認**
   - Root Directory: `.`（ドット1つ）
   - Dockerfile Path: `services/service-registry/Dockerfile`
   - Build Context: `.` または空欄

2. **再デプロイを実行**

3. **ビルドログで確認**
   - エラー「Could not find root directory」が消える
   - ビルドが正常に開始される

## トラブルシューティング

### まだエラーが発生する場合

1. **Root Directoryが `.` に設定されているか確認**
   - フィールドに `.` が表示されていることを確認

2. **BuildセクションでDockerfile Pathを確認**
   - `services/service-registry/Dockerfile` が設定されていることを確認

3. **ブラウザをリロード**
   - Ctrl+F5（強制リロード）

4. **サービスを再作成**
   - 既存のサービスを削除
   - 新しいサービスを作成
   - Root Directory = `.` を設定

## まとめ

**重要なポイント**:
1. **Root Directory**: `.`（ドット1つ、ルートディレクトリを明示的に指定）
2. **Dockerfile Path**: `services/service-registry/Dockerfile`（明示的に設定）
3. **Build Context**: `.`（ルートディレクトリ、明示的に設定）

Root Directoryを `.` に設定することで、Railwayがルートディレクトリを正しく認識し、エラーが解消されます。

