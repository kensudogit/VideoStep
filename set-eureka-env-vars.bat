@echo off
REM Railway Eureka環境変数設定スクリプト

echo ========================================
echo Railway Eureka環境変数設定
echo ========================================
echo.

cd C:\devlop\VideoStep

echo Service Registry URL: https://service-registry-production-6ee0.up.railway.app
echo Eureka URL: https://service-registry-production-6ee0.up.railway.app/eureka/
echo.

echo ========================================
echo 設定する環境変数
echo ========================================
echo.
echo EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
echo EUREKA_CLIENT_ENABLED=true
echo EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
echo EUREKA_CLIENT_FETCH_REGISTRY=true
echo.

echo ========================================
echo 手順
echo ========================================
echo.
echo 1. Railwayダッシュボードでvideo-serviceを開く
echo 2. Variablesタブで上記4つの環境変数を設定
echo 3. video-serviceを再デプロイ
echo.
echo Railwayダッシュボードを開いています...
echo.

start https://railway.app/dashboard

echo.
echo 詳細は EXECUTE_EUREKA_FIX_NOW.md を参照してください
echo.
pause

