# Vercel トラブルシューティング

## Resource provisioning failed エラー

このエラーは、Vercelがリソースをプロビジョニングできない場合に発生します。

### 解決方法

#### 1. Vercelダッシュボードから再デプロイ

1. https://vercel.com にアクセス
2. プロジェクト `frontend` を選択
3. "Deployments" タブを開く
4. 失敗したデプロイメントを削除
5. 最新のコミットから "Redeploy" をクリック

#### 2. プロジェクト設定の確認

Vercelダッシュボードで以下を確認：

1. Settings → General
   - Framework Preset: Next.js
   - Root Directory: `frontend`（プロジェクトルートが`frontend`の場合）
   - Build Command: `npm run build`（自動検出される）
   - Output Directory: `.next`（自動検出される）
   - Install Command: `npm install`（自動検出される）

#### 3. 環境変数の確認

Settings → Environment Variables で以下を確認：

- `NEXT_PUBLIC_API_BASE_URL`が設定されていないことを確認（Mockデータ使用時）

#### 4. ビルドログの確認

1. 失敗したデプロイメントをクリック
2. "Build Logs" を確認
3. エラーメッセージを確認

#### 5. ローカルビルドの確認

ローカルでビルドが成功することを確認：

```bash
cd C:\devlop\VideoStep\frontend
npm install
npm run build
```

エラーが発生する場合は修正してから再デプロイ

#### 6. プロジェクトのクリーンアップ

不要なファイルを削除：

```bash
cd C:\devlop\VideoStep\frontend
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### 7. Vercel CLIでデプロイ

```bash
cd C:\devlop\VideoStep\frontend
vercel --prod --yes
```

### よくある原因と解決策

#### 原因1: メモリ不足

**解決策**:
- ビルド時間を短縮する
- 不要な依存関係を削除
- ビルドキャッシュをクリア

#### 原因2: タイムアウト

**解決策**:
- ビルド時間を短縮
- 不要なファイルを除外（.vercelignore）

#### 原因3: 設定ファイルの問題

**解決策**:
- `vercel.json`を簡素化
- 不要な設定を削除

#### 原因4: 依存関係の問題

**解決策**:
- `package-lock.json`を確認
- `npm install`を再実行

### 推奨設定

#### vercel.json（最小構成）

```json
{
  "framework": "nextjs"
}
```

Vercelが自動的にNext.jsを検出するため、追加の設定は不要です。

#### .vercelignore

不要なファイルを除外：

```
node_modules
.next
*.md
.env*.local
```

### サポート

問題が解決しない場合：

1. Vercelのサポートに連絡
2. ビルドログを共有
3. エラーメッセージを共有

