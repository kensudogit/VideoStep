# Favicon 401 Unauthorized エラー修正

## 問題

`favicon.ico`へのリクエストが401 Unauthorizedエラーを返していました。

```
Failed to load resource: the server responded with a status of 401 (Unauthorized)
:8080/favicon.ico:1
```

## 原因

Spring Securityのデフォルト設定により、すべてのリクエストが認証を要求していました。`/favicon.ico`へのリクエストも認証が必要になっていたため、401エラーが発生していました。

## 解決策

`SecurityConfig.java`を作成して、以下のエンドポイントを認証不要にしました：

- `/favicon.ico` - ブラウザが自動的にリクエストするfavicon
- `/actuator/**` - Spring Actuatorのヘルスチェックエンドポイント

### 作成したファイル

`services/api-gateway/src/main/java/com/videostep/gateway/config/SecurityConfig.java`:

```java
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf().disable()
            .authorizeExchange()
                // 認証不要のエンドポイント
                .pathMatchers("/favicon.ico", "/actuator/**").permitAll()
                // その他のエンドポイントは認証が必要
                .anyExchange().authenticated()
            .and()
            .httpBasic()
            .and()
            .build();
    }
}
```

## 適用方法

### 1. API Gatewayを再ビルド・再起動

```bash
cd C:\devlop\VideoStep
docker-compose stop api-gateway
docker-compose build api-gateway
docker-compose up -d api-gateway
```

### 2. ログを確認

```bash
docker logs -f videostep-api-gateway
```

正常に起動していることを確認してください。

### 3. 動作確認

1. ブラウザで `http://localhost:8080/favicon.ico` にアクセス
2. 404エラーが返されることを確認（401ではなく404）
3. ブラウザのコンソールでfaviconエラーが解消されていることを確認

## 認証情報

API Gatewayのログイン認証情報：

- **ユーザー名**: `admin`
- **パスワード**: `admin123`

（`application.yml`に固定の認証情報を設定済み）

## 注意事項

- `/favicon.ico`は404を返します（`GatewayConfig.java`のグローバルフィルターにより）
- `/actuator/**`は認証不要でアクセス可能です
- その他のエンドポイント（`/api/**`など）は認証が必要です

## まとめ

`SecurityConfig.java`を作成することで、`/favicon.ico`と`/actuator/**`を認証不要にし、401エラーを解消しました。これにより、ブラウザのコンソールエラーが解消されます。

