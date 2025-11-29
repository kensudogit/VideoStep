@echo off
REM Railwayデプロイ状況確認スクリプト

echo ========================================
echo Railwayデプロイ状況確認
echo ========================================
echo.

cd C:\devlop\VideoStep

echo プロジェクト情報:
railway status
echo.

echo 現在のデプロイメント:
railway deployment list
echo.

echo 環境変数:
railway variables
echo.

echo.
echo 各サービスのログを確認するには:
echo   railway logs --service [サービス名]
echo.
echo サービス一覧を確認するには:
echo   railway open
echo.

pause

