# Railway Dockerfile エラー完全修正ガイド

## エラーメッセージ

```
Dockerfile `Dockerfile` does not exist
```

## 根本原因

VideoStepプロジェクトのDockerfileは、**リポジトリのルートディレクトリをビルドコンテキスト**として想定しています。しかし、RailwayでRoot Directoryを `services/service-registry` に設定すると、Railwayはそのディレクトリをビルドコンテキストとして使用しようとします。

Dockerfileの内容：
```dockerfile
COPY build.gradle settings.gradle ./
COPY services/service-registry/build.gradle ./services/service-registry/
```

これらのパスは、ルートディレクトリから見た相対パスです。

## 解決方法

### 方法1: Railwayの設定でビルドコンテキストをルートに設定（推奨）

Railwayでは、Root Directoryとビルドコンテキストを別々に設定できます。

1. **Railwayダッシュボードでサービスを開く**
2. **"Settings" タブを開く**
3. **"Source" セクションを確認**
4. **"Root Directory" を `services/service-registry` に設定**（先頭の `/` は付けない）
5. **"Build" セクションを開く**
6. **"Docker Build Context" または "Build Context" を `.`（ルートディレクトリ）に設定**
   - もしこのオプションがない場合は、方法2を使用

### 方法2: railway.tomlでビルドコンテキストを指定

各サービスの `railway.toml` を更新して、ビルドコンテキストを明示的に指定します。

#### service-registry/railway.toml の更新

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/service-registry/Dockerfile"
buildContext = "."

[deploy]
startCommand = "java -jar app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

**重要**: 
- `dockerfilePath`: ルートディレクトリから見たDockerfileのパス
- `buildContext`: `.`（ルートディレクトリ）を指定

### 方法3: Root Directoryを空にして、Dockerfileのパスを指定

1. **Root Directoryを空にする**（または削除）
2. **railway.tomlでDockerfileのパスを指定**

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/service-registry/Dockerfile"
```

## 推奨される設定

### Railwayダッシュボードでの設定

1. **Root Directory**: `services/service-registry`（先頭の `/` は付けない）
2. **Build Context**: `.`（ルートディレクトリ）
3. **Dockerfile Path**: `services/service-registry/Dockerfile`（または自動検出）

### railway.tomlでの設定

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/service-registry/Dockerfile"
# buildContextはデフォルトでルートディレクトリ

[deploy]
startCommand = "java -jar app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## 各サービスのrailway.toml更新

以下のように各サービスの `railway.toml` を更新してください：

### service-registry/railway.toml
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/service-registry/Dockerfile"

[deploy]
startCommand = "java -jar app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### auth-service/railway.toml
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/auth-service/Dockerfile"

[deploy]
startCommand = "java -jar app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### video-service/railway.toml
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/video-service/Dockerfile"

[deploy]
startCommand = "java -jar app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### api-gateway/railway.toml
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/api-gateway/Dockerfile"

[deploy]
startCommand = "java -jar app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## 確認手順

1. **railway.tomlを更新**
2. **変更をコミットしてプッシュ**
3. **Railwayダッシュボードで設定を確認**
   - Root Directory: `services/service-registry`
   - Dockerfile Path: `services/service-registry/Dockerfile`（または自動検出）
4. **再デプロイを実行**
5. **ビルドログで確認**
   - エラー「Dockerfile does not exist」が消える
   - ビルドが正常に開始される

## トラブルシューティング

### まだエラーが発生する場合

1. **railway.tomlが正しくコミット・プッシュされているか確認**
2. **Railwayダッシュボードで設定を再確認**
   - Root Directory
   - Dockerfile Path
3. **ビルドログを確認**
   - どのディレクトリでDockerfileを探しているか確認

### Railway CLIを使用する場合

```bash
cd C:\devlop\VideoStep\services\service-registry

# サービスにリンク
railway link

# 設定を確認
railway status

# デプロイ
railway up
```

## まとめ

**重要なポイント**:
1. Root Directoryは `services/service-registry`（先頭の `/` は付けない）
2. Dockerfileのパスは `services/service-registry/Dockerfile`（ルートから見た相対パス）
3. ビルドコンテキストはルートディレクトリ（`.`）

これらの設定により、Railwayは正しい場所でDockerfileを見つけ、ビルドが成功します。

