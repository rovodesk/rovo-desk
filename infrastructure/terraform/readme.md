# RovoDesk Infrastructure

This directory contains the Terraform configuration for provisioning and managing the AWS infrastructure for RovoDesk.

## Architecture Highlights
- **Multi-Environment Support**: Clean separation between `dev`, `staging`, and `prod`.
- **Remote State Management**: Terraform state is stored securely in S3 with state locking via DynamoDB.
- **Modular Design**: Reusable infrastructure components located in the `stacks` and `modules` directories.

---

## Directory Structure

```bash
infrastructure/terraform/
├── environments/          # Environment-specific configurations
│   ├── dev/               # Development environment
│   ├── staging/           # Staging environment
│   └── prod/              # Production environment (Mission Critical)
├── global/                # Global resources and bootstrap configurations
│   └── backend-bootstrap/ # Provisions S3 Bucket and DynamoDB for TF state
├── modules/               # Small, atomic, reusable components (e.g., vpc, rds)
└── stacks/                # Higher-level orchestrations (e.g., app-stack)
```

---

## Prerequisites

Before you begin, ensure you have the following installed:
1. [Terraform](https://developer.hashicorp.com/terraform/downloads) (v1.0.0+)
2. [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials.
3. Access to an AWS Account.

---

## Setup & Deployment

### 1. Bootstrap Remote State (One-time)
Before managing any environments, you must create the S3 bucket and DynamoDB table for Terraform's own state management.

```bash
cd global/backend-bootstrap
terraform init
terraform apply
```

### 2. Deploying an Environment
To deploy or update a specific environment (e.g., `dev`):

```bash
# Navigate to the environment directory
cd environments/dev

# Initialize the backend and modules
terraform init

# Review the planned changes
terraform plan

# Apply the changes
terraform apply
```

---

## Best Practices
- **Always run `terraform plan`** before applying changes to see exactly what will be modified.
- **Never commit `terraform.tfstate`** files (these are excluded via `.gitignore`).
- **Use Workspaces** (if applicable) or the environment-specific directory structure for isolation.
- **Tags**: Ensure resources are properly tagged (standard tags are defined in `terraform.tfvars`).

## Common Commands

| Command | Description |
|---------|-------------|
| `terraform init` | Initializes the working directory and downloads providers. |
| `terraform validate` | Checks the syntax and consistency of the configuration. |
| `terraform plan` | Shows the execution plan (what will be created/destroyed). |
| `terraform apply` | Executes the actions proposed in the plan. |
| `terraform destroy` | Removes all infrastructure managed by the configuration. |