# OpenAI APIキー設定手順

このドキュメントでは、VideoStepプロジェクトでOpenAI APIキーを設定する方法を説明します。

## 前提条件

1. OpenAIアカウントを持っていること
2. OpenAI APIキーを取得していること
   - https://platform.openai.com/api-keys から取得可能

## 設定方法

### 方法1: ローカル開発環境（Docker Compose）

#### ステップ1: 環境変数ファイルの作成

プロジェクトルートに `.env` ファイルを作成（既に存在する場合は編集）：

```bash
# .env ファイル
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**重要**: `.env` ファイルは `.gitignore` に追加されていることを確認してください（APIキーをGitにコミットしないため）。

#### ステップ2: docker-compose.yml の更新

OpenAI APIキーを使用するサービス（例: `editing-service`）の `environment` セクションに環境変数を追加：

```yaml
editing-service:
  build:
    context: .
    dockerfile: ./services/editing-service/Dockerfile
  container_name: videostep-editing-service
  ports:
    - "8084:8084"
  depends_on:
    - postgres-editing
    - service-registry
  environment:
    - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-editing:5432/videostep_editing
    - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://service-registry:8761/eureka/
    - OPENAI_API_KEY=${OPENAI_API_KEY}  # 追加
  networks:
    - videostep-network
```

#### ステップ3: application.yml の更新

該当するサービスの `application.yml` にOpenAI APIキーの設定を追加：

```yaml
# services/editing-service/src/main/resources/application.yml
openai:
  api:
    key: ${OPENAI_API_KEY:your-api-key-here}
```

または、より安全な方法として環境変数のみを使用：

```yaml
openai:
  api:
    key: ${OPENAI_API_KEY}
```

#### ステップ4: Docker Composeの再起動

```bash
docker-compose down
docker-compose up -d
```

### 方法2: 個別のSpring Bootサービス実行時

#### ステップ1: 環境変数の設定

Windows (PowerShell):
```powershell
$env:OPENAI_API_KEY="sk-your-openai-api-key-here"
```

Windows (コマンドプロンプト):
```cmd
set OPENAI_API_KEY=sk-your-openai-api-key-here
```

Linux/Mac:
```bash
export OPENAI_API_KEY=sk-your-openai-api-key-here
```

#### ステップ2: application.yml の更新

`application.yml` に設定を追加（方法1のステップ3と同じ）。

#### ステップ3: サービスの起動

```bash
cd services/editing-service
./gradlew bootRun
```

### 方法3: Railway（本番環境）での設定

#### ステップ1: Railwayダッシュボードにアクセス

1. https://railway.app にログイン
2. VideoStepプロジェクトを開く
3. OpenAI APIキーを使用するサービス（例: `editing-service`）を選択

#### ステップ2: 環境変数の追加

1. **"Variables" タブを開く**
2. **"New Variable" をクリック**
3. 以下の情報を入力：
   - **Name**: `OPENAI_API_KEY`
   - **Value**: あなたのOpenAI APIキー（`sk-` で始まる文字列）
4. **"Add" をクリック**

#### ステップ3: application.yml の確認

`application.yml` に以下の設定があることを確認：

```yaml
openai:
  api:
    key: ${OPENAI_API_KEY}
```

#### ステップ4: 再デプロイ

Railwayが自動的に再デプロイを実行します。手動で再デプロイする場合は：
- "Deployments" タブから最新のデプロイメントを選択
- "Redeploy" をクリック

### 方法4: フロントエンド（Next.js）での設定

フロントエンドから直接OpenAI APIを呼び出す場合（推奨されませんが、必要に応じて）：

#### ステップ1: .env.local ファイルの作成

`frontend` ディレクトリに `.env.local` ファイルを作成：

```bash
# frontend/.env.local
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here
```

**注意**: `NEXT_PUBLIC_` プレフィックスを付けると、クライアント側からアクセス可能になります。セキュリティ上の理由から、**推奨されません**。バックエンド経由でAPIを呼び出すことを強く推奨します。

#### ステップ2: コードでの使用

```typescript
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
```

## 設定の確認

### バックエンドでの確認

Javaコードで環境変数が正しく読み込まれているか確認：

```java
@Value("${openai.api.key}")
private String openaiApiKey;

@PostConstruct
public void init() {
    if (openaiApiKey == null || openaiApiKey.isEmpty() || openaiApiKey.equals("your-api-key-here")) {
        logger.warn("OpenAI API key is not configured properly");
    } else {
        logger.info("OpenAI API key is configured");
    }
}
```

### ログでの確認

サービス起動時のログを確認し、エラーがないかチェック：

```bash
docker-compose logs editing-service
```

## セキュリティのベストプラクティス

1. **APIキーをGitにコミットしない**
   - `.env` ファイルは `.gitignore` に追加
   - `.env.example` ファイルを作成し、プレースホルダーを記載

2. **環境変数を使用**
   - ハードコードしない
   - `application.yml` に直接キーを書かない

3. **最小権限の原則**
   - 必要最小限の権限を持つAPIキーを使用
   - 定期的にキーをローテーション

4. **本番環境と開発環境を分離**
   - 異なるAPIキーを使用
   - 本番環境のキーにはより厳しい制限を設定

## トラブルシューティング

### 問題: 環境変数が読み込まれない

**解決策**:
1. 環境変数名が正しいか確認（大文字小文字を区別）
2. Docker Composeの場合は、`docker-compose.yml` の `environment` セクションを確認
3. サービスを再起動

### 問題: APIキーが無効

**解決策**:
1. OpenAIダッシュボードでAPIキーが有効か確認
2. APIキーに十分なクレジットがあるか確認
3. レート制限に達していないか確認

### 問題: Railwayで環境変数が反映されない

**解決策**:
1. Railwayダッシュボードで環境変数が正しく設定されているか確認
2. サービスを再デプロイ
3. ログを確認してエラーメッセージを確認

## 参考リンク

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Docker Compose Environment Variables](https://docs.docker.com/compose/environment-variables/)

