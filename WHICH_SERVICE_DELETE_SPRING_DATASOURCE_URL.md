# どのサービスのSPRING_DATASOURCE_URLを削除すべきか

## 重要な区別

### ❌ 削除すべき: Service Registry

**Service Registry**は**Eureka Server**なので：
- データベースを使用しない
- `SPRING_DATASOURCE_URL`は**不要**で**削除すべき**

### ✅ 削除してはいけない: Video Service

**Video Service**は**データベースを使用する**ので：
- `SPRING_DATASOURCE_URL`または`DATABASE_URL`が**必要**
- 削除してはいけません

## 確認方法

### どのサービスの変数か確認する

1. Railwayダッシュボードで`videostep-production`プロジェクトを開く
2. 変数が表示されている画面で、**どのサービス**の変数か確認：
   - 画面の左上にサービス名が表示されている
   - 例: `>_ service-registry` または `>_ video-service`

### Service Registryの変数の場合

**削除すべき変数**:
- `SPRING_DATASOURCE_URL` ← **削除**
- `DATABASE_URL` ← **削除**
- `EUREKA_CLIENT_*` ← **削除**
- `MYSQL_*` ← **削除**

**理由**: Service Registryはデータベースを使用しないため

### Video Serviceの変数の場合

**保持すべき変数**:
- `SPRING_DATASOURCE_URL` ← **保持**（または`DATABASE_URL`）
- データベース接続に必要

**削除してはいけない理由**: Video Serviceはデータベースを使用するため

## 現在の状況

### Service Registry

- ❌ `SPRING_DATASOURCE_URL`が設定されている → **削除すべき**
- これが502エラーの原因の可能性が高い

### Video Service

- ✅ `SPRING_DATASOURCE_URL`または`DATABASE_URL`が必要
- 現在、ログで`DATABASE_URL`が設定されていないエラーが発生
- 削除するのではなく、**正しく設定する**必要がある

## 対応手順

### 1. Service Registryの変数を確認・削除

1. Railwayダッシュボードで`service-registry`サービスを選択
2. 「Variables」タブを開く
3. `SPRING_DATASOURCE_URL`が存在する場合 → **削除**
4. その他の不要な変数も削除（上記参照）

### 2. Video Serviceの変数を確認・設定

1. Railwayダッシュボードで`video-service`サービスを選択
2. 「Variables」タブを開く
3. `SPRING_DATASOURCE_URL`または`DATABASE_URL`が設定されているか確認
4. 設定されていない場合 → **設定する**（削除しない）

## まとめ

| サービス | SPRING_DATASOURCE_URL | 対応 |
|---------|----------------------|------|
| **Service Registry** | ❌ 不要 | **削除すべき** |
| **Video Service** | ✅ 必要 | **保持または設定** |

**重要**: 
- Service Registryの`SPRING_DATASOURCE_URL` → **削除**
- Video Serviceの`SPRING_DATASOURCE_URL` → **保持または設定**

## 確認方法（再確認）

変数が表示されている画面で：
1. 画面の左上のサービス名を確認
2. `service-registry`の場合 → 削除
3. `video-service`の場合 → 保持または設定

