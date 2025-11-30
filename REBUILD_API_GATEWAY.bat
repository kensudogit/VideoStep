@echo off
echo ========================================
echo API Gateway 再ビルド・再起動
echo ========================================
echo.

cd /d C:\devlop\VideoStep

echo [1/4] API Gatewayを停止中...
docker-compose stop api-gateway
if %errorlevel% neq 0 (
    echo 警告: 停止コマンドでエラーが発生しましたが、続行します。
)

echo.
echo [2/4] API Gatewayコンテナを削除中...
docker-compose rm -f api-gateway
if %errorlevel% neq 0 (
    echo 警告: 削除コマンドでエラーが発生しましたが、続行します。
)

echo.
echo [3/4] API Gatewayをビルド中...
docker-compose build api-gateway
if %errorlevel% neq 0 (
    echo エラー: ビルドに失敗しました。
    pause
    exit /b 1
)

echo.
echo [4/4] API Gatewayを起動中...
docker-compose up -d api-gateway
if %errorlevel% neq 0 (
    echo エラー: 起動に失敗しました。
    pause
    exit /b 1
)

echo.
echo ========================================
echo 完了: API Gatewayの再ビルド・再起動が完了しました
echo ========================================
echo.
echo ログを確認するには:
echo   docker logs -f videostep-api-gateway
echo.
pause

