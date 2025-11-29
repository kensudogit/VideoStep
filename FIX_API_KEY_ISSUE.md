# GitHub Push Protection 対応手順

## 問題

過去のコミット（c5c4b6e）に実際のOpenAI API Keyが含まれており、GitHubのPush Protectionによってプッシュがブロックされています。

## 解決方法

### 方法1: GitHubのリンクから一時的に許可（簡単だが推奨されない）

1. 以下のリンクにアクセス：
   ```
   https://github.com/kensudogit/VideoStep/security/secret-scanning/unblock-secret/36234rxkB0MB2nirJcbPM7eGsn6
   ```

2. 「Allow secret」をクリックして一時的に許可

3. 再度プッシュを試行：
   ```bash
   git push
   ```

**注意**: この方法は一時的な解決策です。過去のコミット履歴にAPI Keyが残り続けます。

### 方法2: 過去のコミット履歴からAPI Keyを削除（推奨）

#### ステップ1: git filter-branchを使用（Windows PowerShell）

```powershell
cd C:\devlop\VideoStep

# 環境変数を設定
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

# 過去のコミットからAPI Keyを削除
git filter-branch --force --tree-filter "if (Test-Path SET_OPENAI_API_KEY.md) { (Get-Content SET_OPENAI_API_KEY.md -Raw) -replace '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', 'YOUR_OPENAI_API_KEY' | Set-Content SET_OPENAI_API_KEY.md -NoNewline }" --prune-empty --tag-name-filter cat -- --all
```

#### ステップ2: Force Push（注意が必要）

```bash
git push --force --all
```

**警告**: Force pushは危険です。他の開発者と共有しているブランチでは使用しないでください。

### 方法3: 新しいAPI Keyを取得（最も安全）

過去のコミット履歴にAPI Keyが残っている場合、そのAPI Keyは既に公開されている可能性があります。

1. OpenAIのダッシュボードにアクセス：
   ```
   https://platform.openai.com/api-keys
   ```

2. 問題のあるAPI Keyを削除

3. 新しいAPI Keyを作成

4. 新しいAPI Keyを環境変数に設定（Railway、Vercelなど）

## 推奨される対応

1. **即座に**: 方法1で一時的に許可してプッシュ
2. **その後**: 方法3で新しいAPI Keyを取得して設定
3. **長期的に**: 方法2で過去のコミット履歴からAPI Keyを削除（必要に応じて）

## 現在の状況

- ✅ 現在のファイル（SET_OPENAI_API_KEY.md）は既に修正済み（API Keyは削除されている）
- ❌ 過去のコミット履歴（c5c4b6e）にAPI Keyが残っている
- ❌ GitHubのPush Protectionがブロックしている

## 次のステップ

1. 方法1で一時的に許可してプッシュ
2. 新しいAPI Keyを取得して設定
3. 必要に応じて方法2で履歴をクリーンアップ

