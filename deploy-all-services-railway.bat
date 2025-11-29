@echo off
REM Railway全サービス完全公開モードデプロイスクリプト
REM このスクリプトはすべてのサービスをRailwayにデプロイします

echo ========================================
echo Railway完全公開モードデプロイ - 全サービス
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
    if %errorlevel% neq 0 (
        echo ログインに失敗しました
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo デプロイ手順
echo ========================================
echo.
echo Railwayでは、各サービスを個別のサービスとして作成する必要があります。
echo 以下の手順でデプロイを進めてください:
echo.
echo 方法1: Railwayダッシュボードで手動デプロイ（推奨）
echo   1. railway open でダッシュボードを開く
echo   2. 各サービスを個別に「New Service」→「GitHub Repo」で追加
echo   3. 各サービスのrailway.tomlが自動的に検出されます
echo   4. 環境変数を設定
echo   5. デプロイ
echo.
echo 方法2: Railway CLIでサービスを追加（対話モード）
echo   各サービスのディレクトリで以下を実行:
echo   railway add --service [サービス名]
echo   railway up
echo.
echo ========================================
echo デプロイ順序（重要）
echo ========================================
echo 1. Service Registry（最初にデプロイ）
echo 2. MySQL Databases（各サービス用）
echo 3. Auth Service
echo 4. User Service
echo 5. Video Service
echo 6. Translation Service
echo 7. Editing Service
echo 8. API Gateway（最後にデプロイ）
echo.
echo ========================================
echo 各サービスの環境変数設定
echo ========================================
echo.
echo Service Registry: 環境変数不要
echo.
echo Auth Service:
echo   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_auth?useSSL=true
echo   SPRING_DATASOURCE_USERNAME=[ユーザー名]
echo   SPRING_DATASOURCE_PASSWORD=[パスワード]
echo   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
echo   OPENAI_API_KEY=[あなたのOpenAI APIキー]
echo.
echo Video Service:
echo   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_video?useSSL=true
echo   SPRING_DATASOURCE_USERNAME=[ユーザー名]
echo   SPRING_DATASOURCE_PASSWORD=[パスワード]
echo   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
echo   OPENAI_API_KEY=[あなたのOpenAI APIキー]
echo.
echo Translation Service:
echo   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_translation?useSSL=true
echo   SPRING_DATASOURCE_USERNAME=[ユーザー名]
echo   SPRING_DATASOURCE_PASSWORD=[パスワード]
echo   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
echo   OPENAI_API_KEY=[あなたのOpenAI APIキー]
echo.
echo Editing Service:
echo   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_editing?useSSL=true
echo   SPRING_DATASOURCE_USERNAME=[ユーザー名]
echo   SPRING_DATASOURCE_PASSWORD=[パスワード]
echo   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
echo   OPENAI_API_KEY=[あなたのOpenAI APIキー]
echo.
echo User Service:
echo   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/videostep_user?useSSL=true
echo   SPRING_DATASOURCE_USERNAME=[ユーザー名]
echo   SPRING_DATASOURCE_PASSWORD=[パスワード]
echo   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
echo   OPENAI_API_KEY=[あなたのOpenAI APIキー]
echo.
echo API Gateway:
echo   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production.up.railway.app/eureka/
echo.
echo ========================================
echo Railwayダッシュボードを開きますか？
echo ========================================
echo.
set /p open_dashboard="ダッシュボードを開きますか？ (y/n): "
if /i "%open_dashboard%"=="y" (
    echo Railwayダッシュボードを開いています...
    start https://railway.app/dashboard
)

echo.
echo 詳細は RAILWAY_PUBLIC_DEPLOY.md を参照してください
echo.
pause

