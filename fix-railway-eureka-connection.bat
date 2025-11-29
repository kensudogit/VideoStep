@echo off
REM Railway Eureka接続エラー修正スクリプト

echo ========================================
echo Railway Eureka接続エラー修正
echo ========================================
echo.

cd C:\devlop\VideoStep

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
echo 重要: Service RegistryのパブリックURLを確認してください
echo ========================================
echo.
echo 1. RailwayダッシュボードでService Registryサービスを開く
echo 2. Settings -^> Networking でパブリックURLを確認
echo 3. 以下の形式のURLをコピーしてください:
echo    https://service-registry-production.up.railway.app
echo.
set /p SERVICE_REGISTRY_URL="Service RegistryのパブリックURLを入力してください（例: https://service-registry-production.up.railway.app）: "

if "%SERVICE_REGISTRY_URL%"=="" (
    echo エラー: Service RegistryのURLが入力されていません
    pause
    exit /b 1
)

echo.
echo Service Registry URL: %SERVICE_REGISTRY_URL%
echo.
set /p confirm="このURLで続行しますか？ (y/n): "
if /i not "%confirm%"=="y" (
    echo キャンセルしました
    pause
    exit /b 1
)

echo.
echo ========================================
echo 環境変数を設定します
echo ========================================
echo.

set EUREKA_URL=%SERVICE_REGISTRY_URL%/eureka/

echo Eureka URL: %EUREKA_URL%
echo.

echo Video Serviceの環境変数を設定中...
railway service video-service 2>nul
if %errorlevel% equ 0 (
    railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=%EUREKA_URL%
    railway variables set EUREKA_CLIENT_ENABLED=true
    railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
    railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true
    echo Video Service: 環境変数を設定しました
) else (
    echo Video Service: サービスが見つかりません。Railwayダッシュボードで手動で設定してください。
)

echo.
echo Auth Serviceの環境変数を設定中...
railway service auth-service 2>nul
if %errorlevel% equ 0 (
    railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=%EUREKA_URL%
    railway variables set EUREKA_CLIENT_ENABLED=true
    railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
    railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true
    echo Auth Service: 環境変数を設定しました
) else (
    echo Auth Service: サービスが見つかりません。Railwayダッシュボードで手動で設定してください。
)

echo.
echo User Serviceの環境変数を設定中...
railway service user-service 2>nul
if %errorlevel% equ 0 (
    railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=%EUREKA_URL%
    railway variables set EUREKA_CLIENT_ENABLED=true
    railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
    railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true
    echo User Service: 環境変数を設定しました
) else (
    echo User Service: サービスが見つかりません。Railwayダッシュボードで手動で設定してください。
)

echo.
echo Translation Serviceの環境変数を設定中...
railway service translation-service 2>nul
if %errorlevel% equ 0 (
    railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=%EUREKA_URL%
    railway variables set EUREKA_CLIENT_ENABLED=true
    railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
    railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true
    echo Translation Service: 環境変数を設定しました
) else (
    echo Translation Service: サービスが見つかりません。Railwayダッシュボードで手動で設定してください。
)

echo.
echo Editing Serviceの環境変数を設定中...
railway service editing-service 2>nul
if %errorlevel% equ 0 (
    railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=%EUREKA_URL%
    railway variables set EUREKA_CLIENT_ENABLED=true
    railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
    railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true
    echo Editing Service: 環境変数を設定しました
) else (
    echo Editing Service: サービスが見つかりません。Railwayダッシュボードで手動で設定してください。
)

echo.
echo API Gatewayの環境変数を設定中...
railway service api-gateway 2>nul
if %errorlevel% equ 0 (
    railway variables set EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=%EUREKA_URL%
    railway variables set EUREKA_CLIENT_ENABLED=true
    railway variables set EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
    railway variables set EUREKA_CLIENT_FETCH_REGISTRY=true
    echo API Gateway: 環境変数を設定しました
) else (
    echo API Gateway: サービスが見つかりません。Railwayダッシュボードで手動で設定してください。
)

echo.
echo ========================================
echo 環境変数の設定が完了しました
echo ========================================
echo.
echo 次のステップ:
echo 1. Railwayダッシュボードで各サービスを再デプロイしてください
echo 2. Service Registryのダッシュボードで各サービスが登録されているか確認してください
echo 3. 各サービスのログでエラーが解消されているか確認してください
echo.
echo 詳細は RAILWAY_EUREKA_CONNECTION_FIX.md を参照してください
echo.
pause

