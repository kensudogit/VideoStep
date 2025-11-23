@echo off
echo ========================================
echo VideoStep Frontend - Vercel Deploy
echo ========================================
echo.

REM Vercel CLIがインストールされているか確認
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLIがインストールされていません。
    echo 以下のコマンドでインストールしてください:
    echo npm install -g vercel
    pause
    exit /b 1
)

echo [1/5] Vercel CLIのバージョンを確認...
vercel --version
echo.

echo [2/5] ログイン状態を確認...
vercel whoami
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] ログインが必要です。ブラウザが開きます...
    vercel login
)
echo.

echo [3/5] 環境変数の確認...
echo 以下の環境変数が設定されているか確認してください:
echo   - NEXT_PUBLIC_API_BASE_URL
echo   - NEXT_PUBLIC_USE_MOCK_DATA (オプション)
echo.
set /p confirm="環境変数を設定しましたか? (y/n): "
if /i not "%confirm%"=="y" (
    echo.
    echo 環境変数を設定するには:
    echo   vercel env add NEXT_PUBLIC_API_BASE_URL production
    echo.
    set /p continue="続行しますか? (y/n): "
    if /i not "%continue%"=="y" (
        exit /b 0
    )
)
echo.

echo [4/5] ビルドのテスト...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ビルドに失敗しました。エラーを確認してください。
    pause
    exit /b 1
)
echo.

echo [5/5] Vercelにデプロイ...
echo 本番環境にデプロイしますか? (y/n)
set /p deploy="> "
if /i "%deploy%"=="y" (
    vercel --prod
) else (
    echo プレビューデプロイを実行します...
    vercel
)
echo.

echo ========================================
echo デプロイが完了しました！
echo ========================================
pause

