# API Gateway 現在の認証情報

## デフォルト認証情報

API Gatewayのログインページ（`http://localhost:8080/login`）にアクセスする際の認証情報：

### ユーザー名
```
user
```

### パスワード

**重要**: パスワードは起動のたびに自動生成されます。

#### 最新のパスワードを確認する方法

**PowerShell**:
```powershell
docker logs videostep-api-gateway 2>&1 | Select-String "Using generated security password"
```

**CMD**:
```cmd
docker logs videostep-api-gateway 2>&1 | findstr "Using generated security password"
```

#### 以前のログから確認したパスワード

以前の起動ログから確認したパスワード：
```
24cbc33d-f59e-469c-ae43-df522aeb40d8
```

**注意**: コンテナを再起動している場合、このパスワードは無効になっている可能性があります。最新のログで確認してください。

## ログイン手順

1. ブラウザで `http://localhost:8080/login` にアクセス
2. **ユーザー名**: `user` を入力
3. **パスワード**: ログから確認した最新のパスワードを入力
4. 「Sign in」ボタンをクリック

## パスワードを固定する方法（推奨）

開発環境でパスワードを固定したい場合は、`application.yml`に以下を追加：

```yaml
spring:
  security:
    user:
      name: admin
      password: admin123
```

これにより、以下の認証情報でログインできます：
- **ユーザー名**: `admin`
- **パスワード**: `admin123`

## API Gatewayの認証を無効化する方法

開発環境でAPI Gatewayの認証を完全に無効化したい場合は、`SecurityConfig.java`を作成します。

`services/api-gateway/src/main/java/com/videostep/gateway/config/SecurityConfig.java`:

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
                .pathMatchers("/actuator/**", "/api/**").permitAll()
                .anyExchange().permitAll()
            .and()
            .build();
    }
}
```

これにより、すべてのエンドポイントが認証なしでアクセス可能になります。

## 現在のパスワードを確認するコマンド

### PowerShell
```powershell
docker logs videostep-api-gateway 2>&1 | Select-String "Using generated security password"
```

### CMD
```cmd
docker logs videostep-api-gateway 2>&1 | findstr "Using generated security password"
```

### ログの最後の50行から確認
```bash
docker logs videostep-api-gateway --tail 50 | grep "Using generated security password"
```

## まとめ

**現在の認証情報**:
- **ユーザー名**: `user`
- **パスワード**: ログから確認（起動のたびに自動生成）

**推奨**: 開発環境では、`application.yml`に固定のパスワードを設定するか、認証を無効化することをお勧めします。

