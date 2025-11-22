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
        
        String password = environment.getProperty("SPRING_DATASOURCE_PASSWORD");
        if (password == null || password.isEmpty()) {
            password = environment.getProperty("spring.datasource.password");
        }
        
        // JDBC URLが設定されている場合は、カスタムDataSourceを作成
        if (jdbcUrl != null && !jdbcUrl.isEmpty()) {
            // JDBC形式でない場合は、jdbc:を追加
            if (!jdbcUrl.startsWith("jdbc:")) {
                jdbcUrl = "jdbc:" + jdbcUrl;
            }
            
            System.out.println("DatabaseConfig: Using JDBC URL = " + jdbcUrl.substring(0, Math.min(80, jdbcUrl.length())) + "...");
            
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setDriverClassName("org.postgresql.Driver");
            
            // 認証情報を設定
            if (username != null && !username.isEmpty()) {
                config.setUsername(username);
                System.out.println("DatabaseConfig: Using USERNAME = " + username);
            } else {
                System.err.println("DatabaseConfig: WARNING - Username is null or empty!");
            }
            
            if (password != null && !password.isEmpty()) {
                config.setPassword(password);
                System.out.println("DatabaseConfig: Password set (length: " + password.length() + ")");
                // デバッグ: パスワードの最初の文字のみを表示（セキュリティのため）
                System.out.println("DatabaseConfig: Password first char: " + password.charAt(0) + "***");
                // パスワードに特殊文字が含まれているかチェック
                boolean hasSpecialChars = password.chars().anyMatch(c -> !Character.isLetterOrDigit(c));
                System.out.println("DatabaseConfig: Password contains special characters: " + hasSpecialChars);
            } else {
                System.err.println("DatabaseConfig: WARNING - Password is null or empty!");
            }
            
            // 接続プールの設定
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setConnectionTimeout(30000);
            config.setIdleTimeout(600000);
            config.setMaxLifetime(1800000);
            
            return new HikariDataSource(config);
        }
        
        // JDBC URLが設定されていない場合は、デフォルトのDataSourcePropertiesを使用
        // これは通常、ローカル開発環境の場合
        System.out.println("DatabaseConfig: Using default DataSourceProperties");
        return properties.initializeDataSourceBuilder().build();
    }
}

