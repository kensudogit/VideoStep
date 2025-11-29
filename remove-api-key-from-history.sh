#!/bin/bash
# Git履歴からAPI Keyを削除するスクリプト

# 問題のあるAPI Key
API_KEY="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"

# git filter-branchを使用して履歴を書き換え
# 警告を抑制
export FILTER_BRANCH_SQUELCH_WARNING=1

# SET_OPENAI_API_KEY.mdファイルからAPI Keyを削除
git filter-branch --force --index-filter \
  "git checkout-index -f -a && \
   if [ -f SET_OPENAI_API_KEY.md ]; then
     sed -i 's|$API_KEY|YOUR_OPENAI_API_KEY|g' SET_OPENAI_API_KEY.md
     git add SET_OPENAI_API_KEY.md
   fi" \
  --prune-empty --tag-name-filter cat -- --all

echo "Git履歴からAPI Keyを削除しました。"
echo "次に、force pushを実行してください："
echo "  git push --force --all"

