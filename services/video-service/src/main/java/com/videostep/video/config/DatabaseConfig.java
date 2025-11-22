package com.videostep.video.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;

/**
 * データベース設定クラス
 * DatabaseEnvironmentPostProcessorが設定したspring.datasource.*プロパティを使用してDataSourceを作成
 * JDBC URLから認証情報を分離し、ホスト名の問題を解決
 */
@Configuration
public class DatabaseConfig {

    @Autowired
    private Environment environment;

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSource dataSource(DataSourceProperties properties) {
        // DatabaseEnvironmentPostProcessorが設定したJDBC URLと認証情報をEnvironmentから直接取得
        String jdbcUrl = environment.getProperty("spring.datasource.url");
        String username = environment.getProperty("spring.datasource.username");
        String password = environment.getProperty("spring.datasource.password");
        
        // DatabaseEnvironmentPostProcessorが設定したJDBC URLと認証情報を使用
        if (jdbcUrl != null && !jdbcUrl.isEmpty()) {
            System.out.println("DatabaseConfig: Using spring.datasource.url = " + jdbcUrl.substring(0, Math.min(80, jdbcUrl.length())) + "...");
            
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setDriverClassName("org.postgresql.Driver");
            
            // 認証情報を設定（DatabaseEnvironmentPostProcessorが抽出したもの）
            if (username != null && !username.isEmpty()) {
                config.setUsername(username);
                System.out.println("DatabaseConfig: Username set (length: " + username.length() + ")");
            } else {
                System.err.println("DatabaseConfig: WARNING - Username is null or empty!");
            }
            if (password != null && !password.isEmpty()) {
                config.setPassword(password);
                System.out.println("DatabaseConfig: Password set (length: " + password.length() + ")");
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
        
        // spring.datasource.urlが設定されていない場合は、デフォルトのDataSourcePropertiesを使用
        // これは通常、ローカル開発環境の場合
        System.out.println("DatabaseConfig: Using default DataSourceProperties");
        return properties.initializeDataSourceBuilder().build();
    }
}

