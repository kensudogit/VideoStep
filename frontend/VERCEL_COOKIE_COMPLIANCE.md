# Vercelデプロイ環境でのサードパーティCookie廃止対応

## 概要

Microsoft Edgeを含む主要ブラウザがサードパーティCookieを廃止する動きに対応するため、Vercelデプロイ環境でも適切に動作するように設定されています。

## 実装状況

### ✅ フロントエンド（Vercel）

#### APIリクエスト設定
- ✅ すべてのfetchリクエストに`credentials: 'include'`を設定済み
- ✅ XMLHttpRequestに`withCredentials: true`を設定済み
- ✅ Cookieが自動的に送信されるように設定済み

#### 実装ファイル
- `src/utils/api.ts`: `credentials: 'include'`を設定
- `src/app/auth/login/page.tsx`: ログイン時にCookieを送信
- `src/app/auth/register/page.tsx`: 登録時にCookieを送信

### ✅ バックエンド（Railway/Render等にデプロイ時）

#### HttpOnly Cookie設定
- ✅ `SameSite=None; Secure`属性を設定
- ✅ HTTPS環境でのみ動作（Secure属性必須）
- ✅ Cookieの有効期限: 7日間

## Vercel環境での動作

### 現在の設定（Mockデータ使用時）

現在、Mockデータを使用しているため、バックエンドAPIへの接続は不要です。しかし、将来的にバックエンドAPIを接続する場合に備えて、以下の設定が必要です。

### バックエンドAPI接続時の設定

#### 1. バックエンドAPIのCORS設定

バックエンドAPI（Railway/Render等）で、VercelのフロントエンドURLを許可する必要があります：

```yaml
# API Gateway (application.yml)
allowedOrigins:
  - "https://frontend-n22egn6e9-kensudogits-projects.vercel.app"
  - "https://*.vercel.app"  # プレビューデプロイメント用
allowCredentials: true
exposedHeaders:
  - Set-Cookie
  - Authorization
```

#### 2. Cookie設定

バックエンドAPIの`application.yml`で：

```yaml
app:
  cookie:
    domain: ""  # 空の場合は現在のドメインを使用
    secure: true  # HTTPS環境では必須
    same-site: None  # サードパーティCookieには必須
```

#### 3. フロントエンドの環境変数

Vercelダッシュボードで環境変数を設定：

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api-url.com
```

## 動作確認

### Mockデータ使用時（現在）

1. ブラウザの開発者ツール（F12）を開く
2. NetworkタブでAPIリクエストを確認
3. Mockデータが返されることを確認（APIリクエストは失敗するが、Mockデータが表示される）

### バックエンドAPI接続時

1. ブラウザの開発者ツール（F12）を開く
2. Applicationタブ → Cookiesを確認
3. `auth_token` Cookieが設定されていることを確認
4. NetworkタブでAPIリクエストを確認
5. `credentials: include`が設定されていることを確認

## トラブルシューティング

### Cookieが設定されない

**原因**: SameSite=NoneにはSecure属性が必須

**解決策**:
1. バックエンドAPIがHTTPSで動作していることを確認
2. `secure: true`が設定されていることを確認
3. `same-site: None`が設定されていることを確認

### CORSエラーが発生する

**原因**: バックエンドAPIのCORS設定でVercelのURLが許可されていない

**解決策**:
1. バックエンドAPIのCORS設定を確認
2. VercelのフロントエンドURLを`allowedOrigins`に追加
3. `allowCredentials: true`が設定されていることを確認

### 開発環境でCookieが動作しない

**原因**: 開発環境（localhost）ではSameSite=Noneが制限される場合がある

**解決策**:
1. 開発環境では`secure: false`に設定可能
2. ブラウザの設定でサードパーティCookieを許可
3. 本番環境（HTTPS）で動作確認

## ブラウザ互換性

### サポートされているブラウザ

- ✅ Chrome 80+
- ✅ Edge 80+
- ✅ Firefox 69+
- ✅ Safari 13+

### 制限事項

- SameSite=NoneはHTTPS環境でのみ動作
- 一部のブラウザでは追加の設定が必要な場合がある
- プライベートブラウジングモードでは制限される場合がある

## ベストプラクティス

### 1. First-Party Cookieの使用

可能な限り、フロントエンドとバックエンドを同じドメインにデプロイすることで、First-Party Cookieを使用できます。

### 2. 認証トークンの代替手段

- LocalStorage（現在の実装）
- SessionStorage
- HttpOnly Cookie（推奨、実装済み）

### 3. 段階的な移行

1. 現在: Mockデータを使用（Cookie不要）
2. 将来: バックエンドAPI接続時にCookie認証を有効化

## 参考資料

- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Chrome: SameSite Cookie Updates](https://www.chromium.org/updates/same-site)
- [Vercel: Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 次のステップ

バックエンドAPIを接続する場合：

1. Railway/Render等にバックエンドAPIをデプロイ
2. CORS設定でVercelのURLを許可
3. Cookie設定を確認（SameSite=None; Secure）
4. Vercelの環境変数で`NEXT_PUBLIC_API_BASE_URL`を設定
5. 動作確認

詳細は`RAILWAY_DEPLOY.md`と`THIRD_PARTY_COOKIE_MIGRATION.md`を参照してください。

