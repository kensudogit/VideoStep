@echo off
echo ========================================
echo .envファイルのGit追跡状況を確認
echo ========================================
echo.

cd /d C:\devlop\VideoStep

echo [1/3] .gitignoreの設定を確認...
findstr /i "\.env" .gitignore
if %errorlevel% neq 0 (
    echo 警告: .gitignoreに.envの設定が見つかりません
) else (
    echo ✅ .gitignoreに.envが設定されています
)

echo.
echo [2/3] Gitに追跡されている.envファイルを確認...
git ls-files | findstr "\.env"
if %errorlevel% neq 0 (
    echo ✅ .envファイルはGitに追跡されていません
) else (
    echo ⚠️  警告: .envファイルがGitに追跡されています
    echo    以下のコマンドで削除してください:
    echo    git rm --cached .env
    echo    git commit -m "chore: Remove .env from Git tracking"
)

echo.
echo [3/3] 現在のGitステータスを確認...
git status --short | findstr "\.env"
if %errorlevel% neq 0 (
    echo ✅ .envファイルはGitのステージングエリアにありません
) else (
    echo ⚠️  警告: .envファイルがステージングエリアにあります
)

echo.
echo ========================================
echo 確認完了
echo ========================================
echo.
pause

