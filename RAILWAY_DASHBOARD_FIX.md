# Railway ダッシュボード設定完全修正ガイド

## 現在のエラー

```
ERROR: "/services/service-registry/src": not found
```

`buildContext = "."` を設定してもエラーが続いています。これは、RailwayダッシュボードでRoot Directoryがまだ設定されている可能性があります。

## 完全な解決手順（Railwayダッシュボード）

### ステップ1: Root Directoryを完全に削除

1. **Railwayダッシュボードにアクセス**
   - https://railway.app にログイン

2. **Service Registryサービスを開く**

3. **"Settings" タブを開く**

4. **"Source" セクションを確認**
   - "Root Directory" フィールドを確認
   - **フィールド内のすべての文字を削除**
   - **フィールドが完全に空であることを確認**
   - **重要**: 空欄ではなく、フィールド自体を削除する必要がある場合があります

5. **"Save" をクリック**

### ステップ2: Build Contextを明示的に設定

1. **"Build" セクションを開く**

2. **"Build Context" フィールドを確認・設定**
   - 値: `.`（ルートディレクトリ）を明示的に入力
   - または、空欄のまま（デフォルトでルートディレクトリ）

3. **"Dockerfile Path" を確認・設定**
   - 値: `services/service-registry/Dockerfile` を明示的に入力

4. **"Save" をクリック**

### ステップ3: ブラウザをリロード

1. **ブラウザのキャッシュをクリア**
   - Ctrl+Shift+Delete
   - キャッシュとCookieを削除

2. **Railwayダッシュボードをリロード**
   - Ctrl+F5（強制リロード）

3. **設定を再確認**
   - Root Directoryが空であることを確認
   - Build Contextが `.` に設定されていることを確認

### ステップ4: 再デプロイ

1. **"Deployments" タブを開く**

2. **"Redeploy" をクリック**
   - または、新しいコミットをプッシュして自動デプロイをトリガー

3. **ビルドログを確認**
   - エラーが解消されていることを確認

## サービスを再作成する場合（最も確実）

上記の手順で解決しない場合、サービスを完全に再作成することを推奨します。

### 手順

1. **既存のService Registryサービスを削除**
   - サービスを選択
   - "Settings" → 下にスクロール → "Delete Service" をクリック
   - 確認して削除

2. **新しいサービスを作成**
   - プロジェクトで "New Service" → "GitHub Repo" を選択
   - VideoStepリポジトリを選択

3. **設定を正しく行う（重要）**
   - **"Settings" タブを開く**
   - **"Source" セクション**
     - **"Root Directory"**: **何も入力しない**（完全に空、フィールドを削除）
   - **"Build" セクション**
     - **"Dockerfile Path"**: `services/service-registry/Dockerfile` を入力
     - **"Build Context"**: `.`（ルートディレクトリ）を明示的に入力
   - **"Save" をクリック**

4. **"Deploy" をクリック**

## 確認チェックリスト

サービスを再作成する前に、以下を確認してください：

- [ ] RailwayダッシュボードでRoot Directoryが完全に空（削除されている）
- [ ] Build Contextが `.` に設定されている（明示的に）
- [ ] Dockerfile Pathが `services/service-registry/Dockerfile` に設定されている
- [ ] ブラウザのキャッシュをクリアした
- [ ] Railwayダッシュボードをリロードした
- [ ] 設定を再確認した

## トラブルシューティング

### まだエラーが発生する場合

1. **サービスを完全に削除して再作成**
   - これが最も確実な方法です

2. **別のブラウザで試す**
   - Chrome、Firefox、Edgeなどで試す

3. **Railway CLIを使用**
   ```bash
   cd C:\devlop\VideoStep\services\service-registry
   railway link
   railway status
   railway variables
   ```

4. **Railwayサポートに問い合わせ**
   - Railwayの公式ドキュメントを確認
   - サポートに問い合わせる

## 重要なポイント

**最も重要な設定**:
1. **Root Directory**: **完全に空**（フィールド自体を削除）
2. **Build Context**: `.`（ルートディレクトリ、明示的に設定）
3. **Dockerfile Path**: `services/service-registry/Dockerfile`（明示的に設定）

これらの設定により、ビルドコンテキストがルートディレクトリになり、Dockerfileが想定しているパス構造と一致します。

## まとめ

**推奨される手順**:
1. サービスを完全に削除して再作成（最も確実）
2. Root Directoryを設定しない（完全に空）
3. Build Contextを `.` に明示的に設定
4. Dockerfile Pathを `services/service-registry/Dockerfile` に設定

これにより、エラーが解消されます。

