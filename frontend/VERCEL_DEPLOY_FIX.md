# Vercelデプロイエラー修正ガイド

## 問題

「Resource provisioning failed」エラーが発生し、デプロイが失敗しています。

## 原因

ビルドが0msで終了しているため、Vercelがリソースをプロビジョニングできていません。

## 解決方法

### 方法1: Vercelダッシュボードでプロジェクト設定を確認

1. https://vercel.com/kensudogits-projects/frontend にアクセス
2. **Settings** → **General** に移動
3. 以下の設定を確認：

#### Root Directory
- **設定値**: `frontend` または空（プロジェクトルートが`frontend`の場合）
- プロジェクトが`C:\devlop\VideoStep\frontend`にある場合、ルートディレクトリは空にするか、`frontend`に設定

#### Build & Development Settings
- **Framework Preset**: `Next.js`
- **Build Command**: `npm run build` または空（自動検出）
- **Output Directory**: `.next` または空（自動検出）
- **Install Command**: `npm install` または空（自動検出）
- **Development Command**: `npm run dev` または空（自動検出）

#### Node.js Version
- **Version**: `18.x` 以上

### 方法2: プロジェクトを再リンク

```bash
cd C:\devlop\VideoStep\frontend
rm -rf .vercel
vercel link --yes
```

### 方法3: プロジェクトを削除して再作成

1. Vercelダッシュボードでプロジェクトを削除
2. 新しいプロジェクトを作成：
   ```bash
   cd C:\devlop\VideoStep\frontend
   vercel --yes
   ```
3. プロジェクト名を `frontend` に設定
4. ルートディレクトリを空にする（または`frontend`に設定）

### 方法4: 環境変数の確認

以下の環境変数が正しく設定されているか確認：

```bash
vercel env ls
```

必要な環境変数：
- `NEXT_PUBLIC_USE_MOCK_DATA` = `true` (Production, Preview, Development)

不要な環境変数を削除：
- `NEXT_PUBLIC_API_BASE_URL` が設定されている場合は削除

### 方法5: ビルドログの確認

Vercelダッシュボードで：
1. **Deployments** タブを開く
2. 失敗したデプロイを選択
3. **Logs** タブでエラーログを確認

## 推奨される設定

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### package.json

```json
{
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start"
  }
}
```

## トラブルシューティング

### 問題: ビルドが0msで終了する

**原因**: Vercelがビルドコマンドを実行できていない

**解決方法**:
1. プロジェクト設定でビルドコマンドが正しく設定されているか確認
2. `vercel.json`にビルド設定を明示的に追加
3. プロジェクトを再リンク

### 問題: Resource provisioning failed

**原因**: Vercelがリソースをプロビジョニングできない

**解決方法**:
1. Vercelのアカウント制限を確認
2. プロジェクト設定を確認
3. 環境変数を確認
4. プロジェクトを再作成

### 問題: デプロイが繰り返し失敗する

**原因**: プロジェクト設定に問題がある

**解決方法**:
1. プロジェクトを削除して再作成
2. Vercelサポートに問い合わせ

## 確認手順

1. ✅ プロジェクト設定を確認
2. ✅ ビルドコマンドが正しく設定されているか確認
3. ✅ 環境変数が正しく設定されているか確認
4. ✅ ビルドログを確認
5. ✅ 再デプロイを実行

## 参考リンク

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Vercelトラブルシューティング](https://vercel.com/docs/troubleshooting)

