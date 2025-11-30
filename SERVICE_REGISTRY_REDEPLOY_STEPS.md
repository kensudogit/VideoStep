# Service Registry再デプロイ手順

## ステップ1: Service Registryを開く

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. ログイン（必要に応じて）
3. 「VideoStep」プロジェクトを開く
   - プロジェクト一覧から「VideoStep」をクリック
4. **service-registry**サービスをクリック
   - サービス一覧から「service-registry」を探してクリック

## ステップ2: 不要な環境変数を削除（重要）

### 2-1. Variablesタブを開く

1. Service Registryのページで、上部のタブから「**Variables**」をクリック

### 2-2. 不要な環境変数を削除

以下の環境変数を**1つずつ削除**してください：

**削除する環境変数リスト:**
- `EUREKA_CLIENT_ENABLED`
- `EUREKA_CLIENT_REGISTER_WITH_EUREKA`
- `EUREKA_CLIENT_FETCH_REGISTRY`
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`
- `DATABASE_URL`
- `MYSQL_DATABASE`
- `MYSQL_PUBLIC_URL`
- `MYSQL_URL`
- `MYSQLDATABASE`
- `MYSQLHOST`

**削除方法:**
1. 各環境変数の右側にある「**...**」（3つの点）メニューをクリック
2. 「**Delete**」を選択
3. 確認ダイアログが表示されたら「**Delete**」をクリック
4. 次の環境変数に進む

**重要**: Service Registryは**Eureka Server**であり、クライアント設定やデータベース設定は不要です。これらの環境変数が存在すると、Service Registryが正常に起動しない可能性があります。

## ステップ3: Service Registryを再デプロイ

### 3-1. Deploymentsタブを開く

1. Service Registryのページで、上部のタブから「**Deployments**」をクリック

### 3-2. 再デプロイを実行

**方法1: 最新のデプロイメントから再デプロイ**

1. 最新のデプロイメント（一番上に表示されているもの）の右側にある「**...**」（3つの点）メニューをクリック
2. 「**Redeploy**」を選択
3. 確認ダイアログが表示されたら「**Redeploy**」をクリック

**方法2: Redeployボタンを使用（表示されている場合）**

1. 「**Redeploy**」ボタンが表示されている場合は、それをクリック
2. 確認ダイアログが表示されたら「**Redeploy**」をクリック

### 3-3. 再デプロイの進行状況を確認

1. 「Deployments」タブで、新しいデプロイメントが作成されていることを確認
2. デプロイメントの状態が「**Building**」→「**Deploying**」→「**Active**」に変わるまで待つ
3. 通常、再デプロイには1-2分かかります

## ステップ4: Service Registryのログを確認

### 4-1. Logsタブを開く

1. Service Registryのページで、上部のタブから「**Logs**」をクリック

### 4-2. 正常な起動を確認

以下のメッセージを探してください：

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

## ステップ5: Service Registryのヘルスチェック

### 5-1. ヘルスチェックエンドポイントにアクセス

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app/actuator/health
```

**注意**: URLは実際のService RegistryのURLに置き換えてください。Railwayダッシュボードの「Settings」タブで確認できます。

### 5-2. 結果を確認

- ✅ **正常な場合**: `{"status":"UP"}`が返される
- ❌ **エラーの場合**: 502 Bad Gatewayが返される

## ステップ6: Eurekaダッシュボードを確認

### 6-1. Eurekaダッシュボードにアクセス

ブラウザで以下にアクセス：

```
https://service-registry-production-6ee0.up.railway.app
```

**注意**: URLは実際のService RegistryのURLに置き換えてください。

### 6-2. ダッシュボードの表示を確認

- ✅ **正常な場合**: Eurekaダッシュボードが表示される
- ✅ **VIDEO-SERVICEが登録されているか確認**: 「Instances currently registered with Eureka」セクションで、**VIDEO-SERVICE**が表示されていることを確認

## トラブルシューティング

### 問題1: 環境変数が削除できない

**原因**: Railwayが自動的に設定した環境変数（`> 14 variables added by Railway`と表示されているもの）は、削除しても自動的に再作成される場合があります。

**対応**: 
- これらの環境変数は無視して構いません
- 重要なのは、**手動で追加した**Eurekaクライアント設定とデータベース設定を削除することです

### 問題2: 再デプロイが失敗する

**対応**:
1. Service Registryのログを確認して、エラーメッセージを確認
2. 環境変数が正しく削除されているか確認
3. Service Registryの「Settings」タブで、設定を確認

### 問題3: Service Registryが502を返す

**対応**:
1. Service Registryのログを詳細に確認
2. 環境変数が正しく削除されているか確認
3. Service Registryを完全に再デプロイ
4. Service Registryの「Settings」タブで、公開設定（Public）が有効になっているか確認

### 問題4: VIDEO-SERVICEがEurekaに登録されない

**対応**:
1. Service Registryが正常に起動しているか確認
2. Video ServiceのEureka環境変数が正しく設定されているか確認
3. Video ServiceのログでEureka接続エラーがないか確認

## 実行チェックリスト

- [ ] Service Registryを開く
- [ ] Variablesタブを開く
- [ ] 不要な環境変数を削除（Eurekaクライアント設定とデータベース設定）
- [ ] Deploymentsタブを開く
- [ ] Service Registryを再デプロイ
- [ ] 再デプロイが完了するまで待つ（1-2分）
- [ ] Logsタブを開く
- [ ] 正常な起動メッセージを確認
- [ ] ヘルスチェックエンドポイントにアクセスして`{"status":"UP"}`を確認
- [ ] Eurekaダッシュボードにアクセスして正常に表示されることを確認

## 重要事項

1. **必ず環境変数を削除してから再デプロイ**: 環境変数が残っていると、Service Registryが正常に起動しない可能性があります。

2. **再デプロイの完了を確認**: 再デプロイが完了するまで、次のステップに進まないでください。

3. **ログを確認**: Service Registryのログを確認して、エラーメッセージがないか確認してください。

4. **ヘルスチェックを確認**: Service Registryが正常に起動していることを確認してから、次のステップに進んでください。

