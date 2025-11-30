# .envファイルをGitから除外する設定

## 現在の設定

`.gitignore`ファイルに以下の設定が含まれています：

```
# Environment variables
.env
.env.local
.env*.local
.env.*
!.env.example
!.env.template
```

これにより、`.env`ファイルは自動的にGitから除外されます。

## 既にGitに追跡されている場合の対処

もし`.env`ファイルが既にGitにコミットされている場合は、以下の手順で削除してください：

### 1. Gitの追跡から削除（ファイルは残す）

```bash
cd C:\devlop\VideoStep
git rm --cached .env
```

### 2. 変更をコミット

```bash
git commit -m "chore: Remove .env from Git tracking"
git push origin main
```

### 3. 確認

```bash
git ls-files | findstr "\.env"
```

何も表示されなければ、正しく除外されています。

## 確認方法

### .gitignoreが正しく機能しているか確認

```bash
# .envファイルが存在する場合
git status
```

`.env`ファイルが表示されなければ、正しく除外されています。

### .envファイルがGitに追跡されていないか確認

```bash
git ls-files | findstr "\.env"
```

何も表示されなければ、追跡されていません。

## 注意事項

- `.env`ファイルには機密情報（APIキー、パスワードなど）が含まれます
- `.env`ファイルは**絶対に**Gitにコミットしないでください
- `.env.example`や`.env.template`はテンプレートとしてコミット可能です（実際の値は含めない）

## まとめ

✅ `.gitignore`に`.env`が含まれているため、自動的に除外されます  
✅ 既に追跡されている場合は、`git rm --cached .env`で削除してください  
✅ `.env.example`はテンプレートとしてコミット可能です

