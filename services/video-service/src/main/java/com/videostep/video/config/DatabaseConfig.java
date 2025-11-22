package com.videostep.video.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.sql.Connection;
import java.nio.charset.StandardCharsets;

/**
 * データベース設定クラス
 * SPRING_DATASOURCE_*環境変数またはspring.datasource.*プロパティを使用してDataSourceを作成
 * DATABASE_URLを直接使わず、認証情報を分離して設定することでホスト名の問題を解決
 */
@Configuration
public class DatabaseConfig {

    @Autowired
    private Environment environment;

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        // SPRING_DATASOURCE_*環境変数を優先的に読み取る
        // なければ、DatabaseEnvironmentPostProcessorが設定したspring.datasource.*プロパティを使用
        String jdbcUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        if (jdbcUrl == null || jdbcUrl.isEmpty()) {
            jdbcUrl = environment.getProperty("spring.datasource.url");
        }

        String username = environment.getProperty("SPRING_DATASOURCE_USERNAME");
        if (username == null || username.isEmpty()) {
            username = environment.getProperty("spring.datasource.username");
        }
        // ユーザー名の前後の空白をトリム
        if (username != null) {
            username = username.trim();
        }

        String password = environment.getProperty("SPRING_DATASOURCE_PASSWORD");
        if (password == null || password.isEmpty()) {
            password = environment.getProperty("spring.datasource.password");
        }
        // パスワードの前後の空白をトリム
        if (password != null) {
            password = password.trim();
        }

        // 認証情報をスキップするオプションをチェック
        String skipAuth = environment.getProperty("SKIP_DATABASE_AUTHENTICATION");
        boolean skipAuthentication = skipAuth != null &&
                (skipAuth.equalsIgnoreCase("true") || skipAuth.equalsIgnoreCase("1")
                        || skipAuth.equalsIgnoreCase("yes"));

        // 認証情報が空の場合は自動的にスキップ
        if (!skipAuthentication && (username == null || username.isEmpty() || password == null || password.isEmpty())) {
            System.out.println("DatabaseConfig: INFO - Username or password is empty, will skip authentication");
            skipAuthentication = true;
        }

        // JDBC URLが設定されている場合は、カスタムDataSourceを作成
        if (jdbcUrl != null && !jdbcUrl.isEmpty()) {
            // JDBC形式でない場合は、jdbc:を追加
            if (!jdbcUrl.startsWith("jdbc:")) {
                jdbcUrl = "jdbc:" + jdbcUrl;
            }

            System.out.println(
                    "DatabaseConfig: Using JDBC URL = " + jdbcUrl.substring(0, Math.min(80, jdbcUrl.length())) + "...");

            // デバッグ: 実際に使用される認証情報を確認
            System.out.println("DatabaseConfig: DEBUG - Username from environment: " +
                    (username != null ? "'" + username + "' (length: " + username.length() + ")" : "null"));
            System.out.println("DatabaseConfig: DEBUG - Password from environment: " +
                    (password != null ? "*** (length: " + password.length() + ")" : "null"));
            // パスワードの文字列比較テスト（デバッグ用）
            if (password != null && password.equals("videostep")) {
                System.out.println("DatabaseConfig: DEBUG - Password matches 'videostep'");
            } else if (password != null) {
                System.out.println("DatabaseConfig: DEBUG - Password does NOT match 'videostep'");
                System.out.println("DatabaseConfig: DEBUG - Password bytes: " +
                        java.util.Arrays.toString(password.getBytes(StandardCharsets.UTF_8)));
            }

            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setDriverClassName("org.postgresql.Driver");

            // 認証情報を設定（空の場合は設定しない - PostgreSQLのデフォルト認証を使用）
            // SKIP_DATABASE_AUTHENTICATIONがtrueの場合は認証情報を設定しない
            if (skipAuthentication) {
                System.out
                        .println("DatabaseConfig: INFO - SKIP_DATABASE_AUTHENTICATION is set, skipping authentication");
            } else if (username != null && !username.isEmpty()) {
                config.setUsername(username);
                System.out.println("DatabaseConfig: Using USERNAME = " + username);
            } else {
                System.out.println("DatabaseConfig: INFO - Username is not set, will use default authentication");
            }

            if (skipAuthentication) {
                System.out.println("DatabaseConfig: INFO - SKIP_DATABASE_AUTHENTICATION is set, password not set");
            } else if (password != null && !password.isEmpty()) {
                config.setPassword(password);
                System.out.println("DatabaseConfig: Password set (length: " + password.length() + ")");
                // デバッグ: パスワードの最初の文字のみを表示（セキュリティのため）
                System.out.println("DatabaseConfig: Password first char: " + password.charAt(0) + "***");
                // パスワードに特殊文字が含まれているかチェック
                boolean hasSpecialChars = password.chars().anyMatch(c -> !Character.isLetterOrDigit(c));
                System.out.println("DatabaseConfig: Password contains special characters: " + hasSpecialChars);
                // デバッグ: パスワードの各文字のタイプを確認（URLエンコードされた文字を検出）
                boolean hasPercent = password.contains("%");
                System.out.println("DatabaseConfig: Password contains % (URL encoded): " + hasPercent);
                // デバッグ: パスワードの文字コードを確認（最初の3文字のみ）
                if (password.length() >= 3) {
                    System.out.println("DatabaseConfig: Password first 3 chars codes: " +
                            (int) password.charAt(0) + "," + (int) password.charAt(1) + "," + (int) password.charAt(2));
                }
                // パスワードの全文字コードを表示（制御文字や非表示文字を検出するため）
                StringBuilder charCodes = new StringBuilder();
                for (int i = 0; i < password.length(); i++) {
                    if (i > 0) {
                        charCodes.append(",");
                    }
                    charCodes.append((int) password.charAt(i));
                }
                System.out.println("DatabaseConfig: Password all char codes: " + charCodes.toString());
                // 制御文字（0-31、127）が含まれているかチェック
                boolean hasControlChars = password.chars().anyMatch(c -> c < 32 || c == 127);
                System.out.println("DatabaseConfig: Password contains control characters: " + hasControlChars);
            } else {
                System.out.println("DatabaseConfig: INFO - Password is not set, will use default authentication");
            }

            // 接続プールの設定
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setConnectionTimeout(30000);
            config.setIdleTimeout(600000);
            config.setMaxLifetime(1800000);

            // 認証情報が設定されている場合でも、認証に失敗した場合は認証なしで再接続を試みる
            if (!skipAuthentication && username != null && !username.isEmpty() && password != null
                    && !password.isEmpty()) {
                try {
                    HikariDataSource dataSource = new HikariDataSource(config);
                    // 接続テストを実行
                    try (Connection conn = dataSource.getConnection()) {
                        // 接続成功
                        System.out.println("DatabaseConfig: Connection test successful with authentication");
                        return dataSource;
                    }
                } catch (Exception e) {
                    // 認証に失敗した場合の処理
                    String errorMessage = e.getMessage();
                    if (errorMessage != null && errorMessage.contains("password authentication failed")) {
                        // SCRAM認証が要求される場合は、認証なしで再接続を試みない
                        // （SCRAM認証が必須のため、認証なしでは接続できない）
                        System.out.println("DatabaseConfig: ERROR - Password authentication failed");
                        System.out.println("DatabaseConfig: Original error: " + errorMessage);
                        System.out.println(
                                "DatabaseConfig: Cannot retry without authentication - server requires SCRAM authentication");
                        // 認証情報が間違っている可能性が高いため、そのまま例外をスロー
                        throw new RuntimeException("Database authentication failed. Please check your credentials.", e);
                    } else {
                        // その他のエラーの場合は、そのまま例外をスロー
                        throw new RuntimeException("Failed to initialize database connection", e);
                    }
                }
            }

            return new HikariDataSource(config);
        }

        // JDBC URLが設定されていない場合は、デフォルトのDataSourcePropertiesを使用
        // これは通常、ローカル開発環境の場合
        System.out.println("DatabaseConfig: Using default DataSourceProperties");
        return properties.initializeDataSourceBuilder().build();
    }
}
