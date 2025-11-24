# OpenAI APIキー設定手順

## APIキー

⚠️ **重要**: 実際のAPIキーは環境変数またはシークレット管理システムで管理してください。
このドキュメントには実際のAPIキーを含めないでください。

APIキーは以下の形式です：
```
sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

実際のAPIキーを取得するには：
1. https://platform.openai.com/api-keys にアクセス
2. 新しいAPIキーを作成
3. 作成したAPIキーをコピー（一度しか表示されません）

## 設定が必要な場所

### 1. Vercel（フロントエンド）

#### 方法1: Vercel CLI
```bash
cd C:\devlop\VideoStep\frontend
# 実際のAPIキーを YOUR_OPENAI_API_KEY に置き換えてください
echo YOUR_OPENAI_API_KEY | vercel env add OPENAI_API_KEY production
echo YOUR_OPENAI_API_KEY | vercel env add OPENAI_API_KEY preview
echo YOUR_OPENAI_API_KEY | vercel env add OPENAI_API_KEY development
```

#### 方法2: Vercelダッシュボード
1. https://vercel.com/kensudogits-projects/frontend/settings/environment-variables にアクセス
2. **Add New** をクリック
3. **Key**: `OPENAI_API_KEY`
4. **Value**: 実際のAPIキーを入力（`sk-proj-`で始まる文字列）
5. **Environment**: Production, Preview, Development すべてにチェック
6. **Save** をクリック

### 2. Railway（バックエンドサービス）

各サービスに環境変数を設定：

#### auth-service
```bash
# 実際のAPIキーを YOUR_OPENAI_API_KEY に置き換えてください
railway variables set OPENAI_API_KEY=YOUR_OPENAI_API_KEY --service auth-service
```

#### video-service
```bash
railway variables set OPENAI_API_KEY=YOUR_OPENAI_API_KEY --service video-service
```

#### translation-service
```bash
railway variables set OPENAI_API_KEY=YOUR_OPENAI_API_KEY --service translation-service
```

#### editing-service
```bash
railway variables set OPENAI_API_KEY=YOUR_OPENAI_API_KEY --service editing-service
```

#### Railwayダッシュボードから設定
1. https://railway.app にアクセス
2. 各サービスを選択
3. **Variables** タブを開く
4. **New Variable** をクリック
5. **Name**: `OPENAI_API_KEY`
6. **Value**: 実際のAPIキーを入力（`sk-proj-`で始まる文字列）
7. **Add** をクリック

### 3. ローカル開発環境（docker-compose.yml）

`docker-compose.yml`の各サービスに既に`OPENAI_API_KEY=${OPENAI_API_KEY}`が設定されているので、環境変数を設定：

```bash
# Windows (PowerShell)
# 実際のAPIキーを YOUR_OPENAI_API_KEY に置き換えてください
$env:OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

# Windows (CMD)
set OPENAI_API_KEY=YOUR_OPENAI_API_KEY

# Linux/Mac
export OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

または、`.env`ファイルを作成（`.gitignore`に追加されていることを確認）：
```
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

⚠️ **重要**: `.env`ファイルは`.gitignore`に追加されていることを確認してください。リポジトリにコミットしないでください。

## 確認方法

### Vercel
```bash
cd C:\devlop\VideoStep\frontend
vercel env ls | findstr OPENAI_API_KEY
```

### Railway
```bash
railway variables --service auth-service
railway variables --service video-service
railway variables --service translation-service
railway variables --service editing-service
```

## 注意事項

⚠️ **セキュリティ警告**:
- APIキーは機密情報です
- リポジトリにコミットしないでください
- `.env`ファイルは`.gitignore`に追加してください
- 定期的にAPIキーをローテーションしてください

## 設定後の再デプロイ

環境変数を設定した後、各サービスを再デプロイ：

### Vercel
```bash
cd C:\devlop\VideoStep\frontend
vercel --prod --yes
```

### Railway
各サービスが自動的に再デプロイされます。手動で再デプロイする場合：
```bash
railway redeploy --service auth-service
railway redeploy --service video-service
railway redeploy --service translation-service
railway redeploy --service editing-service
```

