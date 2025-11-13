# コントリビューションガイドライン

VideoStepプロジェクトへの貢献をありがとうございます！

## 開発環境のセットアップ

1. リポジトリをクローン
```bash
git clone <repository-url>
cd VideoStep
```

2. バックエンドのセットアップ
```bash
./gradlew build
```

3. フロントエンドのセットアップ
```bash
cd frontend
npm install
```

4. Docker Composeでサービスを起動
```bash
docker-compose up -d
```

## コーディング規約

### Java
- Google Java Style Guideに準拠
- クラス名はPascalCase
- メソッド名・変数名はcamelCase
- 定数はUPPER_SNAKE_CASE

### TypeScript/React
- ESLint + Prettierを使用
- コンポーネント名はPascalCase
- ファイル名はkebab-caseまたはPascalCase
- 関数コンポーネントを優先

## コミットメッセージ

以下の形式に従ってください：

```
<type>: <subject>

<body>
```

### Type
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: コードスタイル
- `refactor`: リファクタリング
- `test`: テスト
- `chore`: その他

### 例
```
feat: 動画アップロード機能を追加

- ファイルアップロードAPIの実装
- プログレスバーの表示
- エラーハンドリングの改善
```

## プルリクエスト

1. 新しいブランチを作成
```bash
git checkout -b feature/your-feature-name
```

2. 変更をコミット
```bash
git commit -m "feat: your feature description"
```

3. プッシュ
```bash
git push origin feature/your-feature-name
```

4. プルリクエストを作成

## テスト

変更をコミットする前に、テストを実行してください：

```bash
# バックエンド
./gradlew test

# フロントエンド
cd frontend
npm test
```

## 質問・サポート

質問がある場合は、Issueを作成してください。

