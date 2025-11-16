package com.videostep.editing.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * データベース設定クラス
 * RailwayのDATABASE_URLをJDBC URL形式に変換して環境変数に設定
 */
@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @PostConstruct
    public void init() {
        // DATABASE_URLが設定されている場合、JDBC URL形式に変換してSPRING_DATASOURCE_URLに設定
        if (databaseUrl != null && !databaseUrl.isEmpty() && !databaseUrl.startsWith("jdbc:")) {
            if (databaseUrl.startsWith("postgresql://")) {
                String jdbcUrl = "jdbc:" + databaseUrl;
                System.setProperty("SPRING_DATASOURCE_URL", jdbcUrl);
            }
        }
    }
}

