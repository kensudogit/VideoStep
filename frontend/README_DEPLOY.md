# 🚀 Vercel完全公開モードデプロイ

## クイックスタート

### 1. デプロイスクリプトを実行

```cmd
cd C:\devlop\VideoStep\frontend
RUN_DEPLOY.bat
```

または

```cmd
cd C:\devlop\VideoStep\frontend
deploy-now.bat
```

### 2. デプロイ後の設定（必須）

デプロイが完了したら、**必ず**以下を実行：

1. **Vercelダッシュボード**: https://vercel.com/dashboard
2. **プロジェクトを選択**
3. **Settings** > **Environment Variables**
4. 以下を追加：
   - **Name**: `NEXT_PUBLIC_USE_MOCK_DATA`
   - **Value**: `true`
   - **Environment**: Production, Preview, Development すべて
5. **再デプロイ**

## 詳細

詳細な手順は `FINAL_DEPLOY_STEPS.md` を参照してください。

