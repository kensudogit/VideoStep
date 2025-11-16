# データベース設定手順

VideoStepプロジェクトのデータベース設定と初期化の手順です。

## 目次

1. [概要](#概要)
2. [Docker Composeを使用した設定](#docker-composeを使用した設定)
3. [ローカルPostgreSQLを使用した設定](#ローカルpostgresqlを使用した設定)
4. [データベース接続確認](#データベース接続確認)
5. [トラブルシューティング](#トラブルシューティング)

## 概要

VideoStepプロジェクトは、マイクロサービスアーキテクチャを使用しており、各サービスが専用のPostgreSQLデータベースを持っています。

### データベース一覧

| サービス | データベース名 | ポート | 用途 |
|---------|--------------|-------|------|
| Auth Service | `videostep_auth` | 5433 | 認証・ユーザー管理 |
| Video Service | `videostep_video` | 5440 | 動画・コメント・プレイリスト |
| Translation Service | `videostep_translation` | 5441 | 翻訳データ |
| Editing Service | `videostep_editing` | 5442 | 編集データ |
| User Service | `videostep_user` | 5443 | ユーザープロフィール |

### デフォルト認証情報

- **ユーザー名**: `videostep`
- **パスワード**: `videostep`

⚠️ **本番環境では必ず変更してください**

## Docker Composeを使用した設定

### ステップ1: データベースコンテナの起動

```bash
# VideoStepプロジェクトのルートディレクトリに移動
cd VideoStep

# データベースのみを起動
docker-compose up -d postgres-auth postgres-video postgres-translation postgres-editing postgres-user
```

### ステップ2: データベースの起動確認

```bash
# すべてのPostgreSQLコンテナが起動しているか確認
docker ps | grep postgres

# 各データベースへの接続テスト
docker-compose exec postgres-auth psql -U videostep -d videostep_auth -c "SELECT version();"
docker-compose exec postgres-video psql -U videostep -d videostep_video -c "SELECT version();"
```

### ステップ3: サービスの起動（自動スキーマ作成）

各サービスを起動すると、JPAの`ddl-auto: update`設定により、自動的にテーブルが作成されます。

```bash
# すべてのサービスを起動
docker-compose up -d

# または、特定のサービスを起動
docker-compose up -d auth-service
docker-compose up -d video-service
```

### ステップ4: スキーマの確認

```bash
# Auth Serviceのデータベーステーブルを確認
docker-compose exec postgres-auth psql -U videostep -d videostep_auth -c "\dt"

# Video Serviceのデータベーステーブルを確認
docker-compose exec postgres-video psql -U videostep -d videostep_video -c "\dt"
```

## ローカルPostgreSQLを使用した設定

Dockerを使用せず、ローカルのPostgreSQLを使用する場合の手順です。

### ステップ1: PostgreSQLのインストール

- Windows: https://www.postgresql.org/download/windows/
- macOS: `brew install postgresql@15`
- Linux: `sudo apt-get install postgresql-15`

### ステップ2: データベースの作成

```sql
-- PostgreSQLに接続
psql -U postgres

-- データベースとユーザーを作成
CREATE USER videostep WITH PASSWORD 'videostep';
CREATE DATABASE videostep_auth OWNER videostep;
CREATE DATABASE videostep_video OWNER videostep;
CREATE DATABASE videostep_translation OWNER videostep;
CREATE DATABASE videostep_editing OWNER videostep;
CREATE DATABASE videostep_user OWNER videostep;

-- 権限を付与
GRANT ALL PRIVILEGES ON DATABASE videostep_auth TO videostep;
GRANT ALL PRIVILEGES ON DATABASE videostep_video TO videostep;
GRANT ALL PRIVILEGES ON DATABASE videostep_translation TO videostep;
GRANT ALL PRIVILEGES ON DATABASE videostep_editing TO videostep;
GRANT ALL PRIVILEGES ON DATABASE videostep_user TO videostep;
```

### ステップ3: application.ymlの設定

各サービスの`application.yml`で、接続URLをローカルに変更：

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/videostep_auth
    username: videostep
    password: videostep
```

## データベース接続確認

### 方法1: Docker Compose経由

```bash
# Auth Serviceのデータベースに接続
docker-compose exec postgres-auth psql -U videostep -d videostep_auth

# 接続後、テーブル一覧を表示
\dt

# 終了
\q
```

### 方法2: 外部ツールを使用

以下の接続情報を使用して、pgAdmin、DBeaver、TablePlusなどのツールで接続できます。

**Auth Service:**
- Host: `localhost`
- Port: `5433`
- Database: `videostep_auth`
- Username: `videostep`
- Password: `videostep`

**Video Service:**
- Host: `localhost`
- Port: `5440`
- Database: `videostep_video`
- Username: `videostep`
- Password: `videostep`

### 方法3: サービスログで確認

```bash
# サービスが正常にデータベースに接続しているかログで確認
docker-compose logs auth-service | grep -i "database"
docker-compose logs video-service | grep -i "database"
```

## データベースの初期化

### 自動初期化（推奨）

各サービスの`application.yml`で`ddl-auto: update`が設定されているため、サービス起動時に自動的にテーブルが作成されます。

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # 自動的にテーブルを作成・更新
```

### 手動初期化（必要に応じて）

FlywayやLiquibaseを使用している場合は、マイグレーションスクリプトを実行：

```bash
# マイグレーションファイルがある場合
docker-compose exec video-service ./gradlew flywayMigrate
```

## データベースのバックアップ

### バックアップの作成

```bash
# Auth Serviceのデータベースをバックアップ
docker-compose exec postgres-auth pg_dump -U videostep videostep_auth > backup_auth.sql

# Video Serviceのデータベースをバックアップ
docker-compose exec postgres-video pg_dump -U videostep videostep_video > backup_video.sql
```

### バックアップの復元

```bash
# バックアップから復元
docker-compose exec -T postgres-auth psql -U videostep -d videostep_auth < backup_auth.sql
docker-compose exec -T postgres-video psql -U videostep -d videostep_video < backup_video.sql
```

## データベースのリセット

### データを完全に削除して再作成

```bash
# コンテナとボリュームを削除
docker-compose down -v

# 再起動（新しいデータベースが作成される）
docker-compose up -d
```

## トラブルシューティング

### 問題1: データベース接続エラー

**エラーメッセージ:**
```
Connection to localhost:5432 refused
```

**解決方法:**
1. PostgreSQLコンテナが起動しているか確認
   ```bash
   docker ps | grep postgres
   ```

2. コンテナを再起動
   ```bash
   docker-compose restart postgres-auth
   ```

3. データベースが完全に起動するまで待つ（30秒程度）

### 問題2: 認証エラー

**エラーメッセージ:**
```
FATAL: password authentication failed
```

**解決方法:**
1. `.env`ファイルまたは`docker-compose.yml`でパスワードを確認
2. データベースのパスワードをリセット
   ```bash
   docker-compose exec postgres-auth psql -U postgres -c "ALTER USER videostep WITH PASSWORD 'videostep';"
   ```

### 問題3: テーブルが作成されない

**解決方法:**
1. サービスのログを確認
   ```bash
   docker-compose logs video-service
   ```

2. `application.yml`で`ddl-auto: update`が設定されているか確認

3. サービスを再起動
   ```bash
   docker-compose restart video-service
   ```

### 問題4: ポートが既に使用されている

**エラーメッセージ:**
```
port is already allocated
```

**解決方法:**
1. 使用中のポートを確認
   ```bash
   # Windows
   netstat -ano | findstr :5433
   
   # Linux/Mac
   lsof -i :5433
   ```

2. `docker-compose.yml`でポート番号を変更
   ```yaml
   ports:
     - "5434:5432"  # 5433から5434に変更
   ```

## 環境変数の設定

### Docker Compose環境

`.env`ファイルを作成（既に存在する場合は更新）：

```env
OPENAI_API_KEY=your-api-key-here
```

### 本番環境（Railway等）

各サービスの環境変数に以下を設定：

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database
SPRING_DATASOURCE_USERNAME=videostep
SPRING_DATASOURCE_PASSWORD=your-secure-password
```

## セキュリティのベストプラクティス

1. **本番環境では必ずパスワードを変更**
   - デフォルトの`videostep`パスワードは使用しない

2. **環境変数で管理**
   - パスワードをコードに直接書かない
   - `.env`ファイルを`.gitignore`に追加

3. **ネットワーク分離**
   - データベースは内部ネットワークのみでアクセス可能にする
   - 外部からの直接アクセスを制限

4. **定期的なバックアップ**
   - 自動バックアップスクリプトを設定
   - バックアップを安全な場所に保存

## 参考リンク

- [PostgreSQL公式ドキュメント](https://www.postgresql.org/docs/)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Docker Compose公式ドキュメント](https://docs.docker.com/compose/)

