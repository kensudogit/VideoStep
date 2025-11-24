# 🚀 Vercel完全公開モードデプロイ - 今すぐ実行

## 実行コマンド

以下のコマンドを実行してください：

```cmd
cd C:\devlop\VideoStep\frontend
deploy-vercel-public-mock.bat
```

または、既存のスクリプトを使用：

```cmd
cd C:\devlop\VideoStep\frontend
deploy-vercel-public.bat
```

## デプロイ後の必須作業

### 1. 環境変数の設定（重要！）

デプロイが完了したら、**必ず**以下を実行してください：

1. Vercelダッシュボードにアクセス: https://vercel.com/dashboard
2. デプロイしたプロジェクトを選択
3. **Settings** > **Environment Variables** をクリック
4. 以下の環境変数を追加：
   - **Name**: `NEXT_PUBLIC_USE_MOCK_DATA`
   - **Value**: `true`
   - **Environment**: 
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
5. **Save** をクリック
6. **Deployments** タブに戻る
7. 最新のデプロイを選択し、**Redeploy** をクリック

### 2. 動作確認

デプロイURLにアクセスして、以下を確認：

1. ブラウザでデプロイURLを開く
2. F12キーで開発者ツールを開く
3. Consoleタブで以下が表示されれば成功：
   ```
   [Mock Data] NEXT_PUBLIC_USE_MOCK_DATA=true が設定されています。mockデータを使用します。
   [Mock Data] Using mock data for endpoint: /api/videos/public
   ```

## トラブルシューティング

### Vercel CLIがインストールされていない

```cmd
npm install -g vercel
vercel login
```

### ビルドエラー

```cmd
cd C:\devlop\VideoStep\frontend
rmdir /s /q .next
npm install
npm run build
```

### 環境変数が反映されない

- 環境変数を設定した後、**必ず再デプロイ**してください
- ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）

## 完了！

デプロイが完了すると、誰でもアクセス可能な完全公開モードのサイトが利用できます。

Mockサンプル動画データ（20個）が自動的に表示されます。

