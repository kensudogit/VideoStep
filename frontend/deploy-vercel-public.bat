@echo off
chcp 65001 >nul
echo ========================================
echo VideoStep Frontend - Vercel完全公開モードデプロイ
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

echo [1/6] Vercel CLIのバージョンを確認...
vercel --version
echo.

echo [2/6] ログイン状態を確認...
vercel whoami
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] ログインが必要です。ブラウザが開きます...
    vercel login
)
echo.

echo [3/6] 完全公開モードの設定確認...
echo.
echo 完全公開モードでは以下の設定が適用されます:
echo   - Mockデータを使用（バックエンドAPI不要）
echo   - 認証なしでアクセス可能
echo   - すべてのコンテンツが公開
echo.
echo 環境変数の設定:
echo   - NEXT_PUBLIC_USE_MOCK_DATA=true （Mockデータを強制使用）
echo   - NEXT_PUBLIC_API_BASE_URL は設定しない（または削除）
echo.
echo [重要] 環境変数 NEXT_PUBLIC_USE_MOCK_DATA=true を設定します...
vercel env add NEXT_PUBLIC_USE_MOCK_DATA production preview development <<< true 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] 環境変数の自動設定に失敗しました
    echo 手動で設定してください:
    echo   vercel env add NEXT_PUBLIC_USE_MOCK_DATA
    echo   値: true
    echo   環境: production, preview, development すべて
    echo.
) else (
    echo [OK] 環境変数 NEXT_PUBLIC_USE_MOCK_DATA=true を設定しました
)
echo.

REM 環境変数の確認
echo [4/6] 環境変数の確認...
vercel env ls >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 現在の環境変数を確認中...
    vercel env ls
    echo.
    echo 注意: NEXT_PUBLIC_API_BASE_URL が設定されている場合は削除してください
    echo 削除方法: vercel env rm NEXT_PUBLIC_API_BASE_URL production
    echo.
) else (
    echo 環境変数の確認に失敗しました。続行します...
    echo.
)

echo [5/6] ビルドのテスト...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ビルドに失敗しました。エラーを確認してください。
    pause
    exit /b 1
)
echo [OK] ビルド成功
echo.

echo [6/6] Vercelにデプロイ...
echo.
echo 本番環境に完全公開モードでデプロイします。
echo デプロイ後、誰でもアクセス可能になります。
echo.
set /p deploy="本番環境にデプロイしますか? (y/n): "
if /i "%deploy%"=="y" (
    echo.
    echo デプロイを開始します...
    vercel --prod --yes
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo [SUCCESS] デプロイが完了しました！
        echo ========================================
        echo.
        echo デプロイURLを確認するには:
        echo   vercel ls
        echo.
        echo または、Vercelダッシュボードで確認してください:
        echo   https://vercel.com/dashboard
        echo.
    ) else (
        echo.
        echo [ERROR] デプロイに失敗しました。
        echo エラーログを確認してください。
        pause
        exit /b 1
    )
) else (
    echo プレビューデプロイを実行します...
    vercel --yes
)
echo.

pause

