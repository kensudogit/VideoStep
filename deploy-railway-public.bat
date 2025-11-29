@echo off
REM Railway完全公開モードデプロイスクリプト
REM このスクリプトはすべてのサービスをRailwayにデプロイします

echo ========================================
echo Railway完全公開モードデプロイ
echo ========================================
echo.

REM Railway CLIがインストールされているか確認
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo Railway CLIがインストールされていません。
    echo インストール: npm install -g @railway/cli
    pause
    exit /b 1
)

echo Railway CLIのバージョンを確認...
railway --version
echo.

echo ログイン状態を確認...
railway whoami
if %errorlevel% neq 0 (
    echo Railwayにログインしてください
    railway login
)

echo.
echo ========================================
echo デプロイ手順:
echo ========================================
echo 1. 各サービスを個別にRailwayプロジェクトにリンクする必要があります
echo 2. Railwayダッシュボードで各サービスを作成してください
echo 3. 各サービスのディレクトリで以下のコマンドを実行:
echo    - railway link [プロジェクトID]
echo    - railway up
echo.
echo 詳細は RAILWAY_PUBLIC_DEPLOY.md を参照してください
echo.

pause

