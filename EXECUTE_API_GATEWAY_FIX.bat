@echo off
echo ========================================
echo API Gateway修正の実行
echo ========================================
echo.

cd /d C:\devlop\VideoStep

echo [1/5] 既存のAPI Gatewayコンテナを削除中...
docker-compose rm -f api-gateway
if %errorlevel% neq 0 (
    echo 警告: コンテナの削除でエラーが発生しました（既に存在しない可能性があります）
)
echo.

echo [2/5] API Gatewayを再ビルド中...
echo 注意: ビルドには数分かかる場合があります
docker-compose build api-gateway
if %errorlevel% neq 0 (
    echo エラー: ビルドに失敗しました
    pause
    exit /b 1
)
echo.

echo [3/5] Service Registryの状態を確認中...
docker ps | findstr service-registry
if %errorlevel% neq 0 (
    echo 警告: Service Registryが起動していません
    echo Service Registryを起動します...
    docker-compose up -d service-registry
    echo Service Registryの起動を待機中（15秒）...
    timeout /t 15 /nobreak >nul
)
echo.

echo [4/5] API Gatewayを起動中...
docker-compose up -d api-gateway
if %errorlevel% neq 0 (
    echo エラー: API Gatewayの起動に失敗しました
    pause
    exit /b 1
)
echo.

echo [5/5] 起動を待機中（10秒）...
timeout /t 10 /nobreak >nul
echo.

echo ========================================
echo 起動確認
echo ========================================
echo.

echo コンテナの状態:
docker ps | findstr api-gateway
echo.

echo 最新のログ（最後の50行）:
docker logs videostep-api-gateway --tail 50
echo.

echo ========================================
echo 確認方法
echo ========================================
echo.
echo 1. ブラウザで以下にアクセス:
echo    http://localhost:8080/actuator/health
echo.
echo 2. 期待される結果:
echo    {"status":"UP"}
echo.
echo 3. ログに "Started ApiGatewayApplication" が表示されていることを確認
echo.

pause

