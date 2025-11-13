variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-northeast-1"
}

variable "gcp_region" {
  description = "GCP region for resources"
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
  description = "AWS Subnet IDs for ECS"
  type        = list(string)
}

variable "aws_ecr_repository_url" {
  description = "AWS ECR Repository URL"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

