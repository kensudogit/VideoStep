# .envファイルの作成手順

## 概要

ローカル開発環境で`OPENAI_API_KEY`の警告を解消するために、`.env`ファイルを作成します。

## 手順

### 1. プロジェクトルートに移動

```bash
cd C:\devlop\VideoStep
```

### 2. .envファイルを作成

プロジェクトルート（`C:\devlop\VideoStep`）に`.env`ファイルを作成します。

**PowerShell**:
```powershell
New-Item -Path .env -ItemType File
```

**CMD**:
```cmd
type nul > .env
```

または、エディタで直接`.env`ファイルを作成してください。

### 3. .envファイルに内容を追加

`.env`ファイルを開き、以下の内容を追加します：

```env
OPENAI_API_KEY=sk-proj-Z-OGU14e0AROH01BSG-p67k1-drcHQPKZ93VYIKSQV11AnK69V656MegC8YMpWds060@JoFFbgT3B1bkFJBNqP1Yc8Ww1dit8szG9X4ZDsU4Qvw30ped4M4G8HxyN_DVXG49aSGpQIcGjvh5P0mVwotjtHUA
```

**重要**: 上記のAPIキーは例です。Railwayサーバで設定している実際の`OPENAI_API_KEY`の値を設定してください。

### 4. 確認

`.env`ファイルを作成後、以下のコマンドで警告が解消されているか確認：

```bash
docker-compose ps
```

警告が表示されなくなっていることを確認してください。

## 注意事項

- `.env`ファイルは`.gitignore`に含まれているため、Gitにはコミットされません
- 実際のAPIキーを設定してください（Railwayで使用しているものと同じでOK）
- `.env`ファイルは機密情報を含むため、共有しないでください

## まとめ

`.env`ファイルを作成することで、ローカル開発環境での`OPENAI_API_KEY`警告を解消できます。

**Railwayサーバ**: 環境変数として設定済み ✅  
**ローカル環境**: `.env`ファイルを作成して設定 ✅

