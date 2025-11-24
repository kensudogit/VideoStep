@echo off
chcp 65001 >nul
echo ========================================
echo Next.js開発サーバー修正スクリプト
echo ========================================
echo.

echo [1/4] 開発サーバーを停止してください（Ctrl+C）
echo 停止したら、何かキーを押してください...
pause >nul
echo.

echo [2/4] キャッシュとビルドファイルを削除中...
if exist .next (
    echo .nextディレクトリを削除中...
    rmdir /s /q .next
    echo .nextディレクトリを削除しました
) else (
    echo .nextディレクトリは存在しません
)

if exist node_modules\.cache (
    echo node_modules\.cacheを削除中...
    rmdir /s /q node_modules\.cache
    echo node_modules\.cacheを削除しました
)

if exist .turbo (
    echo .turboディレクトリを削除中...
    rmdir /s /q .turbo
    echo .turboディレクトリを削除しました
)
echo.

echo [3/4] 依存関係を再インストール中...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm installに失敗しました
    pause
    exit /b 1
)
echo.

echo [4/4] 開発サーバーを起動します...
echo.
echo 開発サーバーが起動したら、ブラウザで http://localhost:3000 にアクセスしてください
echo 停止する場合は Ctrl+C を押してください
echo.
call npm run dev

pause

