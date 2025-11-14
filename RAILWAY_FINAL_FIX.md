# Railway 最終修正ガイド - ビルドコンテキストエラー完全解決

## 現在のエラー

```
ERROR: failed to build: failed to solve: failed to compute cache key: failed to calculate checksum of ref ...: "/services/service-registry/src": not found
```

## 問題の根本原因

RailwayでRoot Directoryを設定すると、そのディレクトリがビルドコンテキストになります。しかし、Dockerfileはルートディレクトリをビルドコンテキストとして想定しています。

**重要な点**: RailwayダッシュボードでRoot Directoryを空にしても、Railwayが以前の設定をキャッシュしている可能性があります。

## 完全な解決方法

### ステップ1: Railwayダッシュボードで設定を完全にリセット

1. **Service Registryサービスを開く**
2. **"Settings" タブを開く**
3. **"Source" セクションを確認**
4. **"Root Directory" フィールドを完全に削除**（空欄にするだけでは不十分な場合があります）
   - フィールドを選択して、すべての文字を削除
   - または、フィールドを削除して保存
5. **"Build" セクションを確認**
   - **"Dockerfile Path"**: `services/service-registry/Dockerfile` を明示的に設定
   - **"Build Context"**: `.`（ルートディレクトリ）を明示的に設定（可能な場合）
6. **"Save" をクリック**

### ステップ2: サービスを再作成（推奨）

既存のサービスで問題が解決しない場合、サービスを削除して再作成することをお勧めします。

1. **既存のService Registryサービスを削除**
2. **新しいサービスを作成**
   - "New Service" → "GitHub Repo" を選択
   - VideoStepリポジトリを選択
3. **設定を正しく行う**
   - **Root Directory**: **設定しない**（空のまま）
   - **Dockerfile Path**: `services/service-registry/Dockerfile`
   - **Build Context**: `.`（ルートディレクトリ、デフォルト）

### ステップ3: railway.tomlの確認

`services/service-registry/railway.toml` が以下のようになっていることを確認：

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/service-registry/Dockerfile"
# Root Directoryは設定しない（空）
# Build Contextはデフォルトでルートディレクトリ（.）

[deploy]
startCommand = "java -jar app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### ステップ4: 変更をコミット・プッシュ

```bash
git add services/*/railway.toml
git commit -m "Fix Railway build context - remove root directory setting"
git push
```

### ステップ5: Railwayで再デプロイ

1. **Railwayダッシュボードで再デプロイを実行**
2. **ビルドログを確認**
   - エラーが解消されていることを確認

## 代替案: Dockerfileを修正（Root Directoryに対応）

Root Directoryを `services/service-registry` に設定したまま使用する場合、Dockerfileを修正する必要があります。

### 修正後のDockerfile

```dockerfile
# Build stage
FROM gradle:8.5-jdk21 AS build
WORKDIR /workspace

# ルートディレクトリのファイルをコピー（親ディレクトリから）
COPY ../../build.gradle ../../settings.gradle ./

# サービス固有のファイルをコピー
COPY build.gradle ./services/service-registry/
COPY src ./services/service-registry/src

# Build from root, specifying the project
RUN gradle :services:service-registry:clean :services:service-registry:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/services/service-registry/build/libs/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**注意**: この方法は複雑で、Dockerfileの `COPY` コマンドで `../` を使用する必要があります。推奨されません。

## 推奨される設定（最終版）

### Railwayダッシュボード

1. **Root Directory**: **空**（設定しない、完全に削除）
2. **Dockerfile Path**: `services/service-registry/Dockerfile`
3. **Build Context**: `.`（ルートディレクトリ、デフォルト）

### railway.toml

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/service-registry/Dockerfile"
# Root Directoryは設定しない
# Build Contextはデフォルトでルートディレクトリ（.）
```

## 確認チェックリスト

- [ ] RailwayダッシュボードでRoot Directoryが完全に空（削除されている）
- [ ] Dockerfile Pathが `services/service-registry/Dockerfile` に設定されている
- [ ] railway.tomlが正しく設定されている
- [ ] 変更がコミット・プッシュされている
- [ ] Railwayで再デプロイを実行した
- [ ] ビルドログでエラーが解消されている

## トラブルシューティング

### まだエラーが発生する場合

1. **ブラウザのキャッシュをクリア**
   - Railwayダッシュボードをリロード（Ctrl+F5）

2. **サービスを完全に削除して再作成**
   - 既存のサービスを削除
   - 新しいサービスを作成
   - 正しい設定を適用

3. **Railway CLIを使用して確認**
   ```bash
   cd C:\devlop\VideoStep\services\service-registry
   railway link
   railway status
   ```

4. **ビルドログを詳細に確認**
   - どのディレクトリがビルドコンテキストとして使用されているか確認
   - Dockerfileのパスが正しいか確認

## まとめ

**最も確実な解決方法**:
1. Root Directoryを**完全に削除**（空欄ではなく、フィールド自体を削除）
2. Dockerfile Pathを `services/service-registry/Dockerfile` に明示的に設定
3. サービスを再作成（必要に応じて）

これにより、ビルドコンテキストがルートディレクトリになり、Dockerfileが想定しているパス構造と一致します。

