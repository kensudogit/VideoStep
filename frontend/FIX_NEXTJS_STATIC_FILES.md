# Next.js静的ファイル404エラー修正ガイド

## エラーの症状

```
Refused to apply style from 'http://localhost:3000/_next/static/css/app/layout.css' because its MIME type ('text/html') is not a supported stylesheet MIME type
GET http://localhost:3000/_next/static/chunks/main-app.js net::ERR_ABORTED 404 (Not Found)
```

## 原因

Next.jsの開発サーバーが静的ファイル（CSS、JavaScript）を見つけられない状態です。通常、以下の原因が考えられます：

1. `.next`ディレクトリが存在しない、または破損している
2. 開発サーバーが正しく起動していない
3. ビルドキャッシュの問題
4. `node_modules`が正しくインストールされていない

## 解決方法

### ステップ1: 開発サーバーを停止

現在実行中の開発サーバーを停止してください（Ctrl+C）

### ステップ2: キャッシュとビルドファイルをクリーンアップ

```bash
cd C:\devlop\VideoStep\frontend

# .nextディレクトリを削除
rmdir /s /q .next

# node_modules/.cacheを削除（存在する場合）
if exist node_modules\.cache rmdir /s /q node_modules\.cache

# package-lock.jsonを削除（オプション）
# del package-lock.json
```

### ステップ3: 依存関係を再インストール

```bash
npm install
```

### ステップ4: 開発サーバーを再起動

```bash
npm run dev
```

## 完全なクリーンアップ手順（上記で解決しない場合）

### Windows (CMD)

```bash
cd C:\devlop\VideoStep\frontend

# 1. 開発サーバーを停止

# 2. キャッシュとビルドファイルを削除
rmdir /s /q .next
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q .turbo 2>nul

# 3. node_modulesを削除して再インストール
rmdir /s /q node_modules
del package-lock.json
npm install

# 4. 開発サーバーを起動
npm run dev
```

### Windows (PowerShell)

```powershell
cd C:\devlop\VideoStep\frontend

# 1. 開発サーバーを停止

# 2. キャッシュとビルドファイルを削除
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .turbo -ErrorAction SilentlyContinue

# 3. node_modulesを削除して再インストール
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install

# 4. 開発サーバーを起動
npm run dev
```

## その他の確認事項

### 1. ポート3000が使用中でないか確認

```bash
netstat -ano | findstr :3000
```

別のプロセスがポート3000を使用している場合、そのプロセスを終了するか、別のポートを使用：

```bash
npm run dev -- -p 3001
```

### 2. Next.jsのバージョンを確認

```bash
npm list next
```

Next.js 14.0.0がインストールされていることを確認

### 3. TypeScriptのエラーを確認

```bash
npm run build
```

ビルドエラーがないか確認

### 4. next.config.jsの設定を確認

`next.config.js`に問題がないか確認：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // ...
}
```

## トラブルシューティング

### 問題: まだ404エラーが発生する

**解決方法**:
1. ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）
2. ハードリロード（Ctrl+F5）
3. 別のブラウザで試す

### 問題: 開発サーバーが起動しない

**解決方法**:
1. Node.jsのバージョンを確認（18以上が必要）
2. `node_modules`を完全に削除して再インストール
3. 管理者権限で実行

### 問題: ビルドエラーが発生する

**解決方法**:
1. TypeScriptのエラーを確認
2. 依存関係のバージョンを確認
3. `npm audit fix`を実行

## 予防策

### .gitignoreの確認

`.next`ディレクトリが`.gitignore`に含まれていることを確認：

```
.next
node_modules
```

### 開発環境の統一

チームで開発する場合、`package-lock.json`をコミットして、同じバージョンの依存関係を使用

## まとめ

1. ✅ 開発サーバーを停止
2. ✅ `.next`ディレクトリを削除
3. ✅ `node_modules`を再インストール
4. ✅ 開発サーバーを再起動

これで静的ファイルの404エラーが解決されるはずです。

