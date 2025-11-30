# API Gateway ログイン認証情報

## 現在の認証情報

API Gatewayのログインページ（`http://localhost:8080/login`）にアクセスする際の認証情報：

### ユーザー名
```
admin
```

### パスワード
```
admin123
```

## ログイン手順

1. ブラウザで `http://localhost:8080/login` にアクセス
2. **ユーザー名**: `admin` を入力
3. **パスワード**: `admin123` を入力
4. 「Sign in」ボタンをクリック

## 変更内容

`application.yml`に固定の認証情報を追加しました：

```yaml
spring:
  security:
    user:
      name: admin
      password: admin123
```

これにより、起動のたびにパスワードが変わることなく、常に同じ認証情報でログインできます。

## 注意事項

⚠️ **重要**: この認証情報は**開発環境専用**です。本番環境では、より強力なパスワードを使用するか、OAuth2やJWTなどの認証方式を実装してください。

## 認証を無効化する場合

開発環境で認証を完全に無効化したい場合は、`SecurityConfig.java`を作成します。

詳細は `API_GATEWAY_CREDENTIALS_CURRENT.md` を参照してください。

