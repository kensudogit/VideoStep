# OpenAI APIキー設定手順

## APIキー
```
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
```

## 設定が必要な場所

### 1. Vercel（フロントエンド）

#### 方法1: Vercel CLI
```bash
cd C:\devlop\VideoStep\frontend
echo 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 | vercel env add OPENAI_API_KEY production
echo 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 | vercel env add OPENAI_API_KEY preview
echo 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 | vercel env add OPENAI_API_KEY development
```

#### 方法2: Vercelダッシュボード
1. https://vercel.com/kensudogits-projects/frontend/settings/environment-variables にアクセス
2. **Add New** をクリック
3. **Key**: `OPENAI_API_KEY`
4. **Value**: `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`
5. **Environment**: Production, Preview, Development すべてにチェック
6. **Save** をクリック

### 2. Railway（バックエンドサービス）

各サービスに環境変数を設定：

#### auth-service
```bash
railway variables set OPENAI_API_KEY=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 --service auth-service
```

#### video-service
```bash
railway variables set OPENAI_API_KEY=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 --service video-service
```

#### translation-service
```bash
railway variables set OPENAI_API_KEY=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 --service translation-service
```

#### editing-service
```bash
railway variables set OPENAI_API_KEY=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 --service editing-service
```

#### Railwayダッシュボードから設定
1. https://railway.app にアクセス
2. 各サービスを選択
3. **Variables** タブを開く
4. **New Variable** をクリック
5. **Name**: `OPENAI_API_KEY`
6. **Value**: `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`
7. **Add** をクリック

### 3. ローカル開発環境（docker-compose.yml）

`docker-compose.yml`の各サービスに既に`OPENAI_API_KEY=${OPENAI_API_KEY}`が設定されているので、環境変数を設定：

```bash
# Windows (PowerShell)
$env:OPENAI_API_KEY="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"

# Windows (CMD)
set OPENAI_API_KEY=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

# Linux/Mac
export OPENAI_API_KEY="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"
```

または、`.env`ファイルを作成：
```
OPENAI_API_KEY=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
```

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

