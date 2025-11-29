# Service Registry設定修正 - Railwayデプロイ対応

## 修正内容

Service Registryの`application.yml`をRailwayでデプロイできるように修正しました。

### 変更点

#### 修正前
```yaml
eureka:
  instance:
    hostname: localhost
```

#### 修正後
```yaml
eureka:
  instance:
    # Railwayでは環境変数から取得、なければ自動検出
    hostname: ${EUREKA_INSTANCE_HOSTNAME:}
    prefer-ip-address: false
```

## 修正理由

### 問題点

1. **`hostname: localhost`が固定**
   - Railwayでは、パブリックURLが自動的に生成されます
   - `localhost`では、他のサービスからアクセスできません

2. **Railwayでの動作**
   - Railwayは各サービスにパブリックURLを割り当てます
   - Service RegistryのパブリックURLは、他のサービスが接続するために必要です

### 解決方法

1. **環境変数から取得**
   - `hostname: ${EUREKA_INSTANCE_HOSTNAME:}`
   - 環境変数が設定されていない場合は空文字列（自動検出）

2. **`prefer-ip-address: false`を追加**
   - ホスト名を使用するように設定
   - RailwayのパブリックURLと互換性があります

## Railwayでのデプロイ

### ステップ1: コードをプッシュ

修正したコードをGitHubにプッシュ：

```bash
git add services/service-registry/src/main/resources/application.yml
git commit -m "Fix Service Registry configuration for Railway deployment"
git push origin main
```

### ステップ2: Railwayでデプロイ

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「VideoStep」プロジェクトを開く
3. Service Registryサービスを開く
4. 自動的に再デプロイが開始されます（GitHub連携の場合）
5. または、「Settings」→「Deploy」→「Redeploy」をクリック

### ステップ3: パブリックURLを生成

1. 「Settings」タブを開く
2. 「Networking」セクションを開く
3. 「Generate Domain」をクリック
4. パブリックURLを確認
5. **このURLをメモしてください**（他のサービスの環境変数で使用）

### ステップ4: 動作確認

ブラウザで以下のURLにアクセス：

```
https://service-registry-production-xxxx.up.railway.app/
```

または

```
https://service-registry-production-xxxx.up.railway.app/eureka/
```

Eurekaダッシュボードが表示されることを確認。

## 環境変数の設定（オプション）

必要に応じて、Service Registryサービスで環境変数を設定できます：

```
EUREKA_INSTANCE_HOSTNAME=service-registry-production-xxxx.up.railway.app
```

ただし、通常は設定不要です。Eurekaが自動的に検出します。

## 確認チェックリスト

- [ ] コードをGitHubにプッシュ済み
- [ ] RailwayでService Registryが再デプロイ済み
- [ ] デプロイが「Active」になっている
- [ ] ログに`Started EurekaServerApplication`が表示されている
- [ ] パブリックURLを生成済み
- [ ] Service RegistryのEurekaダッシュボードにアクセスできる
- [ ] ヘルスチェックエンドポイントが応答している

## 次のステップ

Service Registryが正常にデプロイされたら：

1. Service RegistryのパブリックURLを確認
2. 他のサービス（API Gateway、Video Serviceなど）の環境変数`EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`を設定
3. すべてのサービスを再デプロイ
4. Service RegistryのEurekaダッシュボードで、すべてのサービスが登録されていることを確認

