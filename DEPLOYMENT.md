# デプロイメントガイド

VideoStepプロジェクトのデプロイメント手順を説明します。

## 前提条件

- AWSアカウント
- GCPアカウント
- Terraform 1.0以上
- Docker & Docker Compose
- AWS CLI設定済み
- GCP CLI設定済み

## ローカル環境でのテスト

### 1. バックエンドサービスのビルド

```bash
./gradlew clean build
```

### 2. Docker Composeで起動

```bash
docker-compose up -d --build
```

### 3. サービスの確認

- API Gateway: http://localhost:8080
- Service Registry: http://localhost:8761
- Frontend: http://localhost:3000

## AWS/GCPへのデプロイ

### 1. Terraformの初期化

```bash
cd terraform
terraform init
```

### 2. 変数の設定

`terraform.tfvars`ファイルを作成：

```hcl
aws_region = "ap-northeast-1"
gcp_region = "asia-northeast1"
gcp_project_id = "your-gcp-project-id"
aws_vpc_id = "vpc-xxxxx"
aws_subnet_ids = ["subnet-xxxxx", "subnet-yyyyy"]
aws_ecr_repository_url = "your-ecr-repository-url"
environment = "production"
```

### 3. インフラの構築

```bash
terraform plan
terraform apply
```

### 4. Dockerイメージのビルドとプッシュ

```bash
# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <your-ecr-url>

# 各サービスをビルドしてプッシュ
./gradlew :services:auth-service:bootJar
docker build -t <ecr-url>/auth-service:latest -f services/auth-service/Dockerfile .
docker push <ecr-url>/auth-service:latest

# 他のサービスも同様に
```

### 5. ECSサービスの更新

AWS ECSコンソールまたはCLIを使用してサービスを更新：

```bash
aws ecs update-service --cluster videostep-cluster --service videostep-auth-service --force-new-deployment
```

## 環境変数の設定

各サービスに必要な環境変数を設定：

- `SPRING_DATASOURCE_URL`: データベース接続URL
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`: EurekaサーバーURL
- `JWT_SECRET`: JWT秘密鍵
- `AWS_ACCESS_KEY_ID`: AWSアクセスキー
- `AWS_SECRET_ACCESS_KEY`: AWSシークレットキー

## モニタリング

- CloudWatch Logs: ログの確認
- ECS Metrics: コンテナのメトリクス
- Application Load Balancer: トラフィックの監視

## トラブルシューティング

### サービスが起動しない

1. ログを確認: `docker logs <container-name>`
2. データベース接続を確認
3. ネットワーク設定を確認

### イメージのビルドエラー

1. Dockerfileのパスを確認
2. ビルドコンテキストを確認
3. Gradleビルドが成功しているか確認

## ロールバック

問題が発生した場合：

```bash
# 前のバージョンにロールバック
aws ecs update-service --cluster videostep-cluster --service <service-name> --task-definition <previous-task-definition>
```

