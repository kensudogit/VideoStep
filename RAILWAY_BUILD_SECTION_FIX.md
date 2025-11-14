# Railway Buildセクション設定完全修正ガイド

## 現在のエラー

```
Dockerfile `Dockerfile` does not exist
```

Root Directoryを `.` に設定しても、まだエラーが発生しています。

## 問題の原因

Railwayが `Dockerfile` という名前のファイルを探していますが、実際のDockerfileは `services/service-registry/Dockerfile` にあります。

**BuildセクションでDockerfile Pathを明示的に設定する必要があります。**

## 完全な修正手順

### ステップ1: Buildセクションを開く

1. **Service Registryサービスを開く**
2. **"Settings" タブを開く**
3. **右側のサイドバーで "Build" をクリック**
   - または、メインコンテンツエリアで "Build" セクションを探す

### ステップ2: Dockerfile Pathを明示的に設定

1. **"Builder" セクションを確認**
   - "Dockerfile" が選択されていることを確認

2. **"Dockerfile Path" フィールドを確認・設定**
   - フィールドが表示されているか確認
   - 値: `services/service-registry/Dockerfile` を明示的に入力
   - **重要**: このフィールドが表示されていない場合、Railwayが自動検出を試みています

3. **"Build Context" フィールドを確認・設定**
   - 値: `.`（ルートディレクトリ）を明示的に入力
   - または、空欄のまま（デフォルトでルートディレクトリ）

### ステップ3: Root Directoryを確認

1. **"Source" セクションを確認**
2. **"Root Directory"**: `.` が設定されていることを確認

### ステップ4: 設定を保存

1. **"Save" をクリック**
2. **ブラウザをリロード**（Ctrl+F5）
3. **再デプロイを実行**

## 正しい設定（完全版）

### Railwayダッシュボード

#### Sourceセクション
- **Root Directory**: `.`（ドット1つ）

#### Buildセクション
- **Builder**: `Dockerfile`
- **Dockerfile Path**: `services/service-registry/Dockerfile`（明示的に設定）
- **Build Context**: `.`（ルートディレクトリ、明示的に設定）

### railway.toml（各サービス）

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

## Dockerfile Pathフィールドが表示されない場合

RailwayダッシュボードでDockerfile Pathフィールドが表示されない場合：

1. **railway.tomlの設定を確認**
   - `dockerfilePath = "services/service-registry/Dockerfile"` が設定されていることを確認

2. **変更をコミット・プッシュ**
   ```bash
   git add services/*/railway.toml
   git commit -m "Fix Railway Dockerfile path in railway.toml"
   git push
   ```

3. **Railwayが自動的に再デプロイ**
   - railway.tomlの設定が反映される

4. **ビルドログで確認**
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

3. **設定を正しく行う**
   - **"Settings" タブを開く**
   - **"Source" セクション**
     - **"Root Directory"**: `.` を入力
   - **"Build" セクション**
     - **"Dockerfile Path"**: `services/service-registry/Dockerfile` を入力
     - **"Build Context"**: `.` を入力

4. **"Deploy" をクリック**

## 確認チェックリスト

- [ ] Root Directory: `.` が設定されている
- [ ] BuildセクションでDockerfile Path: `services/service-registry/Dockerfile` が設定されている
- [ ] BuildセクションでBuild Context: `.` が設定されている（または空欄）
- [ ] railway.tomlに `dockerfilePath` と `buildContext` が設定されている
- [ ] 変更がコミット・プッシュされている
- [ ] Railwayで再デプロイを実行した

## トラブルシューティング

### まだエラーが発生する場合

1. **BuildセクションでDockerfile Pathを再確認**
   - 値が `services/service-registry/Dockerfile` であることを確認
   - タイプミスがないか確認

2. **railway.tomlの設定を再確認**
   - `dockerfilePath` が正しく設定されているか確認

3. **サービスを完全に再作成**
   - これが最も確実な方法です

4. **Railwayサポートに問い合わせ**
   - 公式ドキュメントを確認
   - サポートに問い合わせる

## まとめ

**最も重要なポイント**:
1. **Root Directory**: `.`（ドット1つ）
2. **Dockerfile Path**: `services/service-registry/Dockerfile`（Buildセクションで明示的に設定）
3. **Build Context**: `.`（Buildセクションで明示的に設定）

BuildセクションでDockerfile Pathを明示的に設定することで、Railwayが正しい場所でDockerfileを見つけ、ビルドが成功します。

