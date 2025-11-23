package com.videostep.editing.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

/**
 * データベース設定クラス
 * DATABASE_URLをJDBC URL形式に変換してDataSourceを作成
 */
@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSource dataSource(DataSourceProperties properties) {
        // システム環境変数からDATABASE_URLを取得
        String databaseUrl = System.getenv("DATABASE_URL");

        if (databaseUrl != null && !databaseUrl.isEmpty() && !databaseUrl.startsWith("jdbc:")) {
            if (databaseUrl.startsWith("mysql://") || databaseUrl.startsWith("mysqlx://")) {
                String jdbcUrl = "jdbc:mysql://" + databaseUrl.substring(databaseUrl.indexOf("://") + 3);
                // MySQL URL形式の調整
                if (!jdbcUrl.contains("?")) {
                    jdbcUrl += "?useSSL=false&allowPublicKeyRetrieval=true";
                } else if (!jdbcUrl.contains("useSSL")) {
                    jdbcUrl += "&useSSL=false&allowPublicKeyRetrieval=true";
                }
                System.out.println("DatabaseConfig: Using DATABASE_URL = "
                        + jdbcUrl.substring(0, Math.min(80, jdbcUrl.length())) + "...");

                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(jdbcUrl);
                config.setDriverClassName("com.mysql.cj.jdbc.Driver");

                // MySQLの環境変数を優先的に使用（MYSQL_USER, MYSQL_PASSWORD）
                String username = System.getenv("MYSQL_USER");
                String password = System.getenv("MYSQL_PASSWORD");

                // MYSQL_USER/MYSQL_PASSWORDが設定されていない場合のみ、DATABASE_URLから抽出
                if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
                    try {
                        String urlWithoutPrefix = databaseUrl.substring(databaseUrl.indexOf("://") + 3);
                        int atIndex = urlWithoutPrefix.indexOf('@');
                        if (atIndex > 0) {
                            String credentials = urlWithoutPrefix.substring(0, atIndex);
                            int colonIndex = credentials.indexOf(':');
                            if (colonIndex > 0) {
                                username = credentials.substring(0, colonIndex);
                                password = credentials.substring(colonIndex + 1);
                            }
                        }
                    } catch (Exception e) {
                        System.out.println(
                                "DatabaseConfig: Failed to parse credentials from DATABASE_URL: " + e.getMessage());
                    }
                } else {
                    System.out.println("DatabaseConfig: Using MYSQL_USER and MYSQL_PASSWORD from environment");
                }

                // 認証情報を設定
                if (username != null && !username.isEmpty()) {
                    config.setUsername(username);
                    System.out.println("DatabaseConfig: Using USERNAME = " + username);
                }
                if (password != null && !password.isEmpty()) {
                    config.setPassword(password);
                    System.out.println("DatabaseConfig: Password set (length: " + password.length() + ")");
                }

                return new HikariDataSource(config);
            }
        }

        // DATABASE_URLが設定されていない場合は、デフォルトのDataSourcePropertiesを使用
        return properties.initializeDataSourceBuilder().build();
    }
}
