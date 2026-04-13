# Post Auth Confirmation Trigger

## Login To ECR
aws ecr get-login-password --region ap-south-1 \
| docker login \
--username AWS \
--password-stdin <your-account-id>.dkr.ecr.ap-south-1.amazonaws.com

## Create ECR Repository
aws ecr create-repository \
  --repository-name post-confirmation-lambda \
  --region ap-south-1

## Build Docker Image for ARM64
docker buildx build --platform linux/arm64 -t post-confirmation-lambda .

## Tag Docker Image
docker tag post-confirmation-lambda:latest <your-account-id>.dkr.ecr.ap-south-1.amazonaws.com/post-confirmation-lambda:latest

## Push Docker Image to ECR
docker push <your-account-id>.dkr.ecr.ap-south-1.amazonaws.com/post-confirmation-lambda:latest