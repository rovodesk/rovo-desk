# Post Auth Confirmation Trigger

Disable buildkit if using MAC

## Setup ECR

### Login To ECR
```bash
aws ecr get-login-password --region ap-south-1 \
| docker login \
--username AWS \
--password-stdin <your-account-id>.dkr.ecr.ap-south-1.amazonaws.com
```

### Create ECR Repository
```bash
aws ecr create-repository \
  --repository-name post-confirmation-lambda \
  --region ap-south-1
```

### Build Docker Image for ARM64

Disable buildkit for disabling cross-platform builds

```bash
DOCKER_BUILDKIT=0 docker build \
  --platform linux/arm64 \
  -t post-confirmation-lambda:latest \
  .
```

### Tag for ECR
```bash
docker tag post-confirmation-lambda:latest \
<account-id>.dkr.ecr.ap-south-1.amazonaws.com/post-confirmation-lambda:latest
```

### Push Docker Image to ECR
```bash
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/post-confirmation-lambda:latest
```

### Set LambdaECRAccess IAM Policy
```bash
aws ecr set-repository-policy \
  --repository-name post-confirmation-lambda \
  --policy-text '{
    "Version": "2008-10-17",
    "Statement": [
      {
        "Sid": "LambdaECRAccess",
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": [
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer"
        ]
      }
    ]
  }'
```

### Delete ECR Repository
```bash
aws ecr delete-repository \
  --repository-name post-confirmation-lambda \
  --force
```

### Delete Image
```bash
aws ecr batch-delete-image \
  --repository-name post-confirmation-lambda \
  --image-ids imageTag=latest
```

## Deploy via CloudFormation

### Deploy Latest Version
```bash
aws cloudformation deploy \
  --template-file cloudformation.yaml \
  --stack-name post-confirmation-cognito-lambda-trigger \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    ExistingUserPoolId=<your-user-pool-id> \
    ExistingSNSTopicArn=<your-sns-topic-arn>
```

### Deploy with new Image Tag
```bash
aws cloudformation deploy \
  --template-file cloudformation.yaml \
  --stack-name post-confirmation-cognito-lambda-trigger \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    ExistingUserPoolId=<your-user-pool-id> \
    ExistingSNSTopicArn=<your-sns-topic-arn> \
    ImageTag=<new-tag>
```

### Delete Deployment stack
```bash
aws cloudformation delete-stack \
  --stack-name post-confirmation
```

### Wait for stack deletion
```bash
aws cloudformation wait stack-delete-complete \
  --stack-name post-confirmation
```