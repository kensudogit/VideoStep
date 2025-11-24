# Next.js開発サーバー修正 - 実行手順

## 問題

静的ファイル（CSS、JavaScript）が404エラーになっている

## 修正手順

### ステップ1: 開発サーバーを停止
現在実行中の`npm run dev`を停止（Ctrl+C）

### ステップ2: 修正スクリプトを実行

```bash
cd C:\devlop\VideoStep\frontend
fix-static-files.bat
```

このスクリプトが以下を自動実行します：
1. `.next`ディレクトリを削除
2. キャッシュを削除
3. 依存関係を再インストール
4. ビルドテスト
5. 開発サーバーを起動

### ステップ3: ブラウザで確認

1. ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）
2. ハードリロード（Ctrl+F5）
3. http://localhost:3000 にアクセス

## 手動で修正する場合

```bash
cd C:\devlop\VideoStep\frontend

# 1. 開発サーバーを停止（Ctrl+C）

# 2. .nextディレクトリを削除
rmdir /s /q .next

# 3. キャッシュを削除
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q .turbo 2>nul

# 4. 依存関係を再インストール
npm install

# 5. 開発サーバーを再起動
npm run dev
```

## 確認事項

修正後、以下を確認：
- ✅ CSSが正しく読み込まれる
- ✅ JavaScriptが正しく読み込まれる
- ✅ ページが正常に表示される
- ✅ エラーが表示されない

## トラブルシューティング

まだエラーが発生する場合：
1. ブラウザを完全に閉じて再起動
2. 別のブラウザで試す
3. プライベートブラウジングモードで試す

