@echo off
echo ========================================
echo Vercel完全公開モードデプロイスクリプト
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 依存関係のインストール...
call npm install
if errorlevel 1 (
    echo エラー: 依存関係のインストールに失敗しました
    pause
    exit /b 1
)

echo.
echo [2/4] ビルドの実行...
call npm run build
if errorlevel 1 (
    echo エラー: ビルドに失敗しました
    pause
    exit /b 1
)

echo.
echo [3/4] Vercel CLIの確認...
where vercel >nul 2>&1
if errorlevel 1 (
    echo Vercel CLIが見つかりません。インストールします...
    call npm install -g vercel
    if errorlevel 1 (
        echo エラー: Vercel CLIのインストールに失敗しました
        pause
        exit /b 1
    )
)

echo.
echo [4/4] Vercelにデプロイ...
echo 注意: 初回デプロイ時はログインが必要です
vercel --prod
if errorlevel 1 (
    echo エラー: デプロイに失敗しました
    pause
    exit /b 1
)

echo.
echo ========================================
echo デプロイが完了しました！
echo ========================================
echo.
echo 次のステップ:
echo 1. Vercelダッシュボードで環境変数を設定してください
echo 2. NEXT_PUBLIC_API_BASE_URLをRailwayのAPI Gateway URLに設定してください
echo 3. デプロイされたURLにアクセスして動作を確認してください
echo.
pause
