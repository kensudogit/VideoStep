# 502エラーとFaviconエラーの修正手順

## 現在のエラー

1. **`content.js`エラー**: ブラウザ拡張機能によるエラー（アプリケーションの問題ではありません）
2. **`/favicon.ico 502 Bad Gateway`**: Service Registryが正常に起動していないため、API Gatewayが502エラーを返している

## 根本原因

ターミナルログから、Video ServiceがService Registryに接続しようとして502 Bad Gatewayエラーが発生しています：

```
502 Bad Gateway: "{"status":"error","code":502,"message":"Application failed to respond","request_id":"..."}"
Cannot execute request on any known server
```

これは、**Service Registryが正常に起動していない**ことを示しています。

## 修正手順

### 🔴 ステップ1: Service Registryの環境変数を修正（最優先）

#### 1-1. Service Registryを開く

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **service-registry**サービスをクリック

#### 1-2. 不要な環境変数を削除

1. 「Variables」タブを開く
2. 以下の環境変数を**1つずつ削除**してください：

   **削除する環境変数リスト:**
   - `EUREKA_CLIENT_ENABLED` → 「...」メニュー → 「Delete」
   - `EUREKA_CLIENT_REGISTER_WITH_EUREKA` → 「...」メニュー → 「Delete」
   - `EUREKA_CLIENT_FETCH_REGISTRY` → 「...」メニュー → 「Delete」
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` → 「...」メニュー → 「Delete」
   - `DATABASE_URL` → 「...」メニュー → 「Delete」
   - `MYSQL_DATABASE` → 「...」メニュー → 「Delete」
   - `MYSQL_PUBLIC_URL` → 「...」メニュー → 「Delete」
   - `MYSQL_URL` → 「...」メニュー → 「Delete」
   - `MYSQLDATABASE` → 「...」メニュー → 「Delete」
   - `MYSQLHOST` → 「...」メニュー → 「Delete」

   **重要**: Service Registryは**Eureka Server**であり、クライアント設定やデータベース設定は不要です。

#### 1-3. Service Registryを再デプロイ

1. 「Deployments」タブを開く
2. 最新のデプロイメントの「...」メニューをクリック
3. 「Redeploy」を選択
4. 再デプロイが完了するまで待つ（通常1-2分）

#### 1-4. Service Registryのログを確認

1. 「Logs」タブを開く
2. 以下のメッセージを探してください：

   **✅ 正常な起動:**
   ```
   Started ServiceRegistryApplication
   Tomcat started on port(s): 8761 (http)
   ```

   **❌ エラー（起動失敗）:**
   ```
   ERROR
   Exception
   Failed to start
   ```

#### 1-5. Service Registryのヘルスチェック

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

- ✅ **正常な場合**: `{"status":"UP"}`が返される
- ❌ **エラーの場合**: 502 Bad Gatewayが返される

**重要**: Service Registryが正常に起動するまで、次のステップに進まないでください。

---

### 🔴 ステップ2: Video ServiceのEureka環境変数を確認

#### 2-1. Video Serviceを開く

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く

#### 2-2. Eureka環境変数を確認

以下の環境変数が設定されているか確認：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

#### 2-3. 環境変数が設定されていない場合

1. 「+ New Variable」をクリック
2. 各環境変数を1つずつ追加：
   - `EUREKA_CLIENT_ENABLED` = `true`
   - `EUREKA_CLIENT_REGISTER_WITH_EUREKA` = `true`
   - `EUREKA_CLIENT_FETCH_REGISTRY` = `true`
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` = `https://service-registry-production-6ee0.up.railway.app/eureka/`

#### 2-4. Video Serviceを再デプロイ

1. 「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック

---

### 🔴 ステップ3: API GatewayのEureka環境変数を確認

#### 3-1. API Gatewayを開く

1. Railwayダッシュボードで**api-gateway**サービスを開く
2. 「Variables」タブを開く

#### 3-2. Eureka環境変数を確認

以下の環境変数が設定されているか確認：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

#### 3-3. 環境変数が設定されていない場合

1. 「+ New Variable」をクリック
2. 各環境変数を1つずつ追加（Video Serviceと同じ値）

#### 3-4. API Gatewayを再デプロイ

1. 「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック

---

### 🔴 ステップ4: 動作確認

#### 4-1. Service RegistryのEurekaダッシュボードを確認

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app
```

- ✅ **正常な場合**: Eurekaダッシュボードが表示される
- ✅ **VIDEO-SERVICEが登録されているか確認**: 「Instances currently registered with Eureka」セクションで、**VIDEO-SERVICE**が表示されていることを確認

#### 4-2. フロントエンドにアクセス

ブラウザで以下にアクセス：

```
https://videostep-production.up.railway.app
```

- ✅ **正常な場合**: アプリケーションが表示される
- ❌ **エラーの場合**: 502 Bad Gatewayが返される

#### 4-3. Faviconエラーの確認

ブラウザの開発者ツール（F12）で「Network」タブを開き、`/favicon.ico`のリクエストを確認：

- ✅ **正常な場合**: 200 OKが返される
- ❌ **エラーの場合**: 502 Bad Gatewayが返される（Service Registryが正常に起動していない場合）

---

## エラーの説明

### `content.js`エラー

```
Uncaught (in promise) The message port closed before a response was received.
```

**原因**: ブラウザ拡張機能（例: 広告ブロッカー、パスワードマネージャーなど）によるエラー

**対応**: アプリケーションの問題ではありません。無視して構いません。

### `/favicon.ico 502 Bad Gateway`エラー

```
Failed to load resource: the server responded with a status of 502 ()
```

**原因**: 
1. Service Registryが正常に起動していない
2. API GatewayがService Registryに接続できない
3. Video ServiceがService Registryに登録されていない

**対応**: 上記の修正手順を実行してください。

---

## 実行チェックリスト

- [ ] ステップ1: Service Registryの環境変数を修正（不要なEurekaクライアント設定とデータベース設定を削除）
- [ ] Service Registryを再デプロイ
- [ ] Service Registryのヘルスチェックが`{"status":"UP"}`を返すことを確認
- [ ] ステップ2: Video ServiceのEureka環境変数を確認
- [ ] Video Serviceを再デプロイ
- [ ] ステップ3: API GatewayのEureka環境変数を確認
- [ ] API Gatewayを再デプロイ
- [ ] ステップ4: Service RegistryのEurekaダッシュボードでVIDEO-SERVICEが登録されていることを確認
- [ ] フロントエンドが正常に表示されることを確認
- [ ] Faviconエラーが解消されることを確認

---

## 重要事項

1. **必ず順序通りに実行してください**: Service Registryが正常に起動しない限り、Video ServiceやAPI Gatewayは正常に動作しません。

2. **各ステップの完了を確認**: 各ステップが完了したことを確認してから、次のステップに進んでください。

3. **ログを確認**: 各サービスのログを確認して、エラーメッセージがないか確認してください。

4. **`content.js`エラーは無視**: これはブラウザ拡張機能によるエラーで、アプリケーションの問題ではありません。

