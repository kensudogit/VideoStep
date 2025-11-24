# Next.js開発サーバー404エラー 即座の修正手順

## エラー内容

```
Refused to apply style from 'http://localhost:3000/_next/static/css/app/layout.css' because its MIME type ('text/html') is not a supported stylesheet MIME type
GET http://localhost:3000/_next/static/chunks/main-app.js net::ERR_ABORTED 404 (Not Found)
```

## 即座の修正手順

### 方法1: 自動修正スクリプトを使用（推奨）

```bash
cd C:\devlop\VideoStep\frontend
fix-dev-server.bat
```

### 方法2: 手動で修正

#### ステップ1: 開発サーバーを停止
現在実行中の`npm run dev`を停止（Ctrl+C）

#### ステップ2: キャッシュをクリーンアップ
```bash
cd C:\devlop\VideoStep\frontend

# .nextディレクトリを削除
rmdir /s /q .next

# キャッシュを削除
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q .turbo 2>nul
```

#### ステップ3: 依存関係を再インストール
```bash
npm install
```

#### ステップ4: 開発サーバーを再起動
```bash
npm run dev
```

#### ステップ5: ブラウザで確認
1. ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）
2. ハードリロード（Ctrl+F5）
3. http://localhost:3000 にアクセス

## 完全なクリーンアップ（上記で解決しない場合）

```bash
cd C:\devlop\VideoStep\frontend

# すべてのキャッシュとビルドファイルを削除
rmdir /s /q .next
rmdir /s /q node_modules
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q .turbo 2>nul

# package-lock.jsonを削除
del package-lock.json

# 依存関係を再インストール
npm install

# 開発サーバーを起動
npm run dev
```

## 確認事項

### 1. ポート3000が使用中でないか確認
```bash
netstat -ano | findstr :3000
```

別のプロセスが使用している場合、そのプロセスを終了するか、別のポートを使用：
```bash
npm run dev -- -p 3001
```

### 2. Node.jsのバージョンを確認
```bash
node --version
```
Node.js 18以上が必要です。

### 3. ビルドが成功するか確認
```bash
npm run build
```

## よくある問題と解決策

### 問題: まだ404エラーが発生する

**解決方法**:
1. ブラウザを完全に閉じて再起動
2. 別のブラウザで試す
3. プライベートブラウジングモードで試す

### 問題: 開発サーバーが起動しない

**解決方法**:
1. 管理者権限でコマンドプロンプトを開く
2. `node_modules`を完全に削除して再インストール
3. Node.jsを再インストール

### 問題: ビルドエラーが発生する

**解決方法**:
1. TypeScriptのエラーを確認: `npm run lint`
2. 依存関係のバージョンを確認
3. `npm audit fix`を実行

## まとめ

1. ✅ 開発サーバーを停止
2. ✅ `.next`ディレクトリを削除
3. ✅ `npm install`を実行
4. ✅ `npm run dev`で再起動
5. ✅ ブラウザのキャッシュをクリア

これで静的ファイルの404エラーが解決されます！

