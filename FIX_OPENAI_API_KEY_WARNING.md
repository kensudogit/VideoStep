# OPENAI_API_KEY 警告の解消方法

## 問題

`docker-compose`コマンド実行時に以下の警告が表示されます：

```
level=warning msg="The \"OPENAI_API_KEY\" variable is not set. Defaulting to a blank string."
```

## 原因

`docker-compose.yml`で`OPENAI_API_KEY=${OPENAI_API_KEY}`という形式で環境変数を参照していますが、ローカル環境に`.env`ファイルが存在しないため、環境変数が読み込まれていません。

**注意**: Railwayサーバでは環境変数として設定されているため、本番環境では問題ありません。これはローカル開発環境での警告です。

## 解決方法

### 方法1: .envファイルを作成（推奨）

プロジェクトルート（`C:\devlop\VideoStep`）に`.env`ファイルを作成します：

1. プロジェクトルートに`.env`ファイルを作成
2. 以下の内容を追加：

```env
OPENAI_API_KEY=your-openai-api-key-here
```

**注意**: 
- `.env`ファイルは`.gitignore`に含まれているため、Gitにはコミットされません
- 実際のAPIキーを設定してください（Railwayで使用しているものと同じでOK）

### 方法2: システム環境変数を設定

Windowsの場合：

**PowerShell**:
```powershell
$env:OPENAI_API_KEY="your-openai-api-key-here"
```

**CMD**:
```cmd
set OPENAI_API_KEY=your-openai-api-key-here
```

**永続的に設定する場合**:
1. 「システムのプロパティ」→「環境変数」を開く
2. 「ユーザー環境変数」または「システム環境変数」に追加
   - 変数名: `OPENAI_API_KEY`
   - 変数値: 実際のAPIキー

### 方法3: docker-compose.ymlでデフォルト値を設定

`docker-compose.yml`の各サービスで、デフォルト値を設定：

```yaml
environment:
  - OPENAI_API_KEY=${OPENAI_API_KEY:-}
```

これにより、環境変数が設定されていない場合でも警告が表示されなくなります（ただし、空文字列が設定されます）。

## 推奨される方法

**ローカル開発環境**では、方法1（`.env`ファイルの作成）を推奨します：

1. プロジェクトルートに`.env`ファイルを作成
2. Railwayで使用している`OPENAI_API_KEY`の値を設定
3. `docker-compose`コマンドを実行

これにより、警告が解消され、ローカル環境でもOpenAI APIを使用できます。

## 確認方法

`.env`ファイルを作成後、以下のコマンドで確認：

```bash
docker-compose config | findstr OPENAI_API_KEY
```

環境変数が正しく読み込まれている場合、警告は表示されません。

## まとめ

- **Railwayサーバ**: 環境変数として設定済み ✅
- **ローカル環境**: `.env`ファイルを作成して設定する必要があります

警告を解消するには、プロジェクトルートに`.env`ファイルを作成し、`OPENAI_API_KEY`を設定してください。

