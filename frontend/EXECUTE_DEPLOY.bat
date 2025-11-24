@echo off
chcp 65001 >nul
echo ========================================
echo Vercel完全公開モードデプロイ実行
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] 現在のディレクトリを確認...
cd
echo 作業ディレクトリ: %CD%
echo.

echo [2/5] 依存関係を確認中...
if not exist node_modules (
    echo node_modulesが見つかりません。インストールを開始します...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm installに失敗しました
        pause
        exit /b 1
    )
) else (
    echo [OK] node_modulesが存在します
)
echo.

echo [3/5] ビルドテストを実行中...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ビルドに失敗しました
    echo エラーを確認してから再実行してください
    pause
    exit /b 1
)
echo [OK] ビルドが成功しました
echo.

echo [4/5] Vercel CLIの確認...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Vercel CLIがインストールされていません
    echo.
    echo Vercel CLIをインストールしますか？ (Y/N)
    set /p install_vercel=
    if /i "%install_vercel%"=="Y" (
        echo Vercel CLIをインストール中...
        call npm install -g vercel
        if %ERRORLEVEL% NEQ 0 (
            echo [ERROR] Vercel CLIのインストールに失敗しました
            echo 手動でインストールしてください: npm install -g vercel
            pause
            exit /b 1
        )
        echo [OK] Vercel CLIのインストールが完了しました
    ) else (
        echo [INFO] Vercel CLIのインストールをスキップしました
        echo.
        echo 代替方法: Vercelダッシュボード（https://vercel.com）で手動デプロイ
        echo   1. GitHubリポジトリを連携
        echo   2. Root Directory を "frontend" に設定
        echo   3. 環境変数 NEXT_PUBLIC_USE_MOCK_DATA=true を追加
        echo   4. デプロイを実行
        pause
        exit /b 0
    )
)
echo.

echo [5/5] Vercelにデプロイ中...
echo.
echo ========================================
echo デプロイ設定
echo ========================================
echo - モード: 完全公開（Production）
echo - Mockデータ: 有効（環境変数設定が必要）
echo.
echo [重要] デプロイ後、Vercelダッシュボードで以下を設定してください:
echo   環境変数: NEXT_PUBLIC_USE_MOCK_DATA=true
echo   （Production, Preview, Development すべて）
echo.
echo デプロイを開始します...
echo.

vercel --prod
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] デプロイに失敗しました
    echo.
    echo トラブルシューティング:
    echo   1. vercel login でログインしているか確認
    echo   2. Vercelダッシュボードで手動デプロイを試す
    echo   3. エラーログを確認
    pause
    exit /b 1
)

echo.
echo ========================================
echo デプロイが完了しました！
echo ========================================
echo.
echo 次のステップ:
echo   1. Vercelダッシュボードにアクセス: https://vercel.com/dashboard
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
echo デプロイURLは上記のコマンド出力に表示されています。
echo.

pause

