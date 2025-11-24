# 🔒 セキュリティ修正: APIキーの削除

## 問題
`SET_OPENAI_API_KEY.md`ファイルに実際のOpenAI APIキーが含まれており、GitHubのプッシュ保護によりプッシュがブロックされました。

## 修正内容
✅ `SET_OPENAI_API_KEY.md`から実際のAPIキーを削除し、プレースホルダー（`YOUR_OPENAI_API_KEY`）に置き換えました。

## 次のステップ

### 1. 変更をコミット

```cmd
cd C:\devlop\VideoStep
git add SET_OPENAI_API_KEY.md
git commit -m "fix: Remove actual API key from SET_OPENAI_API_KEY.md"
```

### 2. プッシュ

```cmd
git push
```

### 3. Git履歴からAPIキーを削除（推奨）

過去のコミットにAPIキーが含まれている場合、Git履歴から削除することを推奨します：

#### 方法1: BFG Repo-Cleaner（推奨）

1. BFGをダウンロード: https://rtyley.github.io/bfg-repo-cleaner/
2. 実行：
```bash
# APIキーを削除
java -jar bfg.jar --replace-text passwords.txt

# 履歴を再書き込み
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

`passwords.txt`の内容：
```
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==>YOUR_OPENAI_API_KEY
```

#### 方法2: git filter-branch

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch SET_OPENAI_API_KEY.md" \
  --prune-empty --tag-name-filter cat -- --all

git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 4. 強制プッシュ（注意）

⚠️ **警告**: 履歴を書き換えた場合は、強制プッシュが必要です。チームメンバーと調整してください。

```bash
git push --force
```

## セキュリティのベストプラクティス

1. ✅ **環境変数を使用**: 実際のAPIキーは環境変数で管理
2. ✅ **`.gitignore`に追加**: `.env`ファイルは`.gitignore`に含まれている
3. ✅ **シークレット管理**: Vercel、Railwayなどのシークレット管理機能を使用
4. ✅ **APIキーのローテーション**: 漏洩した可能性がある場合は、すぐにAPIキーを無効化して新しいキーを発行

## 現在の状態

- ✅ `SET_OPENAI_API_KEY.md`から実際のAPIキーを削除
- ✅ プレースホルダー（`YOUR_OPENAI_API_KEY`）に置き換え
- ✅ `.gitignore`に`.env`ファイルが含まれている

## 注意事項

- 過去のコミットにAPIキーが含まれている場合、Git履歴から削除することを推奨します
- 漏洩した可能性があるAPIキーは、OpenAIダッシュボードで無効化してください
- 新しいAPIキーを発行して、各環境（Vercel、Railway）で更新してください

