@echo off
chcp 65001 >nul
title Vercel完全公開モードデプロイ
color 0A

echo.
echo ========================================
echo   Vercel完全公開モードデプロイ
echo ========================================
echo.

cd /d "%~dp0"
echo 作業ディレクトリ: %CD%
echo.

echo [ステップ1/4] 依存関係の確認...
if not exist node_modules (
    echo node_modulesが見つかりません。インストールを開始します...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [エラー] npm installに失敗しました
        pause
        exit /b 1
    )
) else (
    echo [OK] node_modulesが存在します
)
echo.

echo [ステップ2/4] ビルドテストを実行中...
echo この処理には数分かかる場合があります...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [エラー] ビルドに失敗しました
    echo エラーを確認してから再実行してください
    pause
    exit /b 1
)
echo [OK] ビルドが成功しました
echo.

echo [ステップ3/4] Vercel CLIの確認...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [情報] Vercel CLIがインストールされていません
    echo Vercel CLIをインストールしますか？ (Y/N)
    set /p install_vercel=
    if /i "%install_vercel%"=="Y" (
        echo Vercel CLIをインストール中...
        call npm install -g vercel
        if %ERRORLEVEL% NEQ 0 (
            echo [エラー] Vercel CLIのインストールに失敗しました
            echo 手動でインストールしてください: npm install -g vercel
            pause
            exit /b 1
        )
        echo [OK] Vercel CLIのインストールが完了しました
    ) else (
        echo [情報] Vercel CLIのインストールをスキップしました
        echo.
        echo 代替方法: Vercelダッシュボード（https://vercel.com）で手動デプロイ
        echo   1. GitHubリポジトリを連携
        echo   2. Root Directory を "frontend" に設定
        echo   3. 環境変数 NEXT_PUBLIC_USE_MOCK_DATA=true を追加
        echo   4. デプロイを実行
        pause
        exit /b 0
    )
) else (
    echo [OK] Vercel CLIがインストールされています
)
echo.

echo [ステップ4/4] Vercelにデプロイ中...
echo.
echo ========================================
echo   重要: デプロイ後の設定
echo ========================================
echo.
echo デプロイが完了したら、Vercelダッシュボードで以下を設定してください:
echo.
echo   1. https://vercel.com/dashboard にアクセス
echo   2. デプロイしたプロジェクトを選択
echo   3. Settings ^> Environment Variables
echo   4. 以下を追加:
echo      Name: NEXT_PUBLIC_USE_MOCK_DATA
echo      Value: true
echo      Environment: Production, Preview, Development すべて
echo   5. Save をクリック
echo   6. Deployments タブで最新のデプロイを選択
echo   7. Redeploy をクリック
echo.
echo ========================================
echo.
echo デプロイを開始します...
echo.

vercel --prod --yes
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [エラー] デプロイに失敗しました
    echo.
    echo トラブルシューティング:
    echo   1. vercel login でログインしているか確認
    echo   2. Vercelダッシュボードで手動デプロイを試す
    echo   3. エラーログを確認
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   デプロイが完了しました！
echo ========================================
echo.
echo 次のステップ:
echo   1. 上記の「重要: デプロイ後の設定」を実行してください
echo   2. デプロイURLにアクセスして動作確認
echo.
echo デプロイURLは上記のコマンド出力に表示されています。
echo.

pause

