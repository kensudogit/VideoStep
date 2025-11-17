package com.videostep.user.config;

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
        System.out.println("DatabaseEnvironmentPostProcessor: Starting environment post-processing");
        
        // まずSPRING_DATASOURCE_URLが既に設定されているか確認（Railwayで直接設定された場合）
        String springDatasourceUrl = System.getenv("SPRING_DATASOURCE_URL");
        System.out.println("DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL = " + (springDatasourceUrl != null ? springDatasourceUrl.substring(0, Math.min(50, springDatasourceUrl.length())) + "..." : "null"));
        
        if (springDatasourceUrl != null && !springDatasourceUrl.isEmpty()) {
            // SPRING_DATASOURCE_URLが既に設定されている場合は、それをそのまま使用
            if (!springDatasourceUrl.startsWith("jdbc:")) {
                // JDBC形式でない場合は、jdbc:を追加
                springDatasourceUrl = "jdbc:" + springDatasourceUrl;
            }
            
            Map<String, Object> properties = new HashMap<>();
            properties.put("SPRING_DATASOURCE_URL", springDatasourceUrl);
            
            MapPropertySource propertySource = new MapPropertySource("database-url-converter", properties);
            environment.getPropertySources().addFirst(propertySource);
            
            System.out.println("DatabaseEnvironmentPostProcessor: Using SPRING_DATASOURCE_URL from environment variable");
            return;
        }
        
        // SPRING_DATASOURCE_URLが設定されていない場合、DATABASE_URLを確認
        String databaseUrl = System.getenv("DATABASE_URL");
        System.out.println("DatabaseEnvironmentPostProcessor: DATABASE_URL = " + (databaseUrl != null ? databaseUrl.substring(0, Math.min(50, databaseUrl.length())) + "..." : "null"));
        
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            String jdbcUrl;
            
            if (databaseUrl.startsWith("jdbc:")) {
                // 既にJDBC形式の場合
                jdbcUrl = databaseUrl;
                System.out.println("DatabaseEnvironmentPostProcessor: DATABASE_URL already in JDBC format");
            } else if (databaseUrl.startsWith("postgresql://")) {
                // postgresql://形式の場合、JDBC形式に変換
                jdbcUrl = "jdbc:" + databaseUrl;
                System.out.println("DatabaseEnvironmentPostProcessor: Converting DATABASE_URL to JDBC format = " + jdbcUrl.substring(0, Math.min(80, jdbcUrl.length())) + "...");
            } else {
                // 不明な形式
                System.err.println("DatabaseEnvironmentPostProcessor: ERROR - DATABASE_URL has unknown format: " + (databaseUrl.length() > 50 ? databaseUrl.substring(0, 50) + "..." : databaseUrl));
                System.err.println("DatabaseEnvironmentPostProcessor: Expected format: postgresql://... or jdbc:postgresql://...");
                throw new IllegalStateException("DATABASE_URL has unknown format. Expected postgresql://... or jdbc:postgresql://...");
            }
            
            Map<String, Object> properties = new HashMap<>();
            properties.put("SPRING_DATASOURCE_URL", jdbcUrl);
            
            MapPropertySource propertySource = new MapPropertySource("database-url-converter", properties);
            environment.getPropertySources().addFirst(propertySource);
            
            System.out.println("DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL");
        } else {
            // どちらも設定されていない場合
            System.err.println("DatabaseEnvironmentPostProcessor: ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!");
            System.err.println("DatabaseEnvironmentPostProcessor: Please set one of the following environment variables in Railway:");
            System.err.println("DatabaseEnvironmentPostProcessor:   1. SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database");
            System.err.println("DatabaseEnvironmentPostProcessor:   2. DATABASE_URL=postgresql://user:password@host:port/database");
            throw new IllegalStateException("SPRING_DATASOURCE_URL or DATABASE_URL must be set in Railway environment variables");
        }
    }
}

