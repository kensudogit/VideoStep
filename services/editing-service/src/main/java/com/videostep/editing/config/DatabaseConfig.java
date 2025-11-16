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
 * RailwayのDATABASE_URLをJDBC URL形式に変換してDataSourceを作成
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
            if (databaseUrl.startsWith("postgresql://")) {
                String jdbcUrl = "jdbc:" + databaseUrl;
                System.out.println("DatabaseConfig: Using DATABASE_URL = " + jdbcUrl.substring(0, Math.min(80, jdbcUrl.length())) + "...");
                
                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(jdbcUrl);
                config.setDriverClassName("org.postgresql.Driver");
                
                // DATABASE_URLからユーザー名とパスワードを抽出
                // postgresql://user:password@host:port/database
                try {
                    String urlWithoutPrefix = databaseUrl.substring("postgresql://".length());
                    int atIndex = urlWithoutPrefix.indexOf('@');
                    if (atIndex > 0) {
                        String credentials = urlWithoutPrefix.substring(0, atIndex);
                        int colonIndex = credentials.indexOf(':');
                        if (colonIndex > 0) {
                            String username = credentials.substring(0, colonIndex);
                            String password = credentials.substring(colonIndex + 1);
                            config.setUsername(username);
                            config.setPassword(password);
                        }
                    }
                } catch (Exception e) {
                    System.out.println("DatabaseConfig: Failed to parse credentials from DATABASE_URL, using defaults");
                }
                
                return new HikariDataSource(config);
            }
        }
        
        // DATABASE_URLが設定されていない場合は、デフォルトのDataSourcePropertiesを使用
        return properties.initializeDataSourceBuilder().build();
    }
}

