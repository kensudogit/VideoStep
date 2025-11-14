# Railway Root Directory設定ガイド

## 問題

RailwayでGitHubリポジトリからデプロイする際、以下のエラーが発生します：

```
Dockerfile `Dockerfile` does not exist
```

## 原因

RailwayはデフォルトでリポジトリのルートディレクトリでDockerfileを探しますが、VideoStepプロジェクトでは各サービスのDockerfileが `services/` ディレクトリ配下にあります。

## 解決方法

各サービスをデプロイする際に、**Root Directory**を正しく設定する必要があります。

## 手順

### 重要: Root Directoryの形式

**Root Directoryは相対パスで指定し、先頭の `/` は不要です。**

❌ **間違い**: `/services/service-registry`  
✅ **正しい**: `services/service-registry`

### 1. Service Registryのデプロイ

1. Railwayダッシュボードでプロジェクトを開く
2. "New Service" → "GitHub Repo" を選択
3. VideoStepリポジトリを選択
4. **"Settings" タブを開く**
5. **"Root Directory" フィールドに以下を入力**（先頭の `/` は付けない）:
   ```
   services/service-registry
   ```
6. "Deploy" をクリック

**注意**: もし既に `/services/service-registry` と設定している場合は、先頭の `/` を削除して `services/service-registry` に変更してください。

### 2. Auth Serviceのデプロイ

1. "New Service" → "GitHub Repo" を選択
2. VideoStepリポジトリを選択
3. **"Settings" タブ → "Root Directory" に以下を入力**:
   ```
   services/auth-service
   ```
4. "Variables" タブで環境変数を設定
5. "Deploy" をクリック

### 3. Video Serviceのデプロイ

1. "New Service" → "GitHub Repo" を選択
2. VideoStepリポジトリを選択
3. **"Settings" タブ → "Root Directory" に以下を入力**:
   ```
   services/video-service
   ```
4. "Variables" タブで環境変数を設定
5. "Deploy" をクリック

### 4. API Gatewayのデプロイ

1. "New Service" → "GitHub Repo" を選択
2. VideoStepリポジトリを選択
3. **"Settings" タブ → "Root Directory" に以下を入力**:
   ```
   services/api-gateway
   ```
4. "Variables" タブで環境変数を設定
5. "Deploy" をクリック

### 5. その他のサービス

同様に、以下のRoot Directoryを設定：

- **Translation Service**: `services/translation-service`
- **Editing Service**: `services/editing-service`
- **User Service**: `services/user-service`

## Root Directoryの確認方法

Root Directoryを正しく設定すると、ビルドログに以下のようなメッセージが表示されます：

```
Building Dockerfile from services/service-registry/Dockerfile
```

または

```
[build] Building Dockerfile from services/service-registry/Dockerfile
```

## 注意事項

1. **Root Directoryは相対パスで指定**
   - リポジトリのルートから見た相対パスを指定します
   - 例: `services/service-registry`（先頭の `/` は不要）
   - **重要**: 先頭に `/` を付けると「Could not find root directory」エラーが発生します

2. **エラーが発生した場合の確認**
   - Railwayダッシュボードで Settings → Source → Root Directory を確認
   - 先頭の `/` が付いていないことを確認
   - 値が `services/service-registry` の形式であることを確認

2. **各サービスは個別にデプロイ**
   - 1つのリポジトリから複数のサービスをデプロイする場合、各サービスごとにRoot Directoryを設定する必要があります

3. **既存サービスの修正**
   - 既にデプロイ済みのサービスでエラーが発生している場合：
     1. サービスの "Settings" タブを開く
     2. "Root Directory" を正しく設定
     3. "Save" をクリック
     4. 再デプロイを実行

## スクリーンショットの参考

RailwayダッシュボードでRoot Directoryを設定する場所：

```
Settings タブ
  └─ Source セクション
      └─ Root Directory: [ここに入力]
```

## 関連ドキュメント

詳細なデプロイ手順は `RAILWAY_DEPLOY_COMPLETE.md` を参照してください。

