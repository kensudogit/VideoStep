@echo off
chcp 65001 >nul
echo ========================================
echo Mockサンプル動画データ設定スクリプト
echo ========================================
echo.

echo [1/2] .env.localファイルを作成中...
(
  echo # Mock Data Configuration
  echo # この環境変数を true に設定すると、常にmockサンプル動画データを使用します
  echo NEXT_PUBLIC_USE_MOCK_DATA=true
  echo.
  echo # API Base URL (mockデータを使用する場合は設定不要)
  echo # NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
) > .env.local

if exist .env.local (
    echo [OK] .env.localファイルを作成しました
    echo.
    echo ファイルの内容:
    type .env.local
) else (
    echo [ERROR] .env.localファイルの作成に失敗しました
    pause
    exit /b 1
)
echo.

echo [2/2] 設定完了
echo.
echo ========================================
echo 次のステップ:
echo   1. 開発サーバーを再起動してください
echo      - 現在実行中の場合は Ctrl+C で停止
echo      - その後、npm run dev で再起動
echo.
echo   2. ブラウザで http://localhost:3000 にアクセス
echo.
echo   3. 開発者ツール（F12）のコンソールで以下を確認:
echo      [Mock Data] で始まるログが表示されれば成功
echo ========================================
echo.

pause

