@echo off
chcp 65001 >nul
echo ========================================
echo Vercel完全公開モードデプロイ（Mockデータ有効）
echo ========================================
echo.

echo [重要] このスクリプトは以下を実行します:
echo   1. ビルドテスト
echo   2. Vercelへのデプロイ（完全公開モード）
echo   3. Mockデータを有効化
echo.

echo 続行しますか？ (Y/N)
set /p confirm=
if /i not "%confirm%"=="Y" (
    echo デプロイをキャンセルしました
    pause
    exit /b 0
)
echo.

echo [1/4] 依存関係の確認中...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm installに失敗しました
    pause
    exit /b 1
)
echo [OK] 依存関係の確認が完了しました
echo.

echo [2/4] ビルドテストを実行中...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ビルドに失敗しました。エラーを確認してください
    pause
    exit /b 1
)
echo [OK] ビルドが成功しました
echo.

echo [3/4] Vercel CLIの確認中...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Vercel CLIがインストールされていません
    echo Vercel CLIをインストールしますか？ (Y/N)
    set /p install_cli=
    if /i "%install_cli%"=="Y" (
        echo Vercel CLIをインストール中...
        call npm install -g vercel
        if %ERRORLEVEL% NEQ 0 (
            echo [ERROR] Vercel CLIのインストールに失敗しました
            pause
            exit /b 1
        )
        echo [OK] Vercel CLIのインストールが完了しました
    ) else (
        echo [INFO] Vercel CLIのインストールをスキップしました
        echo GitHub経由でデプロイする場合は、Vercelダッシュボードで設定してください
        pause
        exit /b 0
    )
)
echo.

echo [4/4] Vercelにデプロイ中...
echo.
echo [重要] デプロイ後、Vercelダッシュボードで以下を設定してください:
echo   - Production環境変数: NEXT_PUBLIC_USE_MOCK_DATA=true
echo   - Preview環境変数: NEXT_PUBLIC_USE_MOCK_DATA=true
echo   - Development環境変数: NEXT_PUBLIC_USE_MOCK_DATA=true
echo.
echo 設定方法:
echo   1. https://vercel.com/dashboard にアクセス
echo   2. プロジェクトを選択
echo   3. Settings ^> Environment Variables
echo   4. NEXT_PUBLIC_USE_MOCK_DATA=true を追加（全環境）
echo   5. 再デプロイ
echo.
echo Vercel CLIでデプロイを開始します...
echo.

vercel --prod --yes
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercelデプロイに失敗しました
    echo.
    echo 代替方法:
    echo   1. Vercelダッシュボード（https://vercel.com）にログイン
    echo   2. プロジェクトをインポートまたは作成
    echo   3. Root Directory を "frontend" に設定
    echo   4. 環境変数に NEXT_PUBLIC_USE_MOCK_DATA=true を追加
    echo   5. デプロイを実行
    pause
    exit /b 1
)

echo.
echo ========================================
echo デプロイが完了しました！
echo ========================================
echo.
echo 次のステップ:
echo   1. Vercelダッシュボードで環境変数を確認:
echo      NEXT_PUBLIC_USE_MOCK_DATA=true
echo.
echo   2. デプロイされたURLにアクセスして動作確認
echo.
echo   3. ブラウザの開発者ツール（F12）で以下を確認:
echo      [Mock Data] で始まるログが表示されれば成功
echo.

pause

