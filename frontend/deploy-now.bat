@echo off
chcp 65001 >nul
echo ========================================
echo Vercel完全公開モードデプロイ
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] ビルドテストを実行中...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ビルドに失敗しました
    pause
    exit /b 1
)
echo [OK] ビルド成功
echo.

echo [2/3] Vercel CLIの確認...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Vercel CLIをインストール中...
    call npm install -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Vercel CLIのインストールに失敗しました
        echo 手動でインストール: npm install -g vercel
        pause
        exit /b 1
    )
)
echo [OK] Vercel CLI準備完了
echo.

echo [3/3] Vercelにデプロイ中...
echo.
echo [重要] デプロイ後、Vercelダッシュボードで以下を設定してください:
echo   - Settings ^> Environment Variables
echo   - Name: NEXT_PUBLIC_USE_MOCK_DATA
echo   - Value: true
echo   - Environment: Production, Preview, Development すべて
echo   - 再デプロイを実行
echo.
vercel --prod --yes
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] デプロイに失敗しました
    echo.
    echo 代替方法: Vercelダッシュボード（https://vercel.com）で手動デプロイ
    pause
    exit /b 1
)

echo.
echo ========================================
echo デプロイが完了しました！
echo ========================================
echo.
echo 次のステップ:
echo   1. Vercelダッシュボード: https://vercel.com/dashboard
echo   2. プロジェクトを選択
echo   3. Settings ^> Environment Variables
echo   4. NEXT_PUBLIC_USE_MOCK_DATA=true を追加（全環境）
echo   5. 再デプロイ
echo.

pause

