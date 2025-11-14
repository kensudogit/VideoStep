# サードパーティCookie廃止対応ガイド

Microsoft Edgeを含む主要ブラウザがサードパーティCookieを廃止する動きに対応するため、以下の変更を実装しました。

## 実装内容

### 1. バックエンド（Auth Service）

#### HttpOnly Cookieの実装
- 認証トークンをHttpOnly Cookieに保存
- `SameSite=None; Secure`属性を設定（サードパーティCookie対応）
- Cookieの有効期限: 7日間

#### 設定ファイル（application.yml）
```yaml
app:
  cookie:
    domain: ""  # 空の場合は現在のドメインを使用
    secure: true  # HTTPS環境ではtrue、開発環境ではfalseに設定可能
    same-site: None  # None, Lax, Strict のいずれか（サードパーティCookieにはNoneが必要）
```

#### CORS設定の改善
- `allowCredentials: true`を設定
- `exposedHeaders`に`Set-Cookie`を追加
- 適切なorigin設定（本番環境では具体的なoriginを指定）

### 2. フロントエンド

#### APIリクエストの更新
- すべてのfetchリクエストに`credentials: 'include'`を追加
- XMLHttpRequestに`withCredentials: true`を設定
- Cookieが自動的に送信されるように設定

#### 変更ファイル
- `src/utils/api.ts`: APIリクエスト関数を更新
- `src/app/auth/login/page.tsx`: ログイン時にCookieを送信
- `src/app/auth/register/page.tsx`: 登録時にCookieを送信

### 3. API Gateway

#### CORS設定の改善
- `allowCredentials: true`を維持
- `exposedHeaders`に`Set-Cookie`を追加
- 本番環境では具体的なoriginを指定すること

## 使用方法

### 開発環境

1. **application.ymlの設定**
```yaml
app:
  cookie:
    secure: false  # 開発環境（HTTP）ではfalse
    same-site: None
```

2. **CORS設定**
- 開発環境では`allowedOrigins: "*"`を使用可能
- `allowCredentials: true`と組み合わせる場合は注意が必要

### 本番環境

1. **application.ymlの設定**
```yaml
app:
  cookie:
    domain: ".yourdomain.com"  # サブドメイン間でCookieを共有する場合
    secure: true  # HTTPS環境では必須
    same-site: None  # サードパーティCookieには必須
```

2. **CORS設定**
- 具体的なoriginを指定（例: `https://your-frontend-domain.com`）
- `allowedOrigins: "*"`と`allowCredentials: true`は同時に使用できない

3. **API Gateway設定**
```yaml
allowedOrigins:
  - "https://your-frontend-domain.com"
  - "https://www.your-frontend-domain.com"
allowCredentials: true
```

## 認証フロー

### ログイン/登録時
1. ユーザーがログイン/登録
2. バックエンドがJWTトークンを生成
3. トークンをHttpOnly Cookieに設定（`auth_token`）
4. レスポンスボディにもトークンを返す（既存のlocalStorage方式との互換性のため）

### APIリクエスト時
1. フロントエンドがAPIリクエストを送信
2. `credentials: 'include'`によりCookieが自動送信
3. バックエンドがCookieからトークンを読み取り
4. 認証処理を実行

### ログアウト時
1. `/api/auth/logout`エンドポイントを呼び出し
2. Cookieを削除（`Max-Age=0`）
3. フロントエンドのlocalStorageもクリア

## 注意事項

### SameSite=Noneの要件
- `SameSite=None`を使用する場合、`Secure`属性が必須
- HTTPS環境でのみ動作
- 開発環境では`secure: false`に設定可能だが、本番環境では`true`が必須

### CORS設定
- `allowCredentials: true`を使用する場合、`allowedOrigins: "*"`は使用できない
- 本番環境では具体的なoriginを指定すること

### ブラウザ互換性
- Chrome 80+
- Edge 80+
- Firefox 69+
- Safari 13+

## トラブルシューティング

### Cookieが送信されない
1. `credentials: 'include'`が設定されているか確認
2. CORS設定で`allowCredentials: true`が設定されているか確認
3. SameSite属性が正しく設定されているか確認

### CORSエラーが発生する
1. `allowedOrigins`に具体的なoriginが指定されているか確認
2. `allowCredentials: true`と`allowedOrigins: "*"`を同時に使用していないか確認

### 開発環境でCookieが設定されない
1. `secure: false`に設定されているか確認
2. `same-site: None`が設定されているか確認
3. ブラウザの開発者ツールでCookieを確認

## Vercelデプロイ環境での対応

### 現在の状態

- ✅ フロントエンドはVercelにデプロイ済み
- ✅ Mockデータを使用しているため、バックエンドAPIは不要
- ✅ バックエンドAPI接続時に備えて、Cookie対応を実装済み

### バックエンドAPI接続時の設定

バックエンドAPIを接続する場合、以下の設定が必要です：

1. **バックエンドAPIのCORS設定**
   - VercelのフロントエンドURLを`allowedOrigins`に追加
   - `allowCredentials: true`を設定

2. **Cookie設定**
   - `secure: true`（HTTPS環境では必須）
   - `same-site: None`（サードパーティCookie対応）

詳細は`VERCEL_COOKIE_COMPLIANCE.md`を参照してください。

## 参考資料

- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Chrome: SameSite Cookie Updates](https://www.chromium.org/updates/same-site)
- [Spring Security: CORS Configuration](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)
- [Vercel: Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

