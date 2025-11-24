@echo off
chcp 65001 >nul
echo ========================================
echo Next.js静的ファイル404エラー修正
echo ========================================
echo.

echo [重要] まず、開発サーバーを停止してください（Ctrl+C）
echo 停止したら、Enterキーを押してください...
pause >nul
echo.

echo [1/5] .nextディレクトリを削除中...
if exist .next (
    rmdir /s /q .next
    echo [OK] .nextディレクトリを削除しました
) else (
    echo [INFO] .nextディレクトリは存在しません
)
echo.

echo [2/5] キャッシュディレクトリを削除中...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo [OK] node_modules\.cacheを削除しました
) else (
    echo [INFO] node_modules\.cacheは存在しません
)

if exist .turbo (
    rmdir /s /q .turbo
    echo [OK] .turboディレクトリを削除しました
) else (
    echo [INFO] .turboディレクトリは存在しません
)
echo.

echo [3/5] 依存関係を再インストール中...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm installに失敗しました
    pause
    exit /b 1
)
echo [OK] 依存関係のインストールが完了しました
echo.

echo [4/5] ビルドテストを実行中...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] ビルドに警告がありますが、続行します...
) else (
    echo [OK] ビルドが成功しました
)
echo.

echo [5/5] 開発サーバーを起動します...
echo.
echo ========================================
echo 開発サーバーが起動したら:
echo   1. ブラウザで http://localhost:3000 にアクセス
echo   2. ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）
echo   3. ハードリロード（Ctrl+F5）
echo.
echo 停止する場合は Ctrl+C を押してください
echo ========================================
echo.

call npm run dev

pause

