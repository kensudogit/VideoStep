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
            boolean hasCredentials = false;
            try {
                parseJdbcUrl(springDatasourceUrl, properties);
                // 認証情報が抽出されたかチェック
                hasCredentials = properties.containsKey("spring.datasource.username") && 
                                 properties.containsKey("spring.datasource.password");
                if (hasCredentials) {
                    System.out.println("DatabaseEnvironmentPostProcessor: Credentials extracted from SPRING_DATASOURCE_URL");
                } else {
                    System.out.println("DatabaseEnvironmentPostProcessor: No credentials in SPRING_DATASOURCE_URL, checking DATABASE_URL");
                }
            } catch (Exception e) {
                System.err.println("DatabaseEnvironmentPostProcessor: Warning - Failed to parse JDBC URL: " + e.getMessage());
                // パースに失敗した場合は、そのまま使用
                properties.put("spring.datasource.url", springDatasourceUrl);
            }
            
            // SPRING_DATASOURCE_URLに認証情報が含まれていない場合、DATABASE_URLから取得を試みる
            if (!hasCredentials) {
                String databaseUrl = System.getenv("DATABASE_URL");
                if (databaseUrl == null || databaseUrl.isEmpty()) {
                    databaseUrl = environment.getProperty("DATABASE_URL");
                }
                
                if (databaseUrl != null && !databaseUrl.isEmpty()) {
                    System.out.println("DatabaseEnvironmentPostProcessor: Attempting to extract credentials from DATABASE_URL");
                    try {
                        Map<String, Object> dbUrlProperties = new HashMap<>();
                        if (databaseUrl.startsWith("jdbc:")) {
                            parseJdbcUrl(databaseUrl, dbUrlProperties);
                        } else if (databaseUrl.startsWith("postgresql://")) {
                            parsePostgresUrl(databaseUrl, dbUrlProperties);
                        }
                        
                        // DATABASE_URLから認証情報を取得
                        if (dbUrlProperties.containsKey("spring.datasource.username")) {
                            properties.put("spring.datasource.username", dbUrlProperties.get("spring.datasource.username"));
                            System.out.println("DatabaseEnvironmentPostProcessor: Username extracted from DATABASE_URL");
                        }
                        if (dbUrlProperties.containsKey("spring.datasource.password")) {
                            properties.put("spring.datasource.password", dbUrlProperties.get("spring.datasource.password"));
                            System.out.println("DatabaseEnvironmentPostProcessor: Password extracted from DATABASE_URL");
                        }
                        
                        // DATABASE_URLから完全なJDBC URLも取得
                        if (dbUrlProperties.containsKey("spring.datasource.url")) {
                            properties.put("spring.datasource.url", dbUrlProperties.get("spring.datasource.url"));
                            System.out.println("DatabaseEnvironmentPostProcessor: Using JDBC URL from DATABASE_URL");
                        }
                    } catch (Exception e) {
                        System.err.println("DatabaseEnvironmentPostProcessor: Warning - Failed to extract credentials from DATABASE_URL: " + e.getMessage());
                        e.printStackTrace();
                    }
                } else {
                    System.out.println("DatabaseEnvironmentPostProcessor: DATABASE_URL not available for credential extraction");
                    System.err.println("DatabaseEnvironmentPostProcessor: ERROR - SPRING_DATASOURCE_URL has no credentials and DATABASE_URL is not set!");
                    System.err.println("DatabaseEnvironmentPostProcessor: Please ensure DATABASE_URL is set in Railway environment variables.");
                }
            }
            
            // 認証情報がまだない場合はエラー
            if (!properties.containsKey("spring.datasource.username") || !properties.containsKey("spring.datasource.password")) {
                System.err.println("DatabaseEnvironmentPostProcessor: ERROR - No database credentials found!");
                System.err.println("DatabaseEnvironmentPostProcessor: SPRING_DATASOURCE_URL: " + (springDatasourceUrl != null ? "set" : "null"));
                System.err.println("DatabaseEnvironmentPostProcessor: DATABASE_URL: " + (System.getenv("DATABASE_URL") != null ? "set" : "null"));
                throw new IllegalStateException("Database credentials (username and password) are required but not found. Please set DATABASE_URL in Railway.");
            }
            
            MapPropertySource propertySource = new MapPropertySource("database-url-converter", properties);
            environment.getPropertySources().addFirst(propertySource);
            
            System.out.println("DatabaseEnvironmentPostProcessor: Database configuration set successfully");
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
                
                System.out.println("DatabaseEnvironmentPostProcessor: spring.datasource.url set successfully from DATABASE_URL");
                if (properties.containsKey("spring.datasource.username")) {
                    System.out.println("DatabaseEnvironmentPostProcessor: Username extracted from URL");
                }
                if (properties.containsKey("spring.datasource.password")) {
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
     * URIクラスを使わず、手動でパースして特殊文字を正しく処理
     */
    private void parsePostgresUrl(String url, Map<String, Object> properties) {
        try {
            // postgresql://を削除
            String urlWithoutScheme = url.substring("postgresql://".length());
            
            // @の位置を探す（認証情報とホストの境界）
            int atIndex = urlWithoutScheme.indexOf('@');
            if (atIndex == -1) {
                throw new IllegalArgumentException("No @ found in DATABASE_URL");
            }
            
            // 認証情報部分を抽出（user:password）
            String credentials = urlWithoutScheme.substring(0, atIndex);
            String hostAndPath = urlWithoutScheme.substring(atIndex + 1);
            
            // ユーザー名とパスワードを分割（最初の:で分割）
            int colonIndex = credentials.indexOf(':');
            String username;
            String password;
            if (colonIndex > 0) {
                String rawUsername = credentials.substring(0, colonIndex);
                String rawPassword = credentials.substring(colonIndex + 1);
                
                // URLデコードを試みる（エンコードされていない場合はそのまま）
                try {
                    username = URLDecoder.decode(rawUsername, StandardCharsets.UTF_8);
                } catch (Exception e) {
                    username = rawUsername;
                }
                try {
                    password = URLDecoder.decode(rawPassword, StandardCharsets.UTF_8);
                } catch (Exception e) {
                    password = rawPassword;
                }
            } else {
                // パスワードがない場合
                try {
                    username = URLDecoder.decode(credentials, StandardCharsets.UTF_8);
                } catch (Exception e) {
                    username = credentials;
                }
                password = null;
            }
            
            // ホスト、ポート、データベース名を抽出
            // host:port/database または host/database の形式
            String host;
            int port = 5432;
            String database;
            
            int slashIndex = hostAndPath.indexOf('/');
            if (slashIndex == -1) {
                throw new IllegalArgumentException("No database name found in DATABASE_URL");
            }
            
            String hostAndPort = hostAndPath.substring(0, slashIndex);
            database = URLDecoder.decode(hostAndPath.substring(slashIndex + 1), StandardCharsets.UTF_8);
            
            // ホストとポートを分割
            int portColonIndex = hostAndPort.lastIndexOf(':');
            if (portColonIndex > 0) {
                host = hostAndPort.substring(0, portColonIndex);
                try {
                    port = Integer.parseInt(hostAndPort.substring(portColonIndex + 1));
                } catch (NumberFormatException e) {
                    System.err.println("DatabaseEnvironmentPostProcessor: WARNING - Invalid port, using default 5432");
                }
            } else {
                host = hostAndPort;
            }
            
            System.out.println("DatabaseEnvironmentPostProcessor: Extracted username length: " + (username != null ? username.length() : 0));
            System.out.println("DatabaseEnvironmentPostProcessor: Extracted password length: " + (password != null ? password.length() : 0));
            System.out.println("DatabaseEnvironmentPostProcessor: Extracted host: " + host);
            System.out.println("DatabaseEnvironmentPostProcessor: Extracted port: " + port);
            System.out.println("DatabaseEnvironmentPostProcessor: Extracted database: " + database);
            
            // デバッグ: 抽出された認証情報の最初の数文字を表示（セキュリティのため完全には表示しない）
            if (username != null && !username.isEmpty()) {
                System.out.println("DatabaseEnvironmentPostProcessor: Extracted username (first 3 chars): " + username.substring(0, Math.min(3, username.length())) + "...");
            }
            if (password != null && !password.isEmpty()) {
                // パスワードの最初の文字と最後の文字のみを表示（セキュリティのため）
                System.out.println("DatabaseEnvironmentPostProcessor: Extracted password (first char): " + password.charAt(0) + "*** (length: " + password.length() + ")");
                // パスワードに特殊文字が含まれているかチェック
                boolean hasSpecialChars = password.chars().anyMatch(c -> !Character.isLetterOrDigit(c));
                System.out.println("DatabaseEnvironmentPostProcessor: Password contains special characters: " + hasSpecialChars);
                // デバッグ: パスワードの各文字のタイプを確認（URLエンコードされた文字を検出）
                boolean hasPercent = password.contains("%");
                System.out.println("DatabaseEnvironmentPostProcessor: Password contains % (URL encoded): " + hasPercent);
                // デバッグ: パスワードの文字コードを確認（最初の3文字のみ）
                if (password.length() >= 3) {
                    System.out.println("DatabaseEnvironmentPostProcessor: Password first 3 chars codes: " + 
                        (int)password.charAt(0) + "," + (int)password.charAt(1) + "," + (int)password.charAt(2));
                }
            }
            
            // JDBC URLを構築（認証情報なし）
            String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
            System.out.println("DatabaseEnvironmentPostProcessor: Clean JDBC URL = " + jdbcUrl.substring(0, Math.min(80, jdbcUrl.length())) + "...");
            
            // プロパティを設定（Spring Bootの標準プロパティ名を使用）
            properties.put("spring.datasource.url", jdbcUrl);
            if (username != null && !username.isEmpty()) {
                properties.put("spring.datasource.username", username);
                System.out.println("DatabaseEnvironmentPostProcessor: Set spring.datasource.username = " + username);
            } else {
                System.err.println("DatabaseEnvironmentPostProcessor: ERROR - Username is null or empty!");
            }
            if (password != null && !password.isEmpty()) {
                properties.put("spring.datasource.password", password);
                System.out.println("DatabaseEnvironmentPostProcessor: Set spring.datasource.password (length: " + password.length() + ")");
            } else {
                System.err.println("DatabaseEnvironmentPostProcessor: ERROR - Password is null or empty!");
            }
        } catch (Exception e) {
            System.err.println("DatabaseEnvironmentPostProcessor: ERROR - Failed to parse postgresql:// URL: " + e.getMessage());
            e.printStackTrace();
            throw new IllegalStateException("Failed to parse DATABASE_URL: " + e.getMessage(), e);
        }
    }
    
    /**
     * JDBC URLをパースして認証情報を抽出
     * 形式: jdbc:postgresql://user:password@host:port/database または jdbc:postgresql://host:port/database
     * URIクラスを使わず、手動でパースして特殊文字を正しく処理
     */
    private void parseJdbcUrl(String jdbcUrl, Map<String, Object> properties) {
        try {
            // jdbc:postgresql://を削除
            if (!jdbcUrl.startsWith("jdbc:postgresql://")) {
                throw new IllegalArgumentException("Invalid JDBC URL format: " + jdbcUrl);
            }
            String urlWithoutScheme = jdbcUrl.substring("jdbc:postgresql://".length());
            
            // @の位置を探す（認証情報とホストの境界）
            int atIndex = urlWithoutScheme.indexOf('@');
            String username = null;
            String password = null;
            String hostAndPath;
            
            if (atIndex > 0) {
                // 認証情報がある場合
                String credentials = urlWithoutScheme.substring(0, atIndex);
                hostAndPath = urlWithoutScheme.substring(atIndex + 1);
                
                // ユーザー名とパスワードを分割（最初の:で分割）
                int colonIndex = credentials.indexOf(':');
                if (colonIndex > 0) {
                    String rawUsername = credentials.substring(0, colonIndex);
                    String rawPassword = credentials.substring(colonIndex + 1);
                    
                    // URLデコードを試みる（エンコードされていない場合はそのまま）
                    try {
                        username = URLDecoder.decode(rawUsername, StandardCharsets.UTF_8);
                    } catch (Exception e) {
                        username = rawUsername;
                    }
                    try {
                        password = URLDecoder.decode(rawPassword, StandardCharsets.UTF_8);
                    } catch (Exception e) {
                        password = rawPassword;
                    }
                } else {
                    // パスワードがない場合
                    try {
                        username = URLDecoder.decode(credentials, StandardCharsets.UTF_8);
                    } catch (Exception e) {
                        username = credentials;
                    }
                }
            } else {
                // 認証情報がない場合
                hostAndPath = urlWithoutScheme;
            }
            
            // ホスト、ポート、データベース名を抽出
            String host;
            int port = 5432;
            String database;
            
            int slashIndex = hostAndPath.indexOf('/');
            if (slashIndex == -1) {
                throw new IllegalArgumentException("No database name found in JDBC URL");
            }
            
            String hostAndPort = hostAndPath.substring(0, slashIndex);
            database = URLDecoder.decode(hostAndPath.substring(slashIndex + 1), StandardCharsets.UTF_8);
            
            // ホストとポートを分割
            int portColonIndex = hostAndPort.lastIndexOf(':');
            if (portColonIndex > 0) {
                host = hostAndPort.substring(0, portColonIndex);
                try {
                    port = Integer.parseInt(hostAndPort.substring(portColonIndex + 1));
                } catch (NumberFormatException e) {
                    System.err.println("DatabaseEnvironmentPostProcessor: WARNING - Invalid port, using default 5432");
                }
            } else {
                host = hostAndPort;
            }
            
            if (username != null) {
                System.out.println("DatabaseEnvironmentPostProcessor: Extracted username length: " + username.length());
            }
            if (password != null) {
                System.out.println("DatabaseEnvironmentPostProcessor: Extracted password length: " + password.length());
            }
            System.out.println("DatabaseEnvironmentPostProcessor: Extracted host: " + host);
            System.out.println("DatabaseEnvironmentPostProcessor: Extracted port: " + port);
            System.out.println("DatabaseEnvironmentPostProcessor: Extracted database: " + database);
            
            // JDBC URLを構築（認証情報なし）
            String cleanJdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
            System.out.println("DatabaseEnvironmentPostProcessor: Clean JDBC URL = " + cleanJdbcUrl.substring(0, Math.min(80, cleanJdbcUrl.length())) + "...");
            
            // プロパティを設定（Spring Bootの標準プロパティ名を使用）
            properties.put("spring.datasource.url", cleanJdbcUrl);
            if (username != null && !username.isEmpty()) {
                properties.put("spring.datasource.username", username);
                System.out.println("DatabaseEnvironmentPostProcessor: Set spring.datasource.username");
            } else {
                System.err.println("DatabaseEnvironmentPostProcessor: ERROR - Username is null or empty!");
            }
            if (password != null && !password.isEmpty()) {
                properties.put("spring.datasource.password", password);
                System.out.println("DatabaseEnvironmentPostProcessor: Set spring.datasource.password");
            } else {
                System.err.println("DatabaseEnvironmentPostProcessor: ERROR - Password is null or empty!");
            }
        } catch (Exception e) {
            System.err.println("DatabaseEnvironmentPostProcessor: ERROR - Failed to parse JDBC URL: " + e.getMessage());
            e.printStackTrace();
            throw new IllegalStateException("Failed to parse JDBC URL: " + e.getMessage(), e);
        }
    }
}

