@echo off
REM Railway完全公開モードデプロイスクリプト
REM このスクリプトはすべてのサービスをRailwayにデプロイする手順を案内します

echo ========================================
echo Railway完全公開モードデプロイ
echo ========================================
echo.
echo このスクリプトは、Railwayダッシュボードでのデプロイ手順を案内します。
echo 実際のデプロイはRailwayダッシュボードから行ってください。
echo.
echo 詳細な手順は RAILWAY_DEPLOY_NOW_COMPLETE.md を参照してください。
echo.
echo ========================================
echo デプロイ手順の概要
echo ========================================
echo.
echo 1. Railwayダッシュボードにアクセス
echo    https://railway.app/dashboard
echo.
echo 2. 新しいプロジェクトを作成
echo    - "New Project" をクリック
echo    - "Deploy from GitHub repo" を選択
echo    - VideoStepリポジトリを選択
echo.
echo 3. 各サービスをデプロイ（順序重要）
echo    a) Service Registry（最初にデプロイ）
echo    b) MySQL Databases（各サービス用）
echo    c) Video Service
echo    d) Translation Service
echo    e) Editing Service
echo    f) User Service
echo    g) API Gateway（最後にデプロイ）
echo.
echo 4. 各サービスで以下を設定
echo    - Root Directory: .（ドット）
echo    - 環境変数（EUREKA、データベース接続など）
echo    - Generate Domain（パブリックURL生成）
echo.
echo ========================================
echo 重要な環境変数
echo ========================================
echo.
echo すべてのサービスで設定が必要:
echo   EUREKA_CLIENT_ENABLED=true
echo   EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
echo   EUREKA_CLIENT_FETCH_REGISTRY=true
echo   EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-xxxx.up.railway.app/eureka/
echo.
echo データベース接続（各サービス）:
echo   SPRING_DATASOURCE_URL=jdbc:mysql://[MySQLホスト]:3306/[DB名]?useSSL=true^&allowPublicKeyRetrieval=true
echo   SPRING_DATASOURCE_USERNAME=[ユーザー名]
echo   SPRING_DATASOURCE_PASSWORD=[パスワード]
echo.
echo OpenAI API Key（必要なサービス）:
echo   OPENAI_API_KEY=[あなたのAPIキー]
echo.
echo ========================================
echo 次のステップ
echo ========================================
echo.
echo 1. RAILWAY_DEPLOY_NOW_COMPLETE.md を開いて詳細を確認
echo 2. Railwayダッシュボードにアクセス
echo 3. 上記の手順に従ってデプロイを実行
echo.
echo ========================================
pause

