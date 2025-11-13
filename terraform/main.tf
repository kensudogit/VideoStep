terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

# AWS Provider
provider "aws" {
  region = var.aws_region
}

# GCP Provider
provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# AWS ECS Cluster
resource "aws_ecs_cluster" "videostep_cluster" {
  name = "videostep-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = var.environment
    Project     = "VideoStep"
  }
}

# AWS ECS Task Definition for Service Registry
resource "aws_ecs_task_definition" "service_registry" {
  family                   = "videostep-service-registry"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([{
    name  = "service-registry"
    image = "${var.aws_ecr_repository_url}/service-registry:latest"
    portMappings = [{
      containerPort = 8761
      protocol      = "tcp"
    }]
    environment = [
      {
        name  = "SPRING_PROFILES_ACTIVE"
        value = "production"
      }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.videostep_logs.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "service-registry"
      }
    }
  }])
}

# AWS ECS Service for Service Registry
resource "aws_ecs_service" "service_registry" {
  name            = "videostep-service-registry"
  cluster         = aws_ecs_cluster.videostep_cluster.id
  task_definition = aws_ecs_task_definition.service_registry.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.aws_subnet_ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.service_registry.arn
    container_name   = "service-registry"
    container_port   = 8761
  }
}

# AWS Application Load Balancer
resource "aws_lb" "videostep_alb" {
  name               = "videostep-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = var.aws_subnet_ids

  enable_deletion_protection = false

  tags = {
    Environment = var.environment
    Project     = "VideoStep"
  }
}

# AWS Target Group for Service Registry
resource "aws_lb_target_group" "service_registry" {
  name     = "videostep-service-registry-tg"
  port     = 8761
  protocol = "HTTP"
  vpc_id   = var.aws_vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/actuator/health"
    matcher             = "200"
  }
}

# AWS Security Groups
resource "aws_security_group" "alb_sg" {
  name        = "videostep-alb-sg"
  description = "Security group for VideoStep ALB"
  vpc_id      = var.aws_vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "videostep-alb-sg"
  }
}

resource "aws_security_group" "ecs_sg" {
  name        = "videostep-ecs-sg"
  description = "Security group for VideoStep ECS services"
  vpc_id      = var.aws_vpc_id

  ingress {
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "videostep-ecs-sg"
  }
}

# AWS IAM Roles
resource "aws_iam_role" "ecs_execution_role" {
  name = "videostep-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role" "ecs_task_role" {
  name = "videostep-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

# AWS CloudWatch Log Group
resource "aws_cloudwatch_log_group" "videostep_logs" {
  name              = "/ecs/videostep"
  retention_in_days = 7
}

# GCP Cloud SQL for PostgreSQL (Multi-region)
resource "google_sql_database_instance" "videostep_postgres" {
  name             = "videostep-postgres-instance"
  database_version = "POSTGRES_15"
  region          = var.gcp_region

  settings {
    tier              = "db-f1-micro"
    availability_type = "ZONAL"

    backup_configuration {
      enabled    = true
      start_time = "03:00"
    }

    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        value = "0.0.0.0/0"
      }
    }
  }
}

# GCP Cloud SQL Database
resource "google_sql_database" "videostep_auth_db" {
  name     = "videostep_auth"
  instance = google_sql_database_instance.videostep_postgres.name
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "gcp_region" {
  description = "GCP region"
  type        = string
  default     = "asia-northeast1"
}

variable "gcp_project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "aws_vpc_id" {
  description = "AWS VPC ID"
  type        = string
}

variable "aws_subnet_ids" {
  description = "AWS Subnet IDs"
  type        = list(string)
}

variable "aws_ecr_repository_url" {
  description = "AWS ECR Repository URL"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# Outputs
output "ecs_cluster_id" {
  value = aws_ecs_cluster.videostep_cluster.id
}

output "alb_dns_name" {
  value = aws_lb.videostep_alb.dns_name
}

output "cloud_sql_instance_name" {
  value = google_sql_database_instance.videostep_postgres.name
}

