# API Gateway ログイン認証情報

## デフォルト認証情報

API Gatewayのログインページ（`http://localhost:8080/login`）にアクセスする際の認証情報：

### ユーザー名
```
user
```

### パスワード
起動ログに表示された自動生成パスワードを使用してください。

**最新のパスワードを確認する方法**:
```bash
docker logs videostep-api-gateway 2>&1 | findstr "Using generated security password"
```

**ログから確認したパスワード**（起動時に表示）:
```
24cbc33d-f59e-469c-ae43-df522aeb40d8
```

## 注意事項

⚠️ **重要**: このパスワードは**起動のたびに自動生成**されます。コンテナを再起動すると、新しいパスワードが生成されます。

## ログイン方法

1. ブラウザで `http://localhost:8080/login` にアクセス
2. ユーザー名: `user`
3. パスワード: ログに表示された自動生成パスワード（例: `24cbc33d-f59e-469c-ae43-df522aeb40d8`）

## パスワードを固定する方法

開発環境でパスワードを固定したい場合は、`application.yml`に以下を追加：

```yaml
spring:
  security:
    user:
      name: admin
      password: admin123
```

これにより、以下の認証情報でログインできます：
- ユーザー名: `admin`
- パスワード: `admin123`

## API Gatewayの認証を無効化する方法

開発環境でAPI Gatewayの認証を無効化したい場合は、Security設定を変更する必要があります。

### 方法1: Security設定クラスを作成

`services/api-gateway/src/main/java/com/videostep/gateway/config/SecurityConfig.java`を作成：

```java
package com.videostep.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf().disable()
            .authorizeExchange()
                .anyExchange().permitAll()
            .and()
            .build();
    }
}
```

### 方法2: 特定のエンドポイントのみ認証を無効化

```java
@Bean
public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
    return http
        .csrf().disable()
        .authorizeExchange()
            .pathMatchers("/actuator/**", "/api/**").permitAll()
            .anyExchange().authenticated()
        .and()
        .httpBasic()
        .and()
        .build();
}
```

## 現在のパスワードを確認するコマンド

```bash
# PowerShell
docker logs videostep-api-gateway 2>&1 | Select-String "Using generated security password"

# CMD
docker logs videostep-api-gateway 2>&1 | findstr "Using generated security password"
```

## まとめ

**現在の認証情報**:
- ユーザー名: `user`
- パスワード: `24cbc33d-f59e-469c-ae43-df522aeb40d8`（起動時に自動生成）

**注意**: コンテナを再起動すると、新しいパスワードが生成されます。最新のパスワードはログで確認してください。

