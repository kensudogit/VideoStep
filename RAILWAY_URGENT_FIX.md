# Railway 緊急修正 - ビルドコンテキストエラー完全解決

## 現在のエラー状況

ログを見ると、まだ以下のエラーが発生しています：
```
ERROR: "/services/service-registry/src": not found
```

これは、RailwayがまだRoot Directoryを `services/service-registry` として使用していることを示しています。

## 即座に実行すべき修正手順

### 方法1: Railwayダッシュボードで完全にリセット（最優先）

1. **Service Registryサービスを開く**
2. **"Settings" タブを開く**
3. **"Source" セクションを確認**
4. **"Root Directory" フィールドを完全にクリア**
   - フィールド内のすべての文字を削除
   - フィールドが完全に空であることを確認
   - **重要**: 空欄ではなく、フィールド自体を削除する必要がある場合があります
5. **"Build" セクションを確認・設定**
   - **"Dockerfile Path"**: `services/service-registry/Dockerfile` を明示的に入力
   - **"Build Context"**: `.` または空（ルートディレクトリがデフォルト）
6. **"Save" をクリック**
7. **ブラウザをリロード**（Ctrl+F5）
8. **再デプロイを実行**

### 方法2: サービスを削除して再作成（推奨）

既存のサービスで設定が正しく反映されない場合、サービスを再作成することを強く推奨します。

#### 手順

1. **既存のService Registryサービスを削除**
   - サービスを選択
   - "Settings" → "Delete Service" をクリック
   - 確認して削除

2. **新しいサービスを作成**
   - プロジェクトで "New Service" → "GitHub Repo" を選択
   - VideoStepリポジトリを選択

3. **重要な設定（絶対に守る）**
   - **"Settings" タブを開く**
   - **"Source" セクション**
     - **"Root Directory"**: **何も入力しない**（空のまま、完全に空）
   - **"Build" セクション**
     - **"Dockerfile Path"**: `services/service-registry/Dockerfile` を入力
     - **"Build Context"**: `.` または空（デフォルト）

4. **"Deploy" をクリック**

### 方法3: Railway CLIを使用（上級者向け）

```bash
cd C:\devlop\VideoStep\services\service-registry

# サービスにリンク
railway link

# 設定を確認
railway status

# Root Directoryを削除（環境変数として設定されている場合）
railway variables unset RAILWAY_ROOT_DIRECTORY

# デプロイ
railway up
```

## 確認すべきポイント

### Railwayダッシュボードでの確認

1. **Root Directoryが完全に空であること**
   - フィールドに何も表示されていない
   - `services/service-registry` などの値が表示されていない

2. **Dockerfile Pathが正しく設定されていること**
   - `services/service-registry/Dockerfile` と表示されている

3. **ビルドログでの確認**
   - ビルドログで "context: ..." が表示される
   - コンテキストがルートディレクトリであることを確認

## トラブルシューティング

### まだエラーが発生する場合

1. **ブラウザのキャッシュを完全にクリア**
   - Ctrl+Shift+Delete
   - キャッシュとCookieを削除
   - Railwayダッシュボードを再ログイン

2. **別のブラウザで試す**
   - Chrome、Firefox、Edgeなどで試す

3. **Railway CLIで確認**
   ```bash
   railway status
   railway logs
   ```

4. **サービスを完全に削除して再作成**
   - これが最も確実な方法です

## 正しい設定の最終確認

### Railwayダッシュボード

- ✅ Root Directory: **完全に空**（何も表示されていない）
- ✅ Dockerfile Path: `services/service-registry/Dockerfile`
- ✅ Build Context: `.` または空（デフォルト）

### railway.toml

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/service-registry/Dockerfile"
# Root Directoryは設定しない（完全に空）

[deploy]
startCommand = "java -jar app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## 次のステップ

1. **サービスを削除して再作成**（最も確実）
2. **正しい設定を適用**
3. **再デプロイを実行**
4. **ビルドログで確認**

## まとめ

**最も重要なポイント**:
- Root Directoryは**完全に空**にする（フィールド自体を削除）
- Dockerfile Pathは `services/service-registry/Dockerfile` を明示的に設定
- サービスを再作成することで、設定のキャッシュ問題を回避

これにより、ビルドコンテキストがルートディレクトリになり、エラーが解消されます。

