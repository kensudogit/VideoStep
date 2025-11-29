# 🚨 Eureka接続エラー修正 - 今すぐ実行

## 現在の状況

- ✅ Service RegistryのパブリックURL確認済み: `https://service-registry-production-6ee0.up.railway.app`
- ❌ video-serviceがまだ`http://service-registry:8761`に接続しようとしている
- ❌ 環境変数が設定されていない、または再デプロイされていない

## 📋 実行手順

### ステップ1: Railwayダッシュボードを開く

ブラウザで以下を開く：
```
https://railway.app/dashboard
```

### ステップ2: VideoStepプロジェクトを選択

1. プロジェクト一覧から「VideoStep」を選択
2. プロジェクト内のサービス一覧を確認

### ステップ3: video-serviceを探す

video-serviceが表示されていない場合：
- サービス名が異なる可能性があります（例: `video`, `video-service-production`など）
- ログが出力されているサービスを探してください

### ステップ4: video-serviceの環境変数を設定

1. **video-service**（または該当するサービス名）をクリック
2. 「**Variables**」タブを開く
3. 以下の4つの環境変数を**追加または更新**：

| 環境変数名 | 値 |
|-----------|-----|
| `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` | `https://service-registry-production-6ee0.up.railway.app/eureka/` |
| `EUREKA_CLIENT_ENABLED` | `true` |
| `EUREKA_CLIENT_REGISTER_WITH_EUREKA` | `true` |
| `EUREKA_CLIENT_FETCH_REGISTRY` | `true` |

**重要**: 
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`の値は**必ず**`https://service-registry-production-6ee0.up.railway.app/eureka/`に設定
- `http://service-registry:8761/eureka/`は**絶対に使わない**

### ステップ5: video-serviceを再デプロイ

1. 「**Deployments**」タブを開く
2. 最新のデプロイメントの「**Redeploy**」ボタンをクリック
3. または、GitHubにプッシュして自動デプロイをトリガー

### ステップ6: 接続確認

1. 再デプロイ後、2-3分待つ
2. video-serviceの「**Logs**」タブでエラーが解消されているか確認
3. Service Registryダッシュボードにアクセス：
   ```
   https://service-registry-production-6ee0.up.railway.app
   ```
4. video-serviceが登録されていることを確認

## ✅ 確認チェックリスト

- [ ] RailwayダッシュボードでVideoStepプロジェクトを開いた
- [ ] video-service（または該当するサービス）を見つけた
- [ ] `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`を`https://service-registry-production-6ee0.up.railway.app/eureka/`に設定した
- [ ] `EUREKA_CLIENT_ENABLED=true`を設定した
- [ ] `EUREKA_CLIENT_REGISTER_WITH_EUREKA=true`を設定した
- [ ] `EUREKA_CLIENT_FETCH_REGISTRY=true`を設定した
- [ ] video-serviceを再デプロイした
- [ ] ログでエラーが解消されているか確認した
- [ ] Service Registryダッシュボードでvideo-serviceが登録されているか確認した

## 🔍 トラブルシューティング

### video-serviceが見つからない場合

1. Railwayダッシュボードでプロジェクト内のすべてのサービスを確認
2. サービス名が異なる可能性がある（例: `video`, `video-service-production`）
3. ログが出力されているサービスを探す

### 環境変数を設定したがエラーが続く場合

1. 環境変数の値が正しいか再確認（特に`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`）
2. サービスが再デプロイされているか確認
3. 再デプロイ後、数分待ってからログを確認
4. Service Registryが正常に起動しているか確認

### Service Registryにアクセスできない場合

1. Service RegistryのパブリックURLが正しいか確認
2. Service Registryが正常に起動しているか確認
3. RailwayダッシュボードでService Registryのログを確認

