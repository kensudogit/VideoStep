# Railway Root Directory エラー修正（即座に対応）

## エラーメッセージ

```
Could not find root directory: /services/service-registry
```

## 原因

RailwayのRoot Directory設定で先頭の `/` が付いているため、絶対パスとして解釈され、ディレクトリが見つかりません。

## 即座の修正方法

### 方法1: Railwayダッシュボードで修正（推奨）

1. Railwayダッシュボード（https://railway.app）にアクセス
2. プロジェクトを開く
3. **Service Registryサービスを選択**
4. **"Settings" タブを開く**
5. **"Source" セクションの "Root Directory" フィールドを確認**
6. **現在の値**: `/services/service-registry`
7. **修正後の値**: `services/service-registry`（先頭の `/` を削除）
8. **"Save" ボタンをクリック**
9. **再デプロイを実行**

### 方法2: Railway CLIで修正

```bash
cd C:\devlop\VideoStep\services\service-registry

# サービスにリンク
railway link

# Root Directoryを設定（先頭の / は付けない）
railway variables set RAILWAY_ROOT_DIRECTORY=services/service-registry

# または、Railwayダッシュボードで直接修正する方が確実
```

## 重要なポイント

### ❌ 間違い
```
/services/service-registry
```

### ✅ 正しい
```
services/service-registry
```

## 確認方法

Root Directoryを正しく設定すると：

1. **Settings画面で確認**
   - Root Directoryフィールドに `services/service-registry` と表示される（先頭の `/` がない）

2. **ビルドログで確認**
   - エラーメッセージ「Could not find root directory」が消える
   - ビルドが正常に開始される

## 他のサービスも同様に修正

以下のサービスも同じようにRoot Directoryを設定してください（先頭の `/` は付けない）：

- **Auth Service**: `services/auth-service`
- **Video Service**: `services/video-service`
- **API Gateway**: `services/api-gateway`
- **Translation Service**: `services/translation-service`
- **Editing Service**: `services/editing-service`
- **User Service**: `services/user-service`

## トラブルシューティング

### まだエラーが発生する場合

1. **ブラウザのキャッシュをクリア**
   - Railwayダッシュボードをリロード（Ctrl+F5）

2. **設定を再確認**
   - Settings → Source → Root Directory
   - 値が `services/service-registry` であることを確認（先頭の `/` がない）

3. **サービスを削除して再作成**
   - 既存のサービスを削除
   - 新しいサービスを作成
   - Root Directoryを `services/service-registry` に設定（先頭の `/` は付けない）

## 次のステップ

Root Directoryを修正した後：

1. **再デプロイを実行**
2. **ビルドログを確認**
3. **エラーが解消されたことを確認**

