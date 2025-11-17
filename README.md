# VideoStep - 動画共有プラットフォーム

「動画で人々の知を未来と世界へ繋ぐ」をミッションに、熟練技術者のノウハウ継承や外国人教育を支援する動画共有プラットフォームです。

## 概要

VideoStepは、直感的なスライド型動画編集機能や24言語対応の自動翻訳機能を搭載した動画共有プラットフォームです。製造業を中心に導入が進んでおり、現在、総動画数は約7万本・月間新規投稿5,000本を超え、年2倍成長を継続中です。

## 主な機能

- **動画共有**: 動画のアップロード、管理、再生
- **スライド型動画編集**: 直感的なスライド型動画編集機能
- **24言語対応自動翻訳**: 24言語に対応した自動翻訳機能
- **ユーザー認証**: JWTベースの認証システム
- **ユーザー管理**: ユーザープロフィール管理
- **動画検索**: キーワード検索機能

## 技術スタック

### バックエンド
- **言語**: Java 21 LTS
- **フレームワーク**: Spring Boot 3.2.0
- **データベース**: PostgreSQL 15
- **ビルドツール**: Gradle
- **アーキテクチャ**: マイクロサービス型
- **サービスディスカバリ**: Netflix Eureka
- **APIゲートウェイ**: Spring Cloud Gateway

### フロントエンド
- **フレームワーク**: Next.js 14
- **言語**: TypeScript
- **UIライブラリ**: React 18
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **動画プレーヤー**: React Player

### インフラストラクチャ
- **クラウド**: AWS / GCP マルチクラウド環境
- **コンテナ**: Docker
- **オーケストレーション**: Docker Compose
- **IaC**: Terraform
- **コンテナオーケストレーション**: AWS ECS (Fargate)

## プロジェクト構造

```
VideoStep/
├── services/
│   ├── auth-service/          # 認証サービス
│   ├── video-service/         # 動画管理サービス
│   ├── translation-service/    # 翻訳サービス
│   ├── editing-service/        # 編集サービス
│   ├── user-service/          # ユーザー管理サービス
│   ├── api-gateway/           # APIゲートウェイ
│   └── service-registry/      # サービスレジストリ (Eureka)
├── shared/
│   └── common-lib/           # 共通ライブラリ
├── frontend/                  # フロントエンド (Next.js)
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── videos/       # 動画関連ページ
│   │   │   ├── auth/         # 認証ページ
│   │   │   ├── editing/      # 編集ページ
│   │   │   └── profile/      # プロフィールページ
│   │   ├── components/       # Reactコンポーネント
│   │   └── store/            # Zustandストア
│   └── package.json
├── terraform/                 # Terraform設定
├── docker-compose.yml         # Docker Compose設定
├── build.gradle              # ルートビルド設定
└── settings.gradle           # Gradle設定
```

## セットアップ

### 前提条件

- Java 21以上
- Node.js 18以上
- Docker & Docker Compose
- PostgreSQL 15 (ローカル開発用)

### ローカル開発環境のセットアップ

1. **リポジトリのクローン**
```bash
cd C:\devlop\VideoStep
```

2. **バックエンドサービスのビルド**
```bash
./gradlew build
```

3. **Docker Composeでサービスを起動**
```bash
docker-compose up -d --build
```

4. **フロントエンドのセットアップ**
```bash
cd frontend
npm install
npm run dev
```

### サービスポート

- **API Gateway**: http://localhost:8080
- **Service Registry**: http://localhost:8761
- **Auth Service**: http://localhost:8081
- **Video Service**: http://localhost:8082
- **Translation Service**: http://localhost:8083
- **Editing Service**: http://localhost:8084
- **User Service**: http://localhost:8085
- **Frontend**: http://localhost:3000

## 実装済み機能

### フロントエンド

#### ページ
- ✅ ホームページ (`/`)
- ✅ 動画一覧ページ (`/videos`)
- ✅ 動画詳細ページ (`/videos/[id]`)
- ✅ 動画アップロードページ (`/videos/upload`)
- ✅ ログインページ (`/auth/login`)
- ✅ 登録ページ (`/auth/register`)
- ✅ 編集プロジェクト一覧 (`/editing`)
- ✅ プロフィールページ (`/profile`)

#### コンポーネント
- ✅ Header (ナビゲーションヘッダー)
- ✅ VideoList (動画一覧表示)
- ✅ VideoPlayer (動画プレーヤー)

#### 機能
- ✅ ユーザー認証 (ログイン/登録)
- ✅ 動画検索
- ✅ 動画アップロード
- ✅ 動画再生
- ✅ 翻訳表示
- ✅ プロフィール編集
- ✅ レスポンシブデザイン
- ✅ ダークモード対応

### バックエンド

#### マイクロサービス
- ✅ 認証サービス (JWT認証)
- ✅ 動画管理サービス
- ✅ 翻訳サービス (24言語対応)
- ✅ 編集サービス
- ✅ ユーザー管理サービス
- ✅ APIゲートウェイ
- ✅ サービスレジストリ (Eureka)

## API エンドポイント

### 認証サービス
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン

### 動画サービス
- `GET /api/videos/public` - 公開動画一覧取得
- `GET /api/videos/{id}` - 動画詳細取得
- `POST /api/videos` - 動画作成
- `GET /api/videos/search?keyword={keyword}` - 動画検索
- `PUT /api/videos/{id}/status` - 動画ステータス更新
- `DELETE /api/videos/{id}` - 動画削除

### 翻訳サービス
- `POST /api/translations` - 翻訳実行
- `GET /api/translations/video/{videoId}` - 動画の翻訳一覧取得
- `GET /api/translations/languages` - サポート言語一覧取得

### 編集サービス
- `POST /api/editing/projects` - 編集プロジェクト作成
- `GET /api/editing/projects` - 編集プロジェクト一覧取得
- `GET /api/editing/projects/{id}` - プロジェクト詳細取得
- `POST /api/editing/projects/{projectId}/slides` - スライド追加
- `GET /api/editing/projects/{projectId}/slides` - スライド一覧取得
- `PUT /api/editing/projects/{projectId}/complete` - プロジェクト完了
- `DELETE /api/editing/projects/{projectId}` - プロジェクト削除

### ユーザーサービス
- `GET /api/users/{userId}/profile` - ユーザープロフィール取得
- `PUT /api/users/{userId}/profile` - ユーザープロフィール更新

## Railway セットアップ

Railwayでのデプロイメントとデータベース設定については、以下のドキュメントを参照してください：

- **[RAILWAY_SETUP_INDEX.md](./RAILWAY_SETUP_INDEX.md)** - Railwayセットアップ インデックス（推奨）
- **[RAILWAY_QUICK_SETUP.md](./RAILWAY_QUICK_SETUP.md)** - 5分で完了する設定手順
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - セットアップチェックリスト
- **[RAILWAY_ENV_SETUP_URGENT.md](./RAILWAY_ENV_SETUP_URGENT.md)** - 環境変数エラー対応ガイド

### クイックスタート

1. RailwayダッシュボードでPostgreSQLデータベースサービスを作成
2. 各サービス（video-service, editing-service, auth-service, user-service, translation-service）にデータベースを接続
3. 各サービスが自動的に再デプロイされます

詳細は **[RAILWAY_QUICK_SETUP.md](./RAILWAY_QUICK_SETUP.md)** を参照してください。

## デプロイメント

### Terraformによるインフラ構築

1. **Terraformの初期化**
```bash
cd terraform
terraform init
```

2. **変数の設定**
`terraform.tfvars`ファイルを作成し、必要な変数を設定:
```hcl
aws_region = "ap-northeast-1"
gcp_region = "asia-northeast1"
gcp_project_id = "your-gcp-project-id"
aws_vpc_id = "vpc-xxxxx"
aws_subnet_ids = ["subnet-xxxxx", "subnet-yyyyy"]
aws_ecr_repository_url = "your-ecr-repository-url"
environment = "production"
```

3. **インフラの構築**
```bash
terraform plan
terraform apply
```

### ECSへのデプロイ

1. **Dockerイメージのビルドとプッシュ**
```bash
# 各サービスをビルド
./gradlew :services:auth-service:bootJar
docker build -t videostep/auth-service:latest ./services/auth-service
docker push videostep/auth-service:latest
```

2. **ECSサービスの更新**
AWS ECSコンソールまたはCLIを使用してサービスを更新

## UIデザイン

### デザインコンセプト
- **モダンで斬新**: グラデーション、ガラスモーフィズム、アニメーション
- **ユーザーフレンドリー**: 直感的なナビゲーション、レスポンシブデザイン
- **アクセシビリティ**: ダークモード対応、キーボードナビゲーション

### カラースキーム
- **プライマリ**: ブルー→パープル→ピンクのグラデーション
- **背景**: グラデーション（ライト/ダークモード対応）
- **カード**: ガラス効果とシャドウ

## 開発ガイドライン

### コーディング規約
- Java: Google Java Style Guideに準拠
- TypeScript: ESLint + Prettierを使用

### テスト
```bash
# バックエンドテスト
./gradlew test

# フロントエンドテスト
cd frontend
npm test
```

## ライセンス

このプロジェクトはプロプライエタリです。

## お問い合わせ

VideoStep開発チーム
