package com.videostep.video.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * データベース環境変数後処理クラス
 * RailwayのDATABASE_URLをJDBC URL形式に変換し、認証情報を抽出
 */
public class DatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        // デバッグ情報を出力
        System.out.println("DatabaseEnvironmentPostProcessor: Starting environment post-processing");
        System.out.println("DatabaseEnvironmentPostProcessor: Checking environment variables...");
        
        Map<String, Object> properties = new HashMap<>();
        
        // 環境変数の読み取り方法を複数試す
        // 1. System.getenv()で直接読み取る
        // 2. SpringのEnvironmentから読み取る（既に設定されている場合）
        String springDatasourceUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (springDatasourceUrl == null || springDatasourceUrl.isEmpty()) {
            // SpringのEnvironmentからも読み取る
            springDatasourceUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        }
        
        System.out.println("DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL from System.getenv() = " + (System.getenv("SPRING_DATASOURCE_URL") != null ? "set" : "null"));
        System.out.println("DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL from Environment = " + (environment.getProperty("SPRING_DATASOURCE_URL") != null ? "set" : "null"));
        System.out.println("DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL (final) = " + (springDatasourceUrl != null ? springDatasourceUrl.substring(0, Math.min(50, springDatasourceUrl.length())) + "..." : "null"));
        
        if (springDatasourceUrl != null && !springDatasourceUrl.isEmpty()) {
            // SPRING_DATASOURCE_URLが既に設定されている場合
            if (!springDatasourceUrl.startsWith("jdbc:")) {
                // JDBC形式でない場合は、jdbc:を追加
                springDatasourceUrl = "jdbc:" + springDatasourceUrl;
            }
            
            // URLから認証情報を抽出（JDBC URLに認証情報が含まれている場合）
            try {
                parseJdbcUrl(springDatasourceUrl, properties);
            } catch (Exception e) {
                System.err.println("DatabaseEnvironmentPostProcessor: Warning - Failed to parse JDBC URL: " + e.getMessage());
                // パースに失敗した場合は、そのまま使用
                properties.put("SPRING_DATASOURCE_URL", springDatasourceUrl);
            }
            
            MapPropertySource propertySource = new MapPropertySource("database-url-converter", properties);
            environment.getPropertySources().addFirst(propertySource);
            
            System.out.println("DatabaseEnvironmentPostProcessor: Using SPRING_DATASOURCE_URL from environment variable");
            return;
        }
        
        // SPRING_DATASOURCE_URLが設定されていない場合、DATABASE_URLを確認
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isEmpty()) {
            // SpringのEnvironmentからも読み取る
            databaseUrl = environment.getProperty("DATABASE_URL");
        }
        
        System.out.println("DatabaseEnvironmentPostProcessor: DATABASE_URL from System.getenv() = " + (System.getenv("DATABASE_URL") != null ? "set" : "null"));
        System.out.println("DatabaseEnvironmentPostProcessor: DATABASE_URL from Environment = " + (environment.getProperty("DATABASE_URL") != null ? "set" : "null"));
        System.out.println("DatabaseEnvironmentPostProcessor: DATABASE_URL (final) = " + (databaseUrl != null ? databaseUrl.substring(0, Math.min(50, databaseUrl.length())) + "..." : "null"));
        
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            try {
                if (databaseUrl.startsWith("jdbc:")) {
                    // 既にJDBC形式の場合
                    System.out.println("DatabaseEnvironmentPostProcessor: DATABASE_URL already in JDBC format");
                    parseJdbcUrl(databaseUrl, properties);
                } else if (databaseUrl.startsWith("postgresql://")) {
                    // postgresql://形式の場合、JDBC形式に変換して認証情報を抽出
                    System.out.println("DatabaseEnvironmentPostProcessor: Converting DATABASE_URL to JDBC format");
                    parsePostgresUrl(databaseUrl, properties);
                } else {
                    // 不明な形式
                    System.err.println("DatabaseEnvironmentPostProcessor: ERROR - DATABASE_URL has unknown format: " + (databaseUrl.length() > 50 ? databaseUrl.substring(0, 50) + "..." : databaseUrl));
                    System.err.println("DatabaseEnvironmentPostProcessor: Expected format: postgresql://... or jdbc:postgresql://...");
                    throw new IllegalStateException("DATABASE_URL has unknown format. Expected postgresql://... or jdbc:postgresql://...");
                }
                
                MapPropertySource propertySource = new MapPropertySource("database-url-converter", properties);
                environment.getPropertySources().addFirst(propertySource);
                
                System.out.println("DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL set successfully from DATABASE_URL");
                if (properties.containsKey("SPRING_DATASOURCE_USERNAME")) {
                    System.out.println("DatabaseEnvironmentPostProcessor: Username extracted from URL");
                }
                if (properties.containsKey("SPRING_DATASOURCE_PASSWORD")) {
                    System.out.println("DatabaseEnvironmentPostProcessor: Password extracted from URL");
                }
            } catch (Exception e) {
                System.err.println("DatabaseEnvironmentPostProcessor: ERROR - Failed to parse DATABASE_URL: " + e.getMessage());
                e.printStackTrace();
                throw new IllegalStateException("Failed to parse DATABASE_URL: " + e.getMessage(), e);
            }
        } else {
            // どちらも設定されていない場合
            System.err.println("DatabaseEnvironmentPostProcessor: ERROR - Neither SPRING_DATASOURCE_URL nor DATABASE_URL is set!");
            System.err.println("DatabaseEnvironmentPostProcessor: =========================================");
            System.err.println("DatabaseEnvironmentPostProcessor: RAILWAY SETUP REQUIRED:");
            System.err.println("DatabaseEnvironmentPostProcessor: =========================================");
            System.err.println("DatabaseEnvironmentPostProcessor: Please set one of the following environment variables in Railway:");
            System.err.println("DatabaseEnvironmentPostProcessor: ");
            System.err.println("DatabaseEnvironmentPostProcessor: Method 1 (Recommended): Connect Database");
            System.err.println("DatabaseEnvironmentPostProcessor:   1. Open your service in Railway dashboard");
            System.err.println("DatabaseEnvironmentPostProcessor:   2. Go to 'Variables' tab");
            System.err.println("DatabaseEnvironmentPostProcessor:   3. Click 'Connect Database' button");
            System.err.println("DatabaseEnvironmentPostProcessor:   4. Select your PostgreSQL service");
            System.err.println("DatabaseEnvironmentPostProcessor:   5. DATABASE_URL will be set automatically");
            System.err.println("DatabaseEnvironmentPostProcessor: ");
            System.err.println("DatabaseEnvironmentPostProcessor: Method 2: Set Environment Variables Manually");
            System.err.println("DatabaseEnvironmentPostProcessor:   1. Open your service in Railway dashboard");
            System.err.println("DatabaseEnvironmentPostProcessor:   2. Go to 'Variables' tab");
            System.err.println("DatabaseEnvironmentPostProcessor:   3. Add variable: SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database");
            System.err.println("DatabaseEnvironmentPostProcessor:      OR");
            System.err.println("DatabaseEnvironmentPostProcessor:   4. Add variable: DATABASE_URL=postgresql://user:password@host:port/database");
            System.err.println("DatabaseEnvironmentPostProcessor: =========================================");
            throw new IllegalStateException("SPRING_DATASOURCE_URL or DATABASE_URL must be set in Railway environment variables. See logs above for setup instructions.");
        }
    }
    
    /**
     * postgresql://形式のURLをパースして認証情報を抽出
     * 形式: postgresql://user:password@host:port/database
     */
    private void parsePostgresUrl(String url, Map<String, Object> properties) throws URISyntaxException {
        // postgresql://をjdbc:postgresql://に変換する前にパース
        URI uri = new URI(url);
        
        String userInfo = uri.getUserInfo();
        String host = uri.getHost();
        int port = uri.getPort() > 0 ? uri.getPort() : 5432;
        String database = uri.getPath();
        if (database != null && database.startsWith("/")) {
            database = database.substring(1);
        }
        
        // 認証情報を抽出
        String username = null;
        String password = null;
        if (userInfo != null && !userInfo.isEmpty()) {
            String[] userPass = userInfo.split(":", 2);
            username = URLDecoder.decode(userPass[0], StandardCharsets.UTF_8);
            if (userPass.length > 1) {
                password = URLDecoder.decode(userPass[1], StandardCharsets.UTF_8);
            }
        }
        
        // JDBC URLを構築（認証情報なし）
        String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
        
        // プロパティを設定
        properties.put("SPRING_DATASOURCE_URL", jdbcUrl);
        if (username != null && !username.isEmpty()) {
            properties.put("SPRING_DATASOURCE_USERNAME", username);
        }
        if (password != null && !password.isEmpty()) {
            properties.put("SPRING_DATASOURCE_PASSWORD", password);
        }
    }
    
    /**
     * JDBC URLをパースして認証情報を抽出
     * 形式: jdbc:postgresql://user:password@host:port/database または jdbc:postgresql://host:port/database
     */
    private void parseJdbcUrl(String jdbcUrl, Map<String, Object> properties) throws URISyntaxException {
        // jdbc:プレフィックスを削除してURIとしてパース
        String urlWithoutJdbc = jdbcUrl.substring(5); // "jdbc:".length() = 5
        URI uri = new URI(urlWithoutJdbc);
        
        String userInfo = uri.getUserInfo();
        String host = uri.getHost();
        int port = uri.getPort() > 0 ? uri.getPort() : 5432;
        String database = uri.getPath();
        if (database != null && database.startsWith("/")) {
            database = database.substring(1);
        }
        
        // 認証情報を抽出
        String username = null;
        String password = null;
        if (userInfo != null && !userInfo.isEmpty()) {
            String[] userPass = userInfo.split(":", 2);
            username = URLDecoder.decode(userPass[0], StandardCharsets.UTF_8);
            if (userPass.length > 1) {
                password = URLDecoder.decode(userPass[1], StandardCharsets.UTF_8);
            }
        }
        
        // JDBC URLを構築（認証情報なし）
        String cleanJdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
        
        // プロパティを設定
        properties.put("SPRING_DATASOURCE_URL", cleanJdbcUrl);
        if (username != null && !username.isEmpty()) {
            properties.put("SPRING_DATASOURCE_USERNAME", username);
        }
        if (password != null && !password.isEmpty()) {
            properties.put("SPRING_DATASOURCE_PASSWORD", password);
        }
    }
}

