package com.videostep.auth.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

/**
 * データベース環境変数後処理クラス
 * RailwayのDATABASE_URLをJDBC URL形式に変換
 */
public class DatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        // システム環境変数から直接読み取る
        String databaseUrl = System.getenv("DATABASE_URL");
        
        System.out.println("DatabaseEnvironmentPostProcessor: DATABASE_URL = " + (databaseUrl != null ? databaseUrl.substring(0, Math.min(50, databaseUrl.length())) + "..." : "null"));
        
        if (databaseUrl != null && !databaseUrl.isEmpty() && !databaseUrl.startsWith("jdbc:")) {
            if (databaseUrl.startsWith("postgresql://")) {
                String jdbcUrl = "jdbc:" + databaseUrl;
                
                System.out.println("DatabaseEnvironmentPostProcessor: Converting to JDBC URL = " + jdbcUrl.substring(0, Math.min(80, jdbcUrl.length())) + "...");
                
                Map<String, Object> properties = new HashMap<>();
                properties.put("SPRING_DATASOURCE_URL", jdbcUrl);
                
                MapPropertySource propertySource = new MapPropertySource("database-url-converter", properties);
                environment.getPropertySources().addFirst(propertySource);
                
                System.out.println("DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully");
            }
        } else {
            System.out.println("DatabaseEnvironmentPostProcessor: DATABASE_URL not set or already in JDBC format");
        }
    }
}

