# 環境変数URLの修正 - 緊急対応

## 問題

環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値が不完全です。

### 現在の値（間違い）
```
service-registry-production-6ee0.up.railway.app
```

### 正しい値
```
https://service-registry-production-6ee0.up.railway.app/eureka/
```

## 問題点

1. **`https://`が欠けている** - プロトコルが必要です
2. **`/eureka/`が欠けている** - Eurekaのエンドポイントパスが必要です

## 修正手順

### ステップ1: Railwayダッシュボードを開く

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. API Gatewayサービス（`videostep-production`など）を開く

### ステップ2: 環境変数を修正

1. 「Variables」タブを開く
2. `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の行を見つける
3. 値のフィールドをクリック
4. 現在の値: `service-registry-production-6ee0.up.railway.app`
5. 以下のように修正:
   ```
   https://service-registry-production-6ee0.up.railway.app/eureka/
   ```
6. 保存（Enterキーを押すか、フィールド外をクリック）

### ステップ3: 確認

修正後の環境変数の値が以下のようになっていることを確認：

```
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE = https://service-registry-production-6ee0.up.railway.app/eureka/
```

**重要**: 
- `https://`で始まっているか
- `/eureka/`で終わっているか
- 最後にスラッシュ（`/`）があるか

### ステップ4: 再デプロイ

環境変数を修正すると、Railwayが自動的に再デプロイを開始します。

1. 「Deployments」タブを開く
2. 新しいデプロイメントが開始されていることを確認
3. デプロイが完了するまで待つ（5-10分）
   - デプロイメントの状態が「Active」になるまで待ちます

**手動で再デプロイする場合**:
1. 「Settings」タブを開く
2. 「Deploy」セクションを開く
3. 「Redeploy」ボタンをクリック

### ステップ5: ログを確認

デプロイ中にログを確認して、Eureka接続が成功しているか確認：

1. 「Deployments」タブを開く
2. 最新のデプロイメントを選択
3. ログを確認
4. 以下のようなメッセージが表示されることを確認：
   - `DiscoveryClient`関連の成功メッセージ
   - Eureka接続エラーがないこと

### ステップ6: 確認

デプロイ完了後（「Deployments」タブで「Active」と表示されるまで）：

1. Service RegistryのEurekaダッシュボードにアクセス：
   ```
   https://service-registry-production-6ee0.up.railway.app/
   ```
2. API Gatewayが登録されているか確認
3. API Gatewayのヘルスチェックエンドポイントにアクセス：
   ```
   https://videostep-production.up.railway.app/actuator/health
   ```
4. 正常に応答することを確認（JSON形式のレスポンスが返ってくる）
5. メインURLにアクセス：
   ```
   https://videostep-production.up.railway.app/
   ```
6. 502エラーが解消されていることを確認

## トラブルシューティング

### まだ502エラーが発生する場合

#### 1. Service Registryが正常に起動しているか確認

1. Service Registryサービスのログを確認
2. 正常に起動しているか確認
3. パブリックURLが正しく生成されているか確認

#### 2. 環境変数のURLが正しいか再確認

1. Service Registryの実際のパブリックURLを確認
2. 環境変数のURLと一致しているか確認
3. `https://`で始まり、`/eureka/`で終わっているか確認

#### 3. デプロイが完了しているか確認

1. 「Deployments」タブでデプロイの進行状況を確認
2. デプロイが完了するまで待つ（通常5-10分）

#### 4. ログを確認

1. 「Deployments」タブで最新のデプロイメントを選択
2. ログを確認
3. Eureka接続エラーがないか確認

## 確認チェックリスト

- [ ] `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値が`https://`で始まっている
- [ ] `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値が`/eureka/`で終わっている
- [ ] 環境変数のURLがService Registryの実際のパブリックURLと一致している
- [ ] 再デプロイを実行済み
- [ ] デプロイが完了するまで待った（「Active」と表示されるまで）
- [ ] ログを確認してEureka接続エラーがないことを確認
- [ ] Service RegistryのEurekaダッシュボードでAPI Gatewayが登録されている
- [ ] API Gatewayのヘルスチェックエンドポイントが応答している
- [ ] メインURLで502エラーが解消された

## 重要な注意事項

⚠️ **URLの形式が重要です**

環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値は、以下の形式である必要があります：

```
https://[Service RegistryのURL]/eureka/
```

- `https://`で始まる
- `/eureka/`で終わる
- 最後にスラッシュ（`/`）がある

⚠️ **デプロイが完了するまで待ってください**

環境変数を修正した後、デプロイが完了するまで5-10分かかります。デプロイが完了する前にアクセスすると、まだ502エラーが発生する可能性があります。

