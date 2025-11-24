# Vercel完全公開モードデプロイガイド

## 概要

このガイドでは、VideoStep Frontendを**完全公開モード**でVercelにデプロイする手順を説明します。

完全公開モードでは：
- ✅ 誰でもアクセス可能（認証不要）
- ✅ Mockデータを使用（バックエンドAPI不要）
- ✅ すべてのコンテンツが公開
- ✅ 即座に利用可能

## 前提条件

1. **Vercel CLIがインストールされている**
   ```bash
   npm install -g vercel
   ```

2. **Vercelアカウントにログインしている**
   ```bash
   vercel login
   ```

3. **Node.js 18以上がインストールされている**

## デプロイ手順

### 方法1: 自動デプロイスクリプトを使用（推奨）

```bash
cd C:\devlop\VideoStep\frontend
deploy-vercel-public.bat
```

スクリプトが以下を自動実行します：
1. Vercel CLIの確認
2. ログイン状態の確認
3. 環境変数の確認
4. ビルドテスト
5. デプロイ実行

### 方法2: 手動デプロイ

#### ステップ1: 環境変数の設定

完全公開モードでは、以下の環境変数を設定します：

```bash
# Mockデータを強制使用
vercel env add NEXT_PUBLIC_USE_MOCK_DATA production
# プロンプトで "true" を入力

# 既存のAPI URL環境変数を削除（設定されている場合）
vercel env rm NEXT_PUBLIC_API_BASE_URL production
```

**重要**: `NEXT_PUBLIC_API_BASE_URL` は設定**しない**でください。設定されている場合は削除してください。

#### ステップ2: ビルドテスト

```bash
cd C:\devlop\VideoStep\frontend
npm install
npm run build
```

ビルドが成功することを確認してください。

#### ステップ3: デプロイ実行

```bash
# 本番環境にデプロイ
vercel --prod --yes
```

または、プレビュー環境にデプロイ：

```bash
vercel --yes
```

## 環境変数の確認

デプロイ前に、環境変数が正しく設定されているか確認：

```bash
vercel env ls
```

期待される設定：
- ✅ `NEXT_PUBLIC_USE_MOCK_DATA` = `true` (Production)
- ❌ `NEXT_PUBLIC_API_BASE_URL` は設定されていない（または削除済み）

## Vercelダッシュボードでの設定

### 環境変数の設定

1. https://vercel.com/dashboard にアクセス
2. プロジェクトを選択
3. **Settings** → **Environment Variables** に移動
4. 以下の環境変数を設定：

| 環境変数名 | 値 | 環境 |
|-----------|-----|------|
| `NEXT_PUBLIC_USE_MOCK_DATA` | `true` | Production, Preview, Development |

5. **重要**: `NEXT_PUBLIC_API_BASE_URL` が設定されている場合は**削除**してください

### デプロイ設定の確認

1. **Settings** → **General** に移動
2. **Framework Preset** が `Next.js` になっていることを確認
3. **Root Directory** が `frontend` になっていることを確認（プロジェクトルートが `frontend` の場合）

## デプロイ後の確認

### 1. デプロイURLの確認

```bash
vercel ls
```

または、Vercelダッシュボードで確認：
- **Deployments** タブを開く
- 最新のデプロイのURLを確認

### 2. 動作確認

デプロイURLにアクセスして、以下を確認：

- ✅ トップページが表示される
- ✅ 動画一覧が表示される（Mockデータ）
- ✅ 認証なしでアクセス可能
- ✅ すべてのページが正常に動作する

### 3. ログの確認

問題が発生した場合、ログを確認：

```bash
vercel logs [deployment-url]
```

または、Vercelダッシュボードで：
- **Deployments** → デプロイを選択 → **Logs** タブ

## トラブルシューティング

### 問題1: ビルドエラー

**症状**: `npm run build` が失敗する

**解決方法**:
1. Node.jsのバージョンを確認（18以上が必要）
2. 依存関係を再インストール：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. TypeScriptエラーを確認：
   ```bash
   npm run lint
   ```

### 問題2: 環境変数が反映されない

**症状**: デプロイ後も環境変数が反映されない

**解決方法**:
1. 環境変数が正しく設定されているか確認：
   ```bash
   vercel env ls
   ```
2. 再デプロイを実行：
   ```bash
   vercel --prod --yes
   ```
3. 環境変数の名前が `NEXT_PUBLIC_` で始まっているか確認

### 問題3: Mockデータが表示されない

**症状**: 動画一覧が空、またはエラーが表示される

**解決方法**:
1. `NEXT_PUBLIC_USE_MOCK_DATA=true` が設定されているか確認
2. `NEXT_PUBLIC_API_BASE_URL` が設定されていないか確認（設定されている場合は削除）
3. ブラウザのコンソールでエラーを確認
4. ネットワークタブでAPIリクエストを確認

### 問題4: CORSエラー

**症状**: ブラウザコンソールにCORSエラーが表示される

**解決方法**:
1. `vercel.json` の `Access-Control-Allow-Origin` ヘッダーを確認
2. 既に `*` に設定されている場合は、問題ありません

### 問題5: 404エラー

**症状**: ページにアクセスすると404エラーが表示される

**解決方法**:
1. `vercel.json` の `rewrites` 設定を確認
2. Next.jsのルーティング設定を確認
3. ビルドログでエラーがないか確認

## 再デプロイ

設定を変更した後、再デプロイ：

```bash
cd C:\devlop\VideoStep\frontend
vercel --prod --yes
```

または、Vercelダッシュボードから：
1. **Deployments** タブを開く
2. 最新のデプロイの **...** メニューをクリック
3. **Redeploy** を選択

## バックエンドAPIを接続する場合

後でバックエンドAPIを接続する場合：

1. **環境変数を設定**:
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL production
   # バックエンドAPIのURLを入力（例: https://your-api.railway.app）
   ```

2. **Mockデータを無効化**:
   ```bash
   vercel env rm NEXT_PUBLIC_USE_MOCK_DATA production
   # または、値を "false" に変更
   ```

3. **再デプロイ**:
   ```bash
   vercel --prod --yes
   ```

## まとめ

完全公開モードでデプロイする手順：

1. ✅ Vercel CLIをインストール
2. ✅ Vercelにログイン
3. ✅ 環境変数を設定（`NEXT_PUBLIC_USE_MOCK_DATA=true`）
4. ✅ `NEXT_PUBLIC_API_BASE_URL` を削除（設定されている場合）
5. ✅ ビルドテスト
6. ✅ デプロイ実行（`vercel --prod --yes`）
7. ✅ 動作確認

これで、誰でもアクセス可能な完全公開モードのフロントエンドがデプロイされます！

## 参考リンク

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Vercel CLIリファレンス](https://vercel.com/docs/cli)

