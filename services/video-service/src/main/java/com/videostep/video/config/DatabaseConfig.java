package com.videostep.video.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

/**
 * データベース設定クラス
 * DatabaseEnvironmentPostProcessorが設定したSPRING_DATASOURCE_*プロパティを使用してDataSourceを作成
 */
@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSource dataSource(
            DataSourceProperties properties,
            @Value("${spring.datasource.url:#{null}}") String jdbcUrl,
            @Value("${spring.datasource.username:#{null}}") String username,
            @Value("${spring.datasource.password:#{null}}") String password) {
        
        // DatabaseEnvironmentPostProcessorが設定したJDBC URLと認証情報を使用
        if (jdbcUrl != null && !jdbcUrl.isEmpty()) {
            System.out.println("DatabaseConfig: Using SPRING_DATASOURCE_URL = " + jdbcUrl.substring(0, Math.min(80, jdbcUrl.length())) + "...");
            
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setDriverClassName("org.postgresql.Driver");
            
            // 認証情報を設定（DatabaseEnvironmentPostProcessorが抽出したもの）
            if (username != null && !username.isEmpty()) {
                config.setUsername(username);
            }
            if (password != null && !password.isEmpty()) {
                config.setPassword(password);
            }
            
            // 接続プールの設定
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setConnectionTimeout(30000);
            config.setIdleTimeout(600000);
            config.setMaxLifetime(1800000);
            
            return new HikariDataSource(config);
        }
        
        // SPRING_DATASOURCE_URLが設定されていない場合は、デフォルトのDataSourcePropertiesを使用
        // これは通常、ローカル開発環境の場合
        System.out.println("DatabaseConfig: Using default DataSourceProperties");
        return properties.initializeDataSourceBuilder().build();
    }
}

