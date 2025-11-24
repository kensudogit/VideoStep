# Next.js静的ファイル404エラー 即座の修正

## 問題

```
Refused to apply style from 'http://localhost:3000/_next/static/css/app/layout.css' because its MIME type ('text/html') is not a supported stylesheet MIME type
GET http://localhost:3000/_next/static/chunks/main-app.js net::ERR_ABORTED 404 (Not Found)
```

## 即座の修正（3ステップ）

### ステップ1: 開発サーバーを停止
現在実行中の`npm run dev`を停止（Ctrl+C）

### ステップ2: 修正スクリプトを実行
```bash
cd C:\devlop\VideoStep\frontend
fix-static-files.bat
```

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

# 3. 依存関係を再インストール
npm install

# 4. 開発サーバーを再起動
npm run dev
```

## 原因

Next.jsの開発サーバーが静的ファイル（CSS、JavaScript）を正しく配信できていない状態です。通常、`.next`ディレクトリが破損しているか、ビルドが完了していないことが原因です。

## 解決方法

1. `.next`ディレクトリを削除
2. 依存関係を再インストール
3. 開発サーバーを再起動

これで問題が解決されます！

