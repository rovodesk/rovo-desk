terraform {
  required_version = ">= 1.14.8"

  backend "s3" {
    bucket         = "rovodesk-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  } 
}