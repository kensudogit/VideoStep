# GitHub Push Protection解除後の手順

## ステップ1: GitHubで一時的に許可

1. ブラウザで以下のリンクを開く：
   ```
   https://github.com/kensudogit/VideoStep/security/secret-scanning/unblock-secret/36234rxkB0MB2nirJcbPM7eGsn6
   ```

2. 「Allow secret」をクリック

## ステップ2: プッシュを再試行

```bash
cd C:\devlop\VideoStep
git push
```

## ステップ3: 重要なセキュリティ対応

⚠️ **公開されたAPI Keyは無効化してください！**

1. OpenAIのダッシュボードにアクセス：
   ```
   https://platform.openai.com/api-keys
   ```

2. 問題のあるAPI Key（`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`）を削除

3. 新しいAPI Keyを作成

4. 新しいAPI Keyを環境変数に設定：
   - Railway（各サービス）
   - Vercel（フロントエンド）

## ステップ4（オプション）: 過去のコミット履歴をクリーンアップ

過去のコミット履歴からAPI Keyを完全に削除する場合：

```powershell
cd C:\devlop\VideoStep
.\cleanup-api-key.ps1
git push --force --all
```

**警告**: Force pushは危険です。他の開発者と共有しているブランチでは使用しないでください。

