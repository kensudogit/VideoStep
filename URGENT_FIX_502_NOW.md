# 🔴 緊急: 502 Bad Gatewayエラー修正手順

## 現在のエラー

- `GET https://videostep-production.up.railway.app/ 502 (Bad Gateway)`
- `GET https://videostep-production.up.railway.app/favicon.ico 502 (Bad Gateway)`
- `content.js`エラー（ブラウザ拡張機能によるエラー、無視して問題ありません）

## 根本原因

ターミナルログから、Video ServiceがService Registryに接続しようとして502 Bad Gatewayエラーが発生しています：

```
502 Bad Gateway: "{"status":"error","code":502,"message":"Application failed to respond"}"
Cannot execute request on any known server
```

**Service Registryが正常に起動していない**ことが原因です。

## 🔴 最優先: Service Registryの環境変数を修正

### ステップ1: Service Registryを開く

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. **service-registry**サービスをクリック

### ステップ2: 不要な環境変数を削除

1. 「Variables」タブを開く
2. 以下の環境変数を**1つずつ削除**してください（各環境変数の右側の「...」メニューから「Delete」を選択）：

   **削除する環境変数:**
   - ❌ `EUREKA_CLIENT_ENABLED`
   - ❌ `EUREKA_CLIENT_REGISTER_WITH_EUREKA`
   - ❌ `EUREKA_CLIENT_FETCH_REGISTRY`
   - ❌ `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`
   - ❌ `DATABASE_URL`
   - ❌ `MYSQL_DATABASE`
   - ❌ `MYSQL_PUBLIC_URL`
   - ❌ `MYSQL_URL`
   - ❌ `MYSQLDATABASE`
   - ❌ `MYSQLHOST`

   **重要**: Service Registryは**Eureka Server**であり、クライアント設定やデータベース設定は不要です。

### ステップ3: Service Registryを再デプロイ

1. 「Deployments」タブを開く
2. 最新のデプロイメントの「...」メニューをクリック
3. 「Redeploy」を選択
4. 再デプロイが完了するまで待つ（通常1-2分）

### ステップ4: Service Registryのヘルスチェック

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

- ✅ **正常な場合**: `{"status":"UP"}`が返される
- ❌ **エラーの場合**: 502 Bad Gatewayが返される

**重要**: Service Registryが正常に起動するまで、次のステップに進まないでください。

---

## 🔴 ステップ2: Video ServiceのEureka環境変数を確認

### ステップ1: Video Serviceを開く

1. Railwayダッシュボードで**VideoStep**サービス（Video Service）を開く
2. 「Variables」タブを開く

### ステップ2: Eureka環境変数を確認

以下の環境変数が設定されているか確認：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

### ステップ3: 環境変数が設定されていない場合

1. 「+ New Variable」をクリック
2. 各環境変数を1つずつ追加：
   - `EUREKA_CLIENT_ENABLED` = `true`
   - `EUREKA_CLIENT_REGISTER_WITH_EUREKA` = `true`
   - `EUREKA_CLIENT_FETCH_REGISTRY` = `true`
   - `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` = `https://service-registry-production-6ee0.up.railway.app/eureka/`

### ステップ4: Video Serviceを再デプロイ

1. 「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック

---

## 🔴 ステップ3: API GatewayのEureka環境変数を確認

### ステップ1: API Gatewayを開く

1. Railwayダッシュボードで**api-gateway**サービスを開く
2. 「Variables」タブを開く

### ステップ2: Eureka環境変数を確認

以下の環境変数が設定されているか確認：

```
EUREKA_CLIENT_ENABLED=true
EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
EUREKA_CLIENT_FETCH_REGISTRY=true
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=https://service-registry-production-6ee0.up.railway.app/eureka/
```

### ステップ3: 環境変数が設定されていない場合

1. 「+ New Variable」をクリック
2. 各環境変数を1つずつ追加（Video Serviceと同じ値）

### ステップ4: API Gatewayを再デプロイ

1. 「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック

---

## ✅ 動作確認

### 1. Service RegistryのEurekaダッシュボードを確認

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app
```

- ✅ **正常な場合**: Eurekaダッシュボードが表示される
- ✅ **VIDEO-SERVICEが登録されているか確認**: 「Instances currently registered with Eureka」セクションで、**VIDEO-SERVICE**が表示されていることを確認

### 2. フロントエンドにアクセス

ブラウザで以下にアクセス：

```
https://videostep-production.up.railway.app
```

- ✅ **正常な場合**: アプリケーションが表示される
- ❌ **エラーの場合**: 502 Bad Gatewayが返される

### 3. Faviconエラーの確認

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

- [ ] **ステップ1**: Service Registryの環境変数を修正（不要なEurekaクライアント設定とデータベース設定を削除）
- [ ] Service Registryを再デプロイ
- [ ] Service Registryのヘルスチェックが`{"status":"UP"}`を返すことを確認
- [ ] **ステップ2**: Video ServiceのEureka環境変数を確認
- [ ] Video Serviceを再デプロイ
- [ ] **ステップ3**: API GatewayのEureka環境変数を確認
- [ ] API Gatewayを再デプロイ
- [ ] **動作確認**: Service RegistryのEurekaダッシュボードでVIDEO-SERVICEが登録されていることを確認
- [ ] フロントエンドが正常に表示されることを確認
- [ ] Faviconエラーが解消されることを確認

---

## 重要事項

1. **必ず順序通りに実行してください**: Service Registryが正常に起動しない限り、Video ServiceやAPI Gatewayは正常に動作しません。

2. **各ステップの完了を確認**: 各ステップが完了したことを確認してから、次のステップに進んでください。

3. **ログを確認**: 各サービスのログを確認して、エラーメッセージがないか確認してください。

4. **`content.js`エラーは無視**: これはブラウザ拡張機能によるエラーで、アプリケーションの問題ではありません。

---

## トラブルシューティング

### Service Registryがまだ502を返す場合

1. Service Registryのログを詳細に確認
2. 環境変数が正しく削除されているか確認
3. Service Registryを完全に再デプロイ

### Video ServiceがEurekaに登録されない場合

1. Service Registryが正常に起動しているか確認
2. Video ServiceのEureka環境変数が正しく設定されているか確認
3. Video ServiceのログでEureka接続エラーがないか確認

### API Gatewayが502を返す場合

1. Service Registryが正常に起動しているか確認
2. Video ServiceがEurekaに登録されているか確認
3. API GatewayのEureka環境変数が正しく設定されているか確認

