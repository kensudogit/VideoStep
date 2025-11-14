# Railway Dockerfile見つからないエラー完全修正ガイド

## 現在のエラー

```
Dockerfile `Dockerfile` does not exist
```

## 問題の原因

画像を見ると、**Root Directoryに `/` が設定されています**。これにより、Railwayはルートディレクトリで `Dockerfile` という名前のファイルを探します。しかし、実際のDockerfileは `services/service-registry/Dockerfile` にあります。

## 即座に実行すべき修正

### Railwayダッシュボードでの設定

1. **Service Registryサービスを開く**

2. **"Settings" タブを開く**

3. **"Source" セクションを確認**
   - **"Root Directory" フィールドを確認**
   - **現在の値**: `/`（これが問題）
   - **修正**: フィールドを完全に空にする（すべての文字を削除）
   - **重要**: `/` を削除して、フィールドを完全に空にする

4. **"Build" セクションを開く**
   - **"Dockerfile Path" フィールドを確認**
   - **値**: `services/service-registry/Dockerfile` を明示的に入力
   - **"Build Context" フィールドを確認**
   - **値**: `.`（ルートディレクトリ）を明示的に入力、または空欄のまま

5. **"Save" をクリック**

6. **ブラウザをリロード**（Ctrl+F5）

7. **再デプロイを実行**

## 正しい設定

### Railwayダッシュボード

- **Root Directory**: **完全に空**（何も入力しない、`/` も削除）
- **Dockerfile Path**: `services/service-registry/Dockerfile`（明示的に設定）
- **Build Context**: `.`（ルートディレクトリ、明示的に設定、または空欄のまま）

### railway.toml（各サービス）

各サービスの `railway.toml` は以下のようになっている必要があります：

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/service-registry/Dockerfile"
buildContext = "."
# Root Directoryは空（設定しない）
# Build Contextを明示的にルートディレクトリ（.）に設定

[deploy]
startCommand = "java -jar app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## 確認手順

1. **Railwayダッシュボードで確認**
   - Root Directory: **完全に空**（`/` も削除）
   - Dockerfile Path: `services/service-registry/Dockerfile`
   - Build Context: `.` または空欄

2. **railway.tomlを確認**
   - `services/service-registry/railway.toml` に `dockerfilePath` と `buildContext` が設定されている

3. **変更をコミット・プッシュ**
   ```bash
   git add services/*/railway.toml railway.toml
   git commit -m "Fix Railway Dockerfile path configuration"
   git push
   ```

4. **再デプロイを実行**

5. **ビルドログで確認**
   - エラー「Dockerfile does not exist」が消える
   - ビルドが正常に開始される

## トラブルシューティング

### まだエラーが発生する場合

1. **Root Directoryを完全に削除**
   - フィールド内の `/` を削除
   - フィールドが完全に空であることを確認

2. **BuildセクションでDockerfile Pathを明示的に設定**
   - `services/service-registry/Dockerfile` を入力

3. **サービスを再作成**
   - 既存のサービスを削除
   - 新しいサービスを作成
   - 正しい設定を適用

4. **ブラウザのキャッシュをクリア**
   - Ctrl+Shift+Delete
   - キャッシュとCookieを削除
   - Railwayダッシュボードを再ログイン

## 重要なポイント

**Root Directoryに `/` が設定されていると、Railwayはルートディレクトリで `Dockerfile` を探します。**

- ❌ **間違い**: Root Directory = `/`
- ✅ **正しい**: Root Directory = **空**（完全に削除）

**Dockerfile Pathを明示的に設定する必要があります。**

- ✅ **正しい**: Dockerfile Path = `services/service-registry/Dockerfile`

## まとめ

**最も重要な修正**:
1. **Root Directory**: `/` を削除して、完全に空にする
2. **Dockerfile Path**: `services/service-registry/Dockerfile` を明示的に設定
3. **Build Context**: `.` を明示的に設定（または空欄のまま）

これにより、Railwayが正しい場所でDockerfileを見つけ、ビルドが成功します。

