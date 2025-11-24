# Next.jsアンインストール手順

## 注意事項

⚠️ **警告**: Next.jsをアンインストールすると、フロントエンドアプリケーションが動作しなくなります。

フロントエンド全体がNext.jsで構築されているため、以下の影響があります：
- すべてのページが動作しなくなる
- ビルドが実行できなくなる
- Vercelへのデプロイができなくなる

## アンインストール手順

### ステップ1: Next.jsパッケージをアンインストール

```bash
cd C:\devlop\VideoStep\frontend
npm uninstall next eslint-config-next
```

### ステップ2: Next.js関連の設定ファイルを削除

以下のファイルを削除：
- `next.config.js`
- `next-env.d.ts`
- `.next/` (ビルド成果物)
- `vercel.json` (Next.js用の設定)

### ステップ3: package.jsonからNext.js関連のスクリプトを削除

以下のスクリプトを削除：
- `"dev": "next dev"`
- `"build": "next build"`
- `"start": "next start"`
- `"lint": "next lint"`

## 代替案

Next.jsを維持しつつ、問題を解決する方法：

1. **開発環境の問題を修正**
   - `.next`ディレクトリを削除して再ビルド
   - 依存関係を再インストール

2. **別のフレームワークに移行**
   - Vite + React
   - Create React App
   - Remix

3. **シンプルなHTML/CSS/JavaScriptに移行**
   - 静的サイトとして構築

## 実行前の確認

Next.jsをアンインストールする前に、以下を確認してください：

1. ✅ フロントエンドのバックアップを取得
2. ✅ 別のフレームワークへの移行計画がある
3. ✅ アンインストール後の対応策を準備

