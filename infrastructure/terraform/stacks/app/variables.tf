variable "aws_region" {
  type        = string
  description = "The AWS region to deploy resources to"
}

variable "environment" {
  type        = string
  description = "The environment name"
}

variable "default_tags" {
  type        = map(string)
  description = "Default tags to apply to all resources"
}
