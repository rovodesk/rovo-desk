module "app" {
  source = "../../stacks/app"

  environment = var.environment
  aws_region  = var.aws_region
  default_tags = var.default_tags
  /**
   * TODO: Add the rest of the modules
   */
} 