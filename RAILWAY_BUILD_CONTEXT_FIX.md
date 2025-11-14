# Railway ビルドコンテキストエラー修正

## エラーメッセージ

```
ERROR: failed to build: failed to solve: failed to compute cache key: failed to calculate checksum of ref ...: "/services/service-registry/src": not found
```

## 原因

Root Directoryを `services/service-registry` に設定すると、Railwayはそのディレクトリを**ビルドコンテキスト**として使用します。しかし、Dockerfileは**ルートディレクトリ**をビルドコンテキストとして想定しているため、以下のパスが存在しません：

```dockerfile
COPY services/service-registry/src ./services/service-registry/src
```

ビルドコンテキストが `services/service-registry` の場合、`services/service-registry/src` というパスは存在せず、`src` が直接存在します。

## 解決方法

### 方法1: Root Directoryを空にして、ビルドコンテキストをルートに設定（推奨）

Dockerfileはルートディレクトリをビルドコンテキストとして想定しているため、この方法が最も簡単です。

#### Railwayダッシュボードでの設定

1. **Service Registryサービスを開く**
2. **"Settings" タブを開く**
3. **"Source" セクションの "Root Directory" を空にする**（または削除）
4. **"Build" セクションを確認**
   - Dockerfile Path: `services/service-registry/Dockerfile`（自動検出されるか、手動で設定）
   - Build Context: `.`（ルートディレクトリ、デフォルト）

#### railway.tomlでの設定

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/service-registry/Dockerfile"
# buildContextはデフォルトでルートディレクトリ（.）
```

### 方法2: Dockerfileを修正して、Root Directoryに対応させる

Root Directoryを `services/service-registry` に設定したまま、Dockerfileを修正する方法です。

#### 修正後のDockerfile

```dockerfile
# Build stage
FROM gradle:8.5-jdk21 AS build
WORKDIR /workspace

# ルートディレクトリのファイルをコピー（親ディレクトリから）
COPY ../build.gradle ../settings.gradle ./

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

**注意**: この方法は複雑で、Dockerfileの `COPY` コマンドで `../` を使用する必要がありますが、これは推奨されません。

## 推奨される設定

### Railwayダッシュボード

1. **Root Directory**: **空**（設定しない）
2. **Dockerfile Path**: `services/service-registry/Dockerfile`
3. **Build Context**: `.`（ルートディレクトリ、デフォルト）

### railway.toml

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "services/service-registry/Dockerfile"
# buildContextはデフォルトでルートディレクトリ（.）

[deploy]
startCommand = "java -jar app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## 各サービスの設定

すべてのサービスで、Root Directoryを**空**にして、Dockerfile Pathを指定します：

### Service Registry
- Root Directory: **空**
- Dockerfile Path: `services/service-registry/Dockerfile`

### Auth Service
- Root Directory: **空**
- Dockerfile Path: `services/auth-service/Dockerfile`

### Video Service
- Root Directory: **空**
- Dockerfile Path: `services/video-service/Dockerfile`

### API Gateway
- Root Directory: **空**
- Dockerfile Path: `services/api-gateway/Dockerfile`

## 確認手順

1. **Railwayダッシュボードで設定を確認**
   - Root Directory: 空（または削除）
   - Dockerfile Path: `services/service-registry/Dockerfile`

2. **再デプロイを実行**

3. **ビルドログで確認**
   - エラー「/services/service-registry/src: not found」が消える
   - ビルドが正常に進行する

## まとめ

**重要なポイント**:
- Root Directoryは**空**にする（設定しない）
- Dockerfile Pathは `services/service-registry/Dockerfile`（ルートからの相対パス）
- ビルドコンテキストはルートディレクトリ（`.`、デフォルト）

これにより、Dockerfileが想定しているビルドコンテキスト（ルートディレクトリ）と一致し、ビルドが成功します。

