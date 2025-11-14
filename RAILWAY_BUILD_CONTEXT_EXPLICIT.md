# Railway ビルドコンテキスト明示的設定ガイド

## 問題

フォルダは存在するのに、以下のエラーが発生：
```
ERROR: "/services/service-registry/src": not found
```

## 原因

RailwayでRoot Directoryを設定すると、そのディレクトリが**ビルドコンテキスト**になります。しかし、Dockerfileは**ルートディレクトリ**をビルドコンテキストとして想定しているため、パスが一致しません。

### 具体例

- **Root Directory**: `services/service-registry` に設定
- **ビルドコンテキスト**: `services/service-registry/`（自動的に設定される）
- **Dockerfileの想定**: ルートディレクトリ（`/`）をビルドコンテキストとして想定
- **Dockerfileのコマンド**: `COPY services/service-registry/src ./services/service-registry/src`
- **問題**: ビルドコンテキストが `services/service-registry/` の場合、`services/service-registry/src` というパスは存在しない（`src` が直接存在する）

## 解決方法

### 方法1: railway.tomlでBuild Contextを明示的に設定（推奨）

`railway.toml` に `buildContext = "."` を追加することで、ビルドコンテキストをルートディレクトリに明示的に設定できます。

#### 修正後のrailway.toml

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

### 方法2: RailwayダッシュボードでBuild Contextを設定

1. **Service Registryサービスを開く**
2. **"Settings" タブを開く**
3. **"Build" セクションを開く**
4. **"Build Context" フィールドを確認・設定**
   - 値: `.`（ルートディレクトリ）
   - または、空欄のまま（デフォルトでルートディレクトリ）
5. **"Root Directory" を空にする**（完全に削除）
6. **"Dockerfile Path"**: `services/service-registry/Dockerfile`
7. **"Save" をクリック**

### 方法3: Root Directoryを空にして、Build Contextを明示的に設定

1. **Root Directory**: **完全に空**（設定しない）
2. **Build Context**: `.`（ルートディレクトリ、明示的に設定）
3. **Dockerfile Path**: `services/service-registry/Dockerfile`

## 各サービスのrailway.toml設定

すべてのサービスで、`buildContext = "."` を追加しました：

- ✅ `services/service-registry/railway.toml`
- ✅ `services/auth-service/railway.toml`
- ✅ `services/video-service/railway.toml`
- ✅ `services/api-gateway/railway.toml`

## 確認手順

1. **railway.tomlを確認**
   - `buildContext = "."` が設定されていることを確認

2. **変更をコミット・プッシュ**
   ```bash
   git add services/*/railway.toml
   git commit -m "Add explicit buildContext to railway.toml"
   git push
   ```

3. **Railwayダッシュボードで確認**
   - Root Directory: **空**（設定しない）
   - Build Context: `.`（ルートディレクトリ）
   - Dockerfile Path: `services/service-registry/Dockerfile`

4. **再デプロイを実行**

5. **ビルドログで確認**
   - エラー「/services/service-registry/src: not found」が消える
   - ビルドが正常に進行する

## トラブルシューティング

### まだエラーが発生する場合

1. **railway.tomlが正しくコミット・プッシュされているか確認**
   ```bash
   git status
   git log --oneline -5
   ```

2. **Railwayダッシュボードで設定を再確認**
   - Build Contextが `.` に設定されているか確認
   - Root Directoryが空であることを確認

3. **サービスを再作成**
   - 既存のサービスを削除
   - 新しいサービスを作成
   - 正しい設定を適用

4. **ビルドログを詳細に確認**
   - どのディレクトリがビルドコンテキストとして使用されているか確認
   - `context: ...` のメッセージを確認

## まとめ

**重要なポイント**:
1. **Root Directory**: 空（設定しない）
2. **Build Context**: `.`（ルートディレクトリ、明示的に設定）
3. **Dockerfile Path**: `services/service-registry/Dockerfile`（ルートからの相対パス）

`buildContext = "."` を明示的に設定することで、Railwayがルートディレクトリをビルドコンテキストとして使用し、Dockerfileが想定しているパス構造と一致します。

