package com.videostep.video.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.sql.Connection;

/**
 * データベース設定クラス
 * SPRING_DATASOURCE_*環境変数またはspring.datasource.*プロパティを使用してDataSourceを作成
 * DATABASE_URLを直接使わず、認証情報を分離して設定することでホスト名の問題を解決
 */
@Configuration
public class DatabaseConfig {

    @Autowired
    private Environment environment;

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        // SPRING_DATASOURCE_*環境変数を優先的に読み取る
        // なければ、DatabaseEnvironmentPostProcessorが設定したspring.datasource.*プロパティを使用
        String jdbcUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        if (jdbcUrl == null || jdbcUrl.isEmpty()) {
            jdbcUrl = environment.getProperty("spring.datasource.url");
        }

        // MySQLの環境変数を優先的に使用（MYSQL_USER, MYSQL_PASSWORD）
        String username = environment.getProperty("MYSQL_USER");
        if (username == null || username.isEmpty()) {
            username = environment.getProperty("SPRING_DATASOURCE_USERNAME");
        }
        if (username == null || username.isEmpty()) {
            username = environment.getProperty("spring.datasource.username");
        }
        // ユーザー名の前後の空白をトリム
        if (username != null) {
            username = username.trim();
        }

        String password = environment.getProperty("MYSQL_PASSWORD");
        if (password == null || password.isEmpty()) {
            password = environment.getProperty("SPRING_DATASOURCE_PASSWORD");
        }
        if (password == null || password.isEmpty()) {
            password = environment.getProperty("spring.datasource.password");
        }
        // パスワードの前後の空白をトリム
        if (password != null) {
            password = password.trim();
        }

        // DATABASE_URLから直接抽出を試みる
        if ((username == null || username.isEmpty() || password == null || password.isEmpty())) {
            String databaseUrl = System.getenv("DATABASE_URL");
            if (databaseUrl != null && !databaseUrl.isEmpty()
                    && (databaseUrl.startsWith("mysql://") || databaseUrl.startsWith("mysqlx://"))) {
                try {
                    // DATABASE_URLから認証情報を抽出: mysql://user:password@host:port/database
                    String urlWithoutPrefix = databaseUrl.substring(databaseUrl.indexOf("://") + 3);
                    int atIndex = urlWithoutPrefix.indexOf('@');
                    if (atIndex > 0) {
                        String credentials = urlWithoutPrefix.substring(0, atIndex);
                        int colonIndex = credentials.indexOf(':');
                        if (colonIndex > 0) {
                            if (username == null || username.isEmpty()) {
                                String rawUsername = credentials.substring(0, colonIndex);
                                // URLデコードを試みる
                                try {
                                    username = java.net.URLDecoder.decode(rawUsername,
                                            java.nio.charset.StandardCharsets.UTF_8);
                                } catch (Exception e) {
                                    username = rawUsername;
                                }
                                username = username.trim();
                            }
                            if (password == null || password.isEmpty()) {
                                String rawPassword = credentials.substring(colonIndex + 1);
                                // URLエンコードされた文字（%XX形式）が含まれているかチェック
                                if (rawPassword.contains("%")) {
                                    try {
                                        password = java.net.URLDecoder.decode(rawPassword,
                                                java.nio.charset.StandardCharsets.UTF_8);
                                    } catch (Exception e) {
                                        password = rawPassword;
                                    }
                                } else {
                                    password = rawPassword;
                                }
                                password = password.trim();
                            }
                        }
                    }
                } catch (Exception e) {
                    System.out.println(
                            "DatabaseConfig: Failed to extract credentials from DATABASE_URL: " + e.getMessage());
                    e.printStackTrace();
                }
            }
        }

        // 認証情報をスキップするオプションをチェック
        String skipAuth = environment.getProperty("SKIP_DATABASE_AUTHENTICATION");
        boolean skipAuthentication = skipAuth != null &&
                (skipAuth.equalsIgnoreCase("true") || skipAuth.equalsIgnoreCase("1")
                        || skipAuth.equalsIgnoreCase("yes"));

        // 認証情報が空の場合は自動的にスキップ
        if (!skipAuthentication && (username == null || username.isEmpty() || password == null || password.isEmpty())) {
            System.out.println("DatabaseConfig: INFO - Username or password is empty, will skip authentication");
            skipAuthentication = true;
        }

        // JDBC URLが設定されている場合は、カスタムDataSourceを作成
        if (jdbcUrl != null && !jdbcUrl.isEmpty()) {
            // PostgreSQL URLをMySQL URLに変換
            if (jdbcUrl.startsWith("jdbc:postgresql://")) {
                System.out.println("DatabaseConfig: Converting PostgreSQL URL to MySQL URL");
                jdbcUrl = jdbcUrl.replace("jdbc:postgresql://", "jdbc:mysql://");
                // ポート5432を3306に変更（URL内にポートが含まれている場合）
                jdbcUrl = jdbcUrl.replace(":5432/", ":3306/");
                jdbcUrl = jdbcUrl.replace(":5432?", ":3306?");
            } else if (jdbcUrl.startsWith("postgresql://")) {
                System.out.println("DatabaseConfig: Converting PostgreSQL URL to MySQL URL");
                jdbcUrl = jdbcUrl.replace("postgresql://", "mysql://");
                jdbcUrl = jdbcUrl.replace(":5432/", ":3306/");
                jdbcUrl = jdbcUrl.replace(":5432?", ":3306?");
            }

            // JDBC形式でない場合は、jdbc:mysql://を追加
            if (!jdbcUrl.startsWith("jdbc:")) {
                if (jdbcUrl.startsWith("mysql://") || jdbcUrl.startsWith("mysqlx://")) {
                    jdbcUrl = "jdbc:mysql://" + jdbcUrl.substring(jdbcUrl.indexOf("://") + 3);
                } else {
                    jdbcUrl = "jdbc:mysql://" + jdbcUrl;
                }
            }

            // MySQL URL形式の調整
            if (!jdbcUrl.contains("?")) {
                jdbcUrl += "?useSSL=false&allowPublicKeyRetrieval=true";
            } else if (!jdbcUrl.contains("useSSL")) {
                jdbcUrl += "&useSSL=false&allowPublicKeyRetrieval=true";
            }

            System.out.println(
                    "DatabaseConfig: Using JDBC URL = " + jdbcUrl.substring(0, Math.min(80, jdbcUrl.length())) + "...");

            // デバッグ: 実際に使用される認証情報を確認
            System.out.println("DatabaseConfig: DEBUG - Username from environment: " +
                    (username != null ? "'" + username + "' (length: " + username.length() + ")" : "null"));
            System.out.println("DatabaseConfig: DEBUG - Password from environment: " +
                    (password != null ? "*** (length: " + password.length() + ")" : "null"));

            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setDriverClassName("com.mysql.cj.jdbc.Driver");

            // 認証情報を設定（空の場合は設定しない - PostgreSQLのデフォルト認証を使用）
            // SKIP_DATABASE_AUTHENTICATIONがtrueの場合は認証情報を設定しない
            if (skipAuthentication) {
                System.out
                        .println("DatabaseConfig: INFO - SKIP_DATABASE_AUTHENTICATION is set, skipping authentication");
            } else if (username != null && !username.isEmpty()) {
                config.setUsername(username);
                System.out.println("DatabaseConfig: Using USERNAME = " + username);
            } else {
                System.out.println("DatabaseConfig: INFO - Username is not set, will use default authentication");
            }

            if (skipAuthentication) {
                System.out.println("DatabaseConfig: INFO - SKIP_DATABASE_AUTHENTICATION is set, password not set");
            } else if (password != null && !password.isEmpty()) {
                config.setPassword(password);
                System.out.println("DatabaseConfig: Password set (length: " + password.length() + ")");
                // デバッグ: パスワードの最初の文字のみを表示（セキュリティのため）
                System.out.println("DatabaseConfig: Password first char: " + password.charAt(0) + "***");
                // パスワードに特殊文字が含まれているかチェック
                boolean hasSpecialChars = password.chars().anyMatch(c -> !Character.isLetterOrDigit(c));
                System.out.println("DatabaseConfig: Password contains special characters: " + hasSpecialChars);
                // デバッグ: パスワードの各文字のタイプを確認（URLエンコードされた文字を検出）
                boolean hasPercent = password.contains("%");
                System.out.println("DatabaseConfig: Password contains % (URL encoded): " + hasPercent);
                // デバッグ: パスワードの文字コードを確認（最初の3文字のみ）
                if (password.length() >= 3) {
                    System.out.println("DatabaseConfig: Password first 3 chars codes: " +
                            (int) password.charAt(0) + "," + (int) password.charAt(1) + "," + (int) password.charAt(2));
                }
                // パスワードの全文字コードを表示（制御文字や非表示文字を検出するため）
                StringBuilder charCodes = new StringBuilder();
                for (int i = 0; i < password.length(); i++) {
                    if (i > 0) {
                        charCodes.append(",");
                    }
                    charCodes.append((int) password.charAt(i));
                }
                System.out.println("DatabaseConfig: Password all char codes: " + charCodes.toString());
                // 制御文字（0-31、127）が含まれているかチェック
                boolean hasControlChars = password.chars().anyMatch(c -> c < 32 || c == 127);
                System.out.println("DatabaseConfig: Password contains control characters: " + hasControlChars);
            } else {
                System.out.println("DatabaseConfig: INFO - Password is not set, will use default authentication");
            }

            // 接続プールの設定
            config.setMaximumPoolSize(10);
            // 最小アイドル接続数を1に設定（初期接続を確立）
            config.setMinimumIdle(1);
            // 接続タイムアウトを30秒に設定（プールからの接続取得タイムアウト）
            config.setConnectionTimeout(30000);
            config.setIdleTimeout(600000);
            config.setMaxLifetime(1800000);
            // 初期化失敗時のタイムアウトを60秒に設定（プール初期化のタイムアウト）
            // これにより、プールが初期化されるまで待機する
            config.setInitializationFailTimeout(60000);
            // 接続検証のためのクエリ
            config.setConnectionTestQuery("SELECT 1");

            // 認証情報が設定されている場合でも、認証に失敗した場合は再接続を試みる
            if (!skipAuthentication && username != null && !username.isEmpty() && password != null
                    && !password.isEmpty()) {
                // リトライロジックを追加（最大3回、各リトライの間に5秒待機）
                int maxRetries = 3;
                int retryDelayMs = 5000;
                Exception lastException = null;

                for (int attempt = 1; attempt <= maxRetries; attempt++) {
                    HikariDataSource dataSource = null;
                    try {
                        System.out.println("DatabaseConfig: Attempting database connection (attempt " + attempt + "/"
                                + maxRetries + ")");
                        dataSource = new HikariDataSource(config);

                        // HikariCPの接続プールが初期化されるまで少し待機
                        // プールの初期化は非同期で行われるため、接続取得前に待機が必要
                        System.out.println("DatabaseConfig: Waiting for connection pool initialization...");
                        Thread.sleep(3000); // 3秒待機（プール初期化と最初の接続確立の時間）

                        // 接続テストを実行
                        // initializationFailTimeoutが設定されているため、HikariCPが自動的に
                        // プールの初期化を待機するが、念のため少し待機してから接続を取得
                        System.out.println("DatabaseConfig: Attempting to get connection from pool...");
                        try (Connection conn = dataSource.getConnection()) {
                            // 接続成功
                            System.out.println("DatabaseConfig: Connection test successful with authentication");
                            return dataSource;
                        } catch (java.sql.SQLTransientConnectionException e) {
                            // タイムアウトエラーの場合
                            String errorMsg = e.getMessage();
                            if (errorMsg != null && (errorMsg.contains("timed out") || errorMsg.contains("timeout")
                                    || errorMsg.contains("Connection is not available"))) {
                                System.err.println("DatabaseConfig: 時間切れ - データベース接続のタイムアウトが発生しました");
                                System.err.println(
                                        "DatabaseConfig: Timeout occurred while waiting for database connection");
                                System.err.println("DatabaseConfig: Error message: " + errorMsg);
                                System.err.println("DatabaseConfig: Connection timeout setting: "
                                        + config.getConnectionTimeout() + "ms");
                                System.err.println("DatabaseConfig: Initialization fail timeout: "
                                        + config.getInitializationFailTimeout() + "ms");
                                // タイムアウトエラーとして再スロー
                                throw e;
                            }
                            // その他のSQLTransientConnectionExceptionの場合はそのまま再スロー
                            throw e;
                        } catch (java.sql.SQLException e) {
                            // SQLExceptionでタイムアウトが含まれている場合
                            String errorMsg = e.getMessage();
                            if (errorMsg != null && (errorMsg.contains("timed out") || errorMsg.contains("timeout")
                                    || errorMsg.contains("Connection is not available"))) {
                                System.err.println("DatabaseConfig: 時間切れ - データベース接続のタイムアウトが発生しました");
                                System.err.println(
                                        "DatabaseConfig: Timeout occurred while waiting for database connection");
                                System.err.println("DatabaseConfig: Error message: " + errorMsg);
                                System.err.println("DatabaseConfig: Connection timeout setting: "
                                        + config.getConnectionTimeout() + "ms");
                                System.err.println("DatabaseConfig: Initialization fail timeout: "
                                        + config.getInitializationFailTimeout() + "ms");
                                // タイムアウトエラーとして再スロー
                                throw e;
                            }
                            // その他のSQLExceptionの場合はそのまま再スロー
                            throw e;
                        }
                    } catch (Exception e) {
                        lastException = e;
                        String errorMessage = e.getMessage();
                        String exceptionType = e.getClass().getSimpleName();

                        // タイムアウトエラーの検出
                        boolean isTimeoutError = false;
                        if (errorMessage != null) {
                            isTimeoutError = errorMessage.contains("timed out") || errorMessage.contains("timeout")
                                    || errorMessage.contains("Connection is not available")
                                    || errorMessage.contains("request timed out");
                        }
                        if (exceptionType.contains("TimeoutException")
                                || exceptionType.contains("SQLTransientConnectionException")) {
                            isTimeoutError = true;
                        }

                        if (isTimeoutError) {
                            System.err.println("DatabaseConfig: 時間切れ - データベース接続のタイムアウトが発生しました");
                            System.err.println("DatabaseConfig: Timeout occurred during connection attempt " + attempt);
                            System.err.println("DatabaseConfig: Error type: " + exceptionType);
                            if (errorMessage != null) {
                                System.err.println("DatabaseConfig: Error message: " + errorMessage);
                            }
                            System.err.println("DatabaseConfig: Connection timeout setting: "
                                    + config.getConnectionTimeout() + "ms");
                            System.err.println("DatabaseConfig: Initialization fail timeout: "
                                    + config.getInitializationFailTimeout() + "ms");
                        } else {
                            System.out
                                    .println("DatabaseConfig: Connection attempt " + attempt + " failed: "
                                            + exceptionType);
                            if (errorMessage != null) {
                                System.out.println("DatabaseConfig: Error message: " + errorMessage);
                            }
                        }

                        // データソースをクリーンアップ
                        if (dataSource != null) {
                            try {
                                dataSource.close();
                            } catch (Exception closeEx) {
                                System.out.println("DatabaseConfig: Error closing dataSource: " + closeEx.getMessage());
                            }
                        }

                        // 接続タイムアウト、通信エラー、またはプール初期化エラーの場合のみリトライ
                        boolean isRetryable = false;
                        if (errorMessage != null) {
                            isRetryable = errorMessage.contains("Communications link failure")
                                    || errorMessage.contains("Connect timed out")
                                    || errorMessage.contains("Connection refused")
                                    || errorMessage.contains("Network is unreachable")
                                    || errorMessage.contains("Connection is not available")
                                    || errorMessage.contains("request timed out")
                                    || exceptionType.contains("SocketTimeoutException")
                                    || exceptionType.contains("CommunicationsException")
                                    || exceptionType.contains("SQLTransientConnectionException");
                        }
                        if (exceptionType.contains("TimeoutException")
                                || exceptionType.contains("SQLTransientConnectionException")) {
                            isRetryable = true;
                        }

                        if (isRetryable && attempt < maxRetries) {
                            if (isTimeoutError) {
                                System.err.println(
                                        "DatabaseConfig: 時間切れ - リトライします (試行 " + attempt + "/" + maxRetries + ")");
                                System.err.println("DatabaseConfig: Timeout error detected. Retrying in "
                                        + (retryDelayMs / 1000) + " seconds...");
                            } else {
                                System.out.println("DatabaseConfig: Retryable error detected. Waiting "
                                        + (retryDelayMs / 1000) + " seconds before retry...");
                            }
                            try {
                                Thread.sleep(retryDelayMs);
                            } catch (InterruptedException ie) {
                                Thread.currentThread().interrupt();
                                System.err.println("DatabaseConfig: 時間切れ - リトライが中断されました");
                                System.err.println("DatabaseConfig: Connection retry interrupted");
                                throw new RuntimeException("Connection retry interrupted", ie);
                            }
                            // リトライ時に待機時間を増やす（指数バックオフ）
                            retryDelayMs = (int) (retryDelayMs * 1.5);
                            continue;
                        }

                        // 認証エラーの場合
                        if (errorMessage != null
                                && (errorMessage.contains("Access denied")
                                        || errorMessage.contains("authentication"))) {
                            System.out.println("DatabaseConfig: ERROR - Password authentication failed");
                            System.out.println("DatabaseConfig: Original error: " + errorMessage);
                            System.out.println("DatabaseConfig: Attempted username: " + username);
                            System.out.println("DatabaseConfig: Attempted password length: "
                                    + (password != null ? password.length() : 0));
                            System.out.println("DatabaseConfig: JDBC URL: " + jdbcUrl);

                            // DATABASE_URLの情報を出力（デバッグ用）
                            String databaseUrl = System.getenv("DATABASE_URL");
                            if (databaseUrl != null && !databaseUrl.isEmpty()) {
                                // パスワード部分をマスク
                                String maskedUrl = databaseUrl;
                                if (maskedUrl.contains("@")) {
                                    int atIndex = maskedUrl.indexOf("@");
                                    String beforeAt = maskedUrl.substring(0, atIndex);
                                    String afterAt = maskedUrl.substring(atIndex);
                                    if (beforeAt.contains(":")) {
                                        int colonIndex = beforeAt.indexOf(":");
                                        String userPart = beforeAt.substring(0, colonIndex);
                                        maskedUrl = userPart + ":****@" + afterAt;
                                    }
                                }
                                System.out.println("DatabaseConfig: DATABASE_URL (masked): " +
                                        maskedUrl.substring(0, Math.min(100, maskedUrl.length())) + "...");
                            }

                            // パスワードが正しくない可能性がある場合の追加情報
                            System.out.println("DatabaseConfig: TROUBLESHOOTING:");
                            System.out
                                    .println("DatabaseConfig: 1. Verify DATABASE_URL in Railway environment variables");
                            System.out
                                    .println("DatabaseConfig:    - Go to Railway dashboard > Your service > Variables");
                            System.out.println(
                                    "DatabaseConfig:    - Check DATABASE_URL format: mysql://user:password@host:port/database");
                            System.out.println("DatabaseConfig: 2. The extracted password might be incorrect");
                            System.out.println("DatabaseConfig:    - Current extracted password length: "
                                    + (password != null ? password.length() : 0));
                            System.out.println("DatabaseConfig:    - Password first char code: "
                                    + (password != null && password.length() > 0 ? (int) password.charAt(0) : "N/A"));
                            System.out.println("DatabaseConfig: 3. Verify database user permissions");
                            System.out.println("DatabaseConfig:    - Check if user '" + username + "' exists in MySQL");
                            System.out.println(
                                    "DatabaseConfig:    - Check if user has permission to connect from the application IP");
                            System.out.println("DatabaseConfig: 4. Try resetting the database password in Railway");
                            System.out.println(
                                    "DatabaseConfig:    - Go to Railway dashboard > Your MySQL service > Settings");
                            System.out
                                    .println("DatabaseConfig:    - Reset password and update DATABASE_URL accordingly");

                            // 認証情報が間違っている可能性が高いため、そのまま例外をスロー
                            throw new RuntimeException(
                                    "Database authentication failed. Please check your credentials. See logs above for troubleshooting steps.",
                                    e);
                        }

                        // リトライ不可能なエラー、または最大リトライ回数に達した場合
                        if (attempt == maxRetries) {
                            if (isTimeoutError) {
                                System.err.println("DatabaseConfig: 時間切れ - すべての接続試行がタイムアウトしました");
                                System.err.println("DatabaseConfig: Timeout - All connection attempts timed out after "
                                        + maxRetries + " retries");
                                System.err.println("DatabaseConfig: Last error type: " + exceptionType);
                                System.err.println("DatabaseConfig: Last error message: "
                                        + (errorMessage != null ? errorMessage : "N/A"));
                                System.err.println("DatabaseConfig: Connection timeout setting: "
                                        + config.getConnectionTimeout() + "ms");
                                System.err.println("DatabaseConfig: Initialization fail timeout: "
                                        + config.getInitializationFailTimeout() + "ms");
                                System.err.println("DatabaseConfig: JDBC URL: " + jdbcUrl);
                                System.err.println("DatabaseConfig: TROUBLESHOOTING:");
                                System.err.println("DatabaseConfig: 1. 接続タイムアウト時間を増やすことを検討してください");
                                System.err.println("DatabaseConfig: 2. MySQLサービスが起動しているか確認してください");
                                System.err.println("DatabaseConfig: 3. ネットワーク接続を確認してください");
                                System.err.println("DatabaseConfig: 4. RailwayのMySQLサービスのログを確認してください");
                                System.err.println("DatabaseConfig: フォールバック - H2データベース（mockデータ）を使用して処理を継続します");
                                System.err.println(
                                        "DatabaseConfig: FALLBACK - Using H2 database (mock data) to continue processing");

                                // タイムアウトが発生した場合、H2データベースを使用して処理を継続
                                return createH2DataSource();
                            } else {
                                System.out.println("DatabaseConfig: ERROR - All connection attempts failed after "
                                        + maxRetries + " retries");
                                System.out.println("DatabaseConfig: Last error type: " + exceptionType);
                                System.out.println("DatabaseConfig: Last error message: "
                                        + (errorMessage != null ? errorMessage : "N/A"));
                                System.out.println("DatabaseConfig: JDBC URL: " + jdbcUrl);
                                System.out.println("DatabaseConfig: TROUBLESHOOTING:");
                                System.out.println("DatabaseConfig: 1. Check if MySQL service is running in Railway");
                                System.out.println("DatabaseConfig: 2. Verify network connectivity to " + jdbcUrl);
                                System.out.println("DatabaseConfig: 3. Check Railway service logs for MySQL service");
                                System.out.println(
                                        "DatabaseConfig: 4. Ensure MySQL service is accessible from your application service");

                                throw new RuntimeException(
                                        "Failed to initialize database connection after " + maxRetries + " attempts",
                                        e);
                            }
                        }
                    }
                }

                // ここに到達することはないはずだが、念のため
                if (lastException != null) {
                    throw new RuntimeException("Failed to initialize database connection", lastException);
                }
            }

            return new HikariDataSource(config);
        }

        // JDBC URLが設定されていない場合は、デフォルトのDataSourcePropertiesを使用
        // これは通常、ローカル開発環境の場合
        System.out.println("DatabaseConfig: Using default DataSourceProperties");
        return properties.initializeDataSourceBuilder().build();
    }

    /**
     * H2データベースを使用するDataSourceを作成（タイムアウト時のフォールバック用）
     * 
     * @return H2データベースを使用するDataSource
     */
    private HikariDataSource createH2DataSource() {
        System.out.println("DatabaseConfig: Creating H2 in-memory database for fallback (mock data)");

        HikariConfig h2Config = new HikariConfig();
        // H2インメモリデータベースのURL
        // MODE=MySQL: MySQL互換モードを使用
        // INIT=CREATE SCHEMA IF NOT EXISTS: スキーマが存在しない場合は作成
        h2Config.setJdbcUrl(
                "jdbc:h2:mem:videostep_fallback;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS videostep");
        h2Config.setDriverClassName("org.h2.Driver");
        h2Config.setUsername("sa");
        h2Config.setPassword("");

        // 接続プールの設定
        h2Config.setMaximumPoolSize(5);
        h2Config.setMinimumIdle(1);
        h2Config.setConnectionTimeout(5000);
        h2Config.setIdleTimeout(300000);
        h2Config.setMaxLifetime(600000);
        h2Config.setInitializationFailTimeout(10000);

        // 接続検証のためのクエリ
        h2Config.setConnectionTestQuery("SELECT 1");

        HikariDataSource h2DataSource = new HikariDataSource(h2Config);

        // サンプルデータを投入（基本的なテーブル構造のみ）
        // 実際のテーブル構造に応じて調整が必要
        try (Connection conn = h2DataSource.getConnection()) {
            System.out.println("DatabaseConfig: H2 database connection established successfully");
            System.out.println("DatabaseConfig: Note: This is a fallback database with mock data");
            System.out.println("DatabaseConfig: Actual MySQL connection will be retried on next application restart");

            // ここでサンプルデータを投入する場合は、SQLスクリプトを実行
            // 例: INSERT INTO ... などのSQLを実行
            // ただし、実際のテーブル構造が不明なため、ここでは基本的な接続のみ確立

        } catch (Exception e) {
            System.err.println("DatabaseConfig: ERROR - Failed to initialize H2 database: " + e.getMessage());
            e.printStackTrace();
            // H2の初期化に失敗した場合でも、DataSourceは返す（後で接続を試みることができる）
        }

        return h2DataSource;
    }
}
