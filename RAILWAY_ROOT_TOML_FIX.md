# Railway ルートrailway.toml修正ガイド

## 問題

ルートディレクトリの `railway.toml` に以下の問題があります：

1. **`buildContext` が設定されていない**
2. **`startCommand = "docker-compose up -d"` が間違っている**（これはDocker Compose用で、個別のサービスには適していない）
3. **Service Registry用の設定になっている**（ルートディレクトリには全体的な設定を置くべき）

## Railway.tomlの構造

Railwayでは、以下の2種類の `railway.toml` があります：

### 1. ルートディレクトリのrailway.toml
- **目的**: 全体的なデフォルト設定
- **場所**: プロジェクトのルートディレクトリ
- **内容**: 全サービスに共通する設定

### 2. 各サービスのrailway.toml
- **目的**: サービス固有の設定
- **場所**: 各サービスのディレクトリ（例: `services/service-registry/railway.toml`）
- **内容**: そのサービス固有の設定（Dockerfile Path、Build Context、Start Commandなど）

## 修正後のルートrailway.toml

```toml
# ルートディレクトリのrailway.toml
# 注意: 各サービスは独自のrailway.tomlを持つべきです
# このファイルは、全体的なデフォルト設定として使用されます

[build]
builder = "DOCKERFILE"
# dockerfilePathとbuildContextは各サービスのrailway.tomlで設定
# ルートディレクトリでは設定しない

[deploy]
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
# startCommandは各サービスのrailway.tomlで設定
```

## 各サービスのrailway.toml（正しい設定）

各サービス（service-registry、auth-service、video-service、api-gateway）には、以下のような `railway.toml` があります：

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

## 重要なポイント

### Root Directoryについて

**RailwayダッシュボードでRoot Directoryを設定しないでください。**

- ❌ **間違い**: Root Directoryに `services/service-registry` を設定
- ✅ **正しい**: Root Directoryを空（設定しない）

### Build Contextについて

**各サービスのrailway.tomlで `buildContext = "."` を設定してください。**

これにより、ビルドコンテキストがルートディレクトリになり、Dockerfileが想定しているパス構造と一致します。

### Dockerfile Pathについて

**各サービスのrailway.tomlで `dockerfilePath` を設定してください。**

- Service Registry: `services/service-registry/Dockerfile`
- Auth Service: `services/auth-service/Dockerfile`
- Video Service: `services/video-service/Dockerfile`
- API Gateway: `services/api-gateway/Dockerfile`

## 確認チェックリスト

- [ ] ルートディレクトリの `railway.toml` が修正されている
- [ ] 各サービスの `railway.toml` に `buildContext = "."` が設定されている
- [ ] 各サービスの `railway.toml` に正しい `dockerfilePath` が設定されている
- [ ] 各サービスの `railway.toml` に正しい `startCommand` が設定されている
- [ ] RailwayダッシュボードでRoot Directoryが空（設定しない）
- [ ] 変更がコミット・プッシュされている

## 次のステップ

1. **ルートディレクトリのrailway.tomlを修正**
2. **変更をコミット・プッシュ**
   ```bash
   git add railway.toml
   git commit -m "Fix root railway.toml - remove service-specific settings"
   git push
   ```
3. **Railwayダッシュボードで確認**
   - Root Directoryが空であることを確認
   - Build Contextが `.` に設定されていることを確認
4. **再デプロイを実行**

## まとめ

**重要なポイント**:
1. **ルートディレクトリのrailway.toml**: 全体的なデフォルト設定のみ
2. **各サービスのrailway.toml**: サービス固有の設定（Dockerfile Path、Build Context、Start Command）
3. **Railwayダッシュボード**: Root Directoryを空（設定しない）

これにより、ビルドコンテキストが正しく設定され、エラーが解消されます。

