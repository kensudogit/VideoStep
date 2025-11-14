# Railway Java SE 21 LTS 対応ガイド

## 概要

RailwayでJava SE 21 LTSを使用するための設定確認と修正手順です。

## 現在の設定状況

### ✅ 既に正しく設定されている項目

1. **Dockerfile（全サービス）**
   - Build stage: `FROM gradle:8.5-jdk21 AS build`
   - Runtime stage: `FROM eclipse-temurin:21-jre-alpine`

2. **build.gradle（全サービス）**
   - `sourceCompatibility = JavaVersion.VERSION_21`
   - `targetCompatibility = JavaVersion.VERSION_21`

3. **Spring Boot バージョン**
   - Spring Boot 3.2.0（Java 21をサポート）

## RailwayでのJava 21設定

RailwayはDockerfileから自動的にJavaバージョンを検出します。現在の設定で問題ありません。

### 確認事項

1. **Dockerfileの確認**
   - 各サービスのDockerfileで `gradle:8.5-jdk21` と `eclipse-temurin:21-jre-alpine` を使用していることを確認

2. **ビルドログの確認**
   - RailwayのビルドログでJava 21が使用されていることを確認
   - 例: `openjdk version "21.0.x"`

## トラブルシューティング

### Javaバージョンが正しく認識されない場合

1. **Dockerfileの確認**
   ```dockerfile
   # Build stage
   FROM gradle:8.5-jdk21 AS build
   
   # Runtime stage
   FROM eclipse-temurin:21-jre-alpine
   ```

2. **build.gradleの確認**
   ```gradle
   java {
       sourceCompatibility = JavaVersion.VERSION_21
       targetCompatibility = JavaVersion.VERSION_21
   }
   ```

3. **Railwayの環境変数（通常は不要）**
   - RailwayはDockerfileから自動検出するため、明示的な環境変数は通常不要です
   - 必要に応じて、Railwayの環境変数に以下を追加：
     ```
     JAVA_VERSION=21
     ```

### Java 21の特定バージョンが必要な場合

現在の設定では、以下のイメージを使用しています：

- **Build**: `gradle:8.5-jdk21` - Gradle 8.5 + OpenJDK 21
- **Runtime**: `eclipse-temurin:21-jre-alpine` - Eclipse Temurin JRE 21（Alpine Linux版）

特定のJava 21バージョンが必要な場合は、Dockerfileを以下のように変更：

```dockerfile
# 特定のJava 21バージョンを指定する場合
FROM eclipse-temurin:21.0.1+12-jdk-alpine AS build
# または
FROM eclipse-temurin:21-jdk-alpine AS build
```

## 各サービスのJava 21設定確認

### Service Registry
- ✅ Dockerfile: `gradle:8.5-jdk21`, `eclipse-temurin:21-jre-alpine`
- ✅ build.gradle: `JavaVersion.VERSION_21`

### Auth Service
- ✅ Dockerfile: `gradle:8.5-jdk21`, `eclipse-temurin:21-jre-alpine`
- ✅ build.gradle: `JavaVersion.VERSION_21`

### Video Service
- ✅ Dockerfile: `gradle:8.5-jdk21`, `eclipse-temurin:21-jre-alpine`
- ✅ build.gradle: `JavaVersion.VERSION_21`

### API Gateway
- ✅ Dockerfile: `gradle:8.5-jdk21`, `eclipse-temurin:21-jre-alpine`
- ✅ build.gradle: `JavaVersion.VERSION_21`

### Translation Service
- ✅ Dockerfile: `gradle:8.5-jdk21`, `eclipse-temurin:21-jre-alpine`
- ✅ build.gradle: `JavaVersion.VERSION_21`

### Editing Service
- ✅ Dockerfile: `gradle:8.5-jdk21`, `eclipse-temurin:21-jre-alpine`
- ✅ build.gradle: `JavaVersion.VERSION_21`

### User Service
- ✅ Dockerfile: `gradle:8.5-jdk21`, `eclipse-temurin:21-jre-alpine`
- ✅ build.gradle: `JavaVersion.VERSION_21`

## ビルドログでの確認

Railwayのビルドログで以下のようなメッセージが表示されることを確認：

```
Step 1/10 : FROM gradle:8.5-jdk21 AS build
...
Step 2/10 : FROM eclipse-temurin:21-jre-alpine
...
```

実行時のログで：
```
openjdk version "21.0.x" 2024-xx-xx
OpenJDK Runtime Environment (build 21.0.x+xx-Eclipse Adoptium)
```

## まとめ

現在の設定はJava SE 21 LTSに対応済みです。Railwayでのデプロイ時に問題が発生する場合は、Root Directoryの設定を確認してください。

## 関連ドキュメント

- `RAILWAY_DEPLOY_COMPLETE.md` - Railwayデプロイ完全ガイド
- `RAILWAY_ROOT_DIRECTORY_FIX.md` - Root Directory設定ガイド

