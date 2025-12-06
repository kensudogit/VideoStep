# Vercel Dockerコンテナ完全公開デプロイガイド

## 🚀 概要

このガイドでは、VideoStepプロジェクトをVercelに完全公開モードでデプロイする手順を説明します。

**重要**: VercelはDockerコンテナの直接デプロイをサポートしていません。以下のアプローチを推奨します：

1. **フロントエンド（Next.js）**: Vercelに直接デプロイ ✅
2. **バックエンド（Spring Boot）**: Railway、Render、Fly.ioなどのDocker対応プラットフォームにデプロイ

## 📋 アーキテクチャ

### フロントエンド（Next.js）
- **Vercel**にデプロイ
- Next.jsアプリケーションとして直接デプロイ
- 完全公開モードで設定

### バックエンド（Spring Boot Microservices）
- **Railway**、**Render**、**Fly.io**などのDockerコンテナをサポートするプラットフォームにデプロイ
- または、**Vercel Serverless Functions**として書き直す（大規模な変更が必要）

## ✅ 推奨アプローチ

### アプローチ1: フロントエンドをVercel、バックエンドをRailway（推奨）

既にRailwayにデプロイしているため、このアプローチが最も簡単です。

1. **フロントエンド**: Vercelにデプロイ（完全公開モード）
2. **バックエンド**: Railwayにデプロイ（既にデプロイ済み）
3. **環境変数**: VercelでバックエンドのURLを設定

## 📦 フロントエンドのVercelデプロイ（完全公開モード）

### ステップ1: Vercelアカウントの作成

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. アカウントを作成

### ステップ2: プロジェクトのインポート

1. **Add New...** → **Project**をクリック
2. GitHubリポジトリを選択
3. **Root Directory**を`frontend`に設定
4. **Framework Preset**を`Next.js`に設定
5. **Build Command**: `npm run build`（自動検出）
6. **Output Directory**: `.next`（自動検出）

### ステップ3: 環境変数の設定

**Environment Variables**セクションで以下を設定：

```
NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-domain].railway.app
NODE_ENV=production
```

**重要**: `NEXT_PUBLIC_API_BASE_URL`は、RailwayにデプロイしたAPI GatewayのURLに置き換えてください。

### ステップ4: 完全公開モードの設定

1. **Settings** → **General**
2. **Public**を有効化（既に`vercel.json`で設定済み）
3. **Domains**でカスタムドメインを設定（オプション）

### ステップ5: デプロイ

1. **Deploy**ボタンをクリック
2. ビルドログを確認
3. デプロイが成功することを確認

## 🔧 Vercel設定ファイル

### vercel.jsonの構成

`frontend/vercel.json`には以下が設定されています：

- **完全公開モード**: `"public": true`
- **CORS設定**: すべてのオリジンからのアクセスを許可
- **セキュリティヘッダー**: XSS保護、フレーム保護など
- **リージョン**: `iad1`（US East）

## 🌐 完全公開モードの詳細設定

### CORS設定

`vercel.json`で以下のCORSヘッダーを設定：

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

### カスタムドメインの設定（オプション）

1. Vercelダッシュボードで**Settings** → **Domains**
2. カスタムドメインを追加
3. DNS設定を更新

## 🔄 バックエンドとの連携

### API Gatewayの環境変数を更新

RailwayのAPI Gatewayで、VercelのフロントエンドURLを許可：

```
ALLOWED_ORIGINS=https://[your-vercel-domain].vercel.app,https://[your-custom-domain].com,*
```

### フロントエンドの環境変数を設定

Vercelで：

```
NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-domain].railway.app
```

## 📝 デプロイ手順

### ステップ1: コードの準備

```bash
cd C:\devlop\VideoStep
git add .
git commit -m "Add Vercel deployment configuration for public mode"
git push origin main
```

### ステップ2: Vercelでプロジェクトを作成

1. Vercelダッシュボードにアクセス
2. **Add New...** → **Project**
3. GitHubリポジトリを選択
4. **Root Directory**: `frontend`
5. **Framework Preset**: `Next.js`
6. 環境変数を設定
7. **Deploy**をクリック

### ステップ3: デプロイの確認

1. ビルドログを確認
2. デプロイが成功することを確認
3. 生成されたURLにアクセス
4. アプリケーションが正常に動作することを確認

## 🐳 Dockerコンテナのデプロイについて

### VercelでのDockerサポート

Vercelは**Dockerコンテナの直接デプロイをサポートしていません**。以下の代替案があります：

#### オプション1: Railwayを使用（推奨）

既にRailwayにデプロイしているため、この方法が最も簡単です：

1. RailwayでDockerコンテナをデプロイ
2. 公開URLを取得
3. VercelのフロントエンドからRailwayのAPIに接続

#### オプション2: Renderを使用

1. https://render.com にアクセス
2. **New** → **Web Service**
3. Dockerイメージを選択
4. 環境変数を設定
5. デプロイ

#### オプション3: Fly.ioを使用

1. https://fly.io にアクセス
2. `flyctl`をインストール
3. `flyctl launch`でデプロイ
4. 環境変数を設定

#### オプション4: Vercel Serverless Functionsに移行

大規模な変更が必要ですが、すべてをVercelで管理できます：

1. Spring BootサービスをNode.js/TypeScriptに書き直し
2. Vercel Serverless Functionsとして実装
3. Vercelにデプロイ

## 🆘 トラブルシューティング

### ビルドエラーが発生する場合

1. **ビルドログを確認**
   - エラーメッセージを確認
   - 依存関係の問題がないか確認

2. **Node.jsバージョンを確認**
   - Vercelの設定でNode.jsバージョンを指定
   - `package.json`で`engines`を指定（既に設定済み）

3. **環境変数を確認**
   - すべての必須環境変数が設定されているか確認

### API接続エラーが発生する場合

1. **CORS設定を確認**
   - RailwayのAPI GatewayでVercelのドメインが許可されているか確認
   - `vercel.json`のCORS設定を確認

2. **環境変数を確認**
   - `NEXT_PUBLIC_API_BASE_URL`が正しく設定されているか確認
   - 本番環境で有効になっているか確認

3. **ネットワークを確認**
   - RailwayのAPI Gatewayが起動しているか確認
   - エンドポイントにアクセスできるか確認

### 完全公開モードが機能しない場合

1. **vercel.jsonを確認**
   - `"public": true`が設定されているか確認
   - CORSヘッダーが正しく設定されているか確認

2. **Vercelダッシュボードを確認**
   - **Settings** → **General**で公開設定を確認

## 📋 確認チェックリスト

### Vercel設定
- [ ] Vercelアカウントを作成した
- [ ] プロジェクトをインポートした
- [ ] Root Directoryを`frontend`に設定した
- [ ] Framework Presetを`Next.js`に設定した
- [ ] 環境変数を設定した
- [ ] 完全公開モードを有効化した
- [ ] デプロイが成功した

### バックエンド連携
- [ ] RailwayのAPI Gatewayが起動している
- [ ] CORS設定でVercelのドメインが許可されている（または`*`で全許可）
- [ ] フロントエンドからAPI Gatewayにアクセスできる

### 完全公開モード
- [ ] `vercel.json`で`"public": true`が設定されている
- [ ] CORSヘッダーが正しく設定されている
- [ ] カスタムドメインを設定した（オプション）
- [ ] 環境変数が正しく設定されている
- [ ] アプリケーションが正常に動作する

## 🎯 まとめ

1. **フロントエンドをVercelにデプロイ** - Next.jsアプリケーションとして直接デプロイ（完全公開モード）
2. **バックエンドはRailwayにデプロイ** - Dockerコンテナとしてデプロイ（既にデプロイ済み）
3. **環境変数を設定** - フロントエンドとバックエンドを連携
4. **CORS設定を確認** - バックエンドでVercelのドメインを許可（または全許可）

**注意**: VercelはDockerコンテナを直接サポートしていませんが、Next.jsアプリケーションは直接デプロイでき、Railwayのバックエンドと連携して完全公開モードで動作します。

## 📚 参考リンク

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel環境変数](https://vercel.com/docs/environment-variables)
- [Railway公式ドキュメント](https://docs.railway.app)

