# Git履歴からAPI Keyを削除するPowerShellスクリプト

Write-Host "Git履歴からAPI Keyを削除しています..." -ForegroundColor Yellow

# 環境変数を設定
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

# API Key
$apiKey = "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"
$replacement = "YOUR_OPENAI_API_KEY"

# git filter-branchを使用して履歴を書き換え
Write-Host "過去のコミットをスキャンしています..." -ForegroundColor Cyan

git filter-branch --force --tree-filter @"
if (Test-Path SET_OPENAI_API_KEY.md) {
    `$content = Get-Content SET_OPENAI_API_KEY.md -Raw
    `$content = `$content -replace [regex]::Escape('$apiKey'), '$replacement'
    Set-Content SET_OPENAI_API_KEY.md -Value `$content -NoNewline
}
"@ --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nGit履歴からAPI Keyを削除しました！" -ForegroundColor Green
    Write-Host "`n次に、force pushを実行してください:" -ForegroundColor Yellow
    Write-Host "  git push --force --all" -ForegroundColor Cyan
    Write-Host "`n警告: Force pushは危険です。他の開発者と共有しているブランチでは使用しないでください。" -ForegroundColor Red
} else {
    Write-Host "`nエラーが発生しました。別の方法を試してください。" -ForegroundColor Red
}

