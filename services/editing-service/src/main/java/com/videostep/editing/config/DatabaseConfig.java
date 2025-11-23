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
                
                // Railwayの環境変数を優先的に使用（PGUSER, PGPASSWORD）
                // これにより、Railwayが自動的に設定する正しい認証情報を使用できる
                String username = System.getenv("PGUSER");
                String password = System.getenv("PGPASSWORD");
                
                // PGUSER/PGPASSWORDが設定されていない場合のみ、DATABASE_URLから抽出
                if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
                    try {
                        String urlWithoutPrefix = databaseUrl.substring("postgresql://".length());
                        int atIndex = urlWithoutPrefix.indexOf('@');
                        if (atIndex > 0) {
                            String credentials = urlWithoutPrefix.substring(0, atIndex);
                            int colonIndex = credentials.indexOf(':');
                            if (colonIndex > 0) {
                                username = credentials.substring(0, colonIndex);
                                password = credentials.substring(colonIndex + 1);
                                
                                // videostepユーザーが検出された場合、Railwayでは存在しないため警告を出す
                                if (username.equals("videostep")) {
                                    System.out.println("DatabaseConfig: WARNING - 'videostep' user detected in DATABASE_URL. Railway PostgreSQL uses 'postgres' user by default.");
                                    String pgUser = System.getenv("PGUSER");
                                    if (pgUser != null && !pgUser.isEmpty() && !pgUser.equals("videostep")) {
                                        username = pgUser;
                                        System.out.println("DatabaseConfig: Using PGUSER = " + username);
                                    } else {
                                        System.out.println("DatabaseConfig: PGUSER not set, trying 'postgres' as default Railway user");
                                        username = "postgres";
                                    }
                                }
                                
                                // videostepパスワードが検出された場合、RailwayのPGPASSWORDを優先
                                if (password.equals("videostep")) {
                                    System.out.println("DatabaseConfig: WARNING - 'videostep' password detected. Using Railway's PGPASSWORD instead...");
                                    String pgPassword = System.getenv("PGPASSWORD");
                                    if (pgPassword != null && !pgPassword.isEmpty() && !pgPassword.equals("videostep")) {
                                        password = pgPassword;
                                        System.out.println("DatabaseConfig: Using PGPASSWORD from Railway environment");
                                    }
                                }
                            }
                        }
                    } catch (Exception e) {
                        System.out.println("DatabaseConfig: Failed to parse credentials from DATABASE_URL: " + e.getMessage());
                    }
                } else {
                    System.out.println("DatabaseConfig: Using PGUSER and PGPASSWORD from Railway environment");
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

