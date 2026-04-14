# ============================================================================
# Production-Grade Authentication Service Makefile with CI/CD Support
# ============================================================================

# Configuration
APP_NAME := auth-service
CMD_PATH := ./cmd
BUILD_DIR := ./bin
DOCKER_REGISTRY ?= docker.io
DOCKER_IMAGE ?= $(APP_NAME)
DOCKER_TAG ?= latest
GO := go
GOCMD := $(GO)
GOFLAGS := -v
LDFLAGS := -ldflags="-X main.Version=$(VERSION) -X main.BuildTime=$(BUILD_TIME)"
VERSION ?= dev
BUILD_TIME := $(shell date -u '+%Y-%m-%dT%H:%M:%SZ')
GOLANGCI_VERSION := v1.54.2

# Directories
TEST_DIR := ./tests
COVERAGE_DIR := ./coverage
DIST_DIR := ./dist

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# ============================================================================
# Main Targets
# ============================================================================

.PHONY: help
help:
	@echo "$(BLUE)=================================="
	@echo "  $(APP_NAME) - Makefile Commands"
	@echo "===================================$(NC)"
	@echo ""
	@echo "$(GREEN)Development:$(NC)"
	@echo "  make run              - Run the app locally"
	@echo "  make dev              - Run with .env loaded"
	@echo "  make build            - Build binary"
	@echo "  make clean            - Clean build artifacts"
	@echo ""
	@echo "$(GREEN)Code Quality:$(NC)"
	@echo "  make fmt              - Format code"
	@echo "  make lint             - Run linter (vet)"
	@echo "  make golangci-lint    - Run golangci-lint"
	@echo "  make test             - Run tests"
	@echo "  make test-coverage    - Run tests with coverage"
	@echo "  make coverage-report  - Generate coverage report"
	@echo ""
	@echo "$(GREEN)Dependencies:$(NC)"
	@echo "  make tidy             - Tidy modules"
	@echo "  make vendor           - Vendor dependencies"
	@echo ""
	@echo "$(GREEN)Docker:$(NC)"
	@echo "  make docker-build     - Build Docker image"
	@echo "  make docker-run       - Run Docker image"
	@echo "  make docker-push      - Push Docker image"
	@echo "  make docker-clean     - Remove Docker image"
	@echo ""
	@echo "$(GREEN)CI/CD:$(NC)"
	@echo "  make ci               - Run all CI checks"
	@echo "  make ci-lint          - Run linting checks"
	@echo "  make ci-test          - Run all tests"
	@echo "  make ci-build         - Build for CI/CD"
	@echo ""
	@echo "$(GREEN)Documentation:$(NC)"
	@echo "  make docs             - Generate API docs"
	@echo "  make docs-serve       - Serve docs locally"
	@echo ""
	@echo "$(GREEN)Release:$(NC)"
	@echo "  make release          - Build release artifacts"
	@echo "  make release-docker   - Build and push release Docker image"
	@echo ""

# ============================================================================
# Development Targets
# ============================================================================

.PHONY: run
run:
	@echo "$(BLUE)Running $(APP_NAME)...$(NC)"
	$(GOCMD) run $(CMD_PATH)/main.go

.PHONY: dev
dev:
	@echo "$(BLUE)Running $(APP_NAME) with .env...$(NC)"
	@if [ -f .env ]; then \
		echo "$(GREEN)✓ Loading .env$(NC)"; \
		export $$(cat .env | xargs) && $(GOCMD) run $(CMD_PATH)/main.go; \
	else \
		echo "$(YELLOW)⚠ .env not found, running without it$(NC)"; \
		$(GOCMD) run $(CMD_PATH)/main.go; \
	fi

.PHONY: build
build: clean
	@echo "$(BLUE)Building $(APP_NAME) (v$(VERSION))...$(NC)"
	@mkdir -p $(BUILD_DIR)
	$(GOCMD) build $(GOFLAGS) $(LDFLAGS) -o $(BUILD_DIR)/$(APP_NAME) $(CMD_PATH)/main.go
	@echo "$(GREEN)✓ Binary built: $(BUILD_DIR)/$(APP_NAME)$(NC)"

.PHONY: build-static
build-static: clean
	@echo "$(BLUE)Building static binary (v$(VERSION))...$(NC)"
	@mkdir -p $(BUILD_DIR)
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 $(GOCMD) build $(GOFLAGS) \
		$(LDFLAGS) -o $(BUILD_DIR)/$(APP_NAME) $(CMD_PATH)/main.go
	@echo "$(GREEN)✓ Static binary built$(NC)"

.PHONY: clean
clean:
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	@rm -rf $(BUILD_DIR) $(COVERAGE_DIR) $(DIST_DIR)
	@$(GOCMD) clean
	@echo "$(GREEN)✓ Clean complete$(NC)"

# ============================================================================
# Testing Targets
# ============================================================================

.PHONY: test
test:
	@echo "$(BLUE)Running tests...$(NC)"
	$(GOCMD) test -v -race -timeout 10m ./...
	@echo "$(GREEN)✓ Tests passed$(NC)"

.PHONY: test-coverage
test-coverage:
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	@mkdir -p $(COVERAGE_DIR)
	$(GOCMD) test -v -race -timeout 10m -covermode=atomic \
		-coverprofile=$(COVERAGE_DIR)/coverage.out ./...
	@echo "$(GREEN)✓ Coverage report generated$(NC)"

.PHONY: coverage-report
coverage-report: test-coverage
	@echo "$(BLUE)Generating coverage report...$(NC)"
	$(GOCMD) tool cover -html=$(COVERAGE_DIR)/coverage.out \
		-o $(COVERAGE_DIR)/coverage.html
	@echo "$(GREEN)✓ Coverage report: $(COVERAGE_DIR)/coverage.html$(NC)"

.PHONY: test-unit
test-unit:
	@echo "$(BLUE)Running unit tests...$(NC)"
	$(GOCMD) test -v -short ./...

.PHONY: test-integration
test-integration:
	@echo "$(BLUE)Running integration tests...$(NC)"
	$(GOCMD) test -v -tags=integration ./tests/integration/...

# ============================================================================
# Code Quality Targets
# ============================================================================

.PHONY: fmt
fmt:
	@echo "$(BLUE)Formatting code...$(NC)"
	$(GOCMD) fmt ./...
	@echo "$(GREEN)✓ Formatting complete$(NC)"

.PHONY: fmt-check
fmt-check:
	@echo "$(BLUE)Checking code formatting...$(NC)"
	@if [ -n "$$($(GOCMD) fmt ./...)" ]; then \
		echo "$(RED)✗ Code not formatted$(NC)"; \
		exit 1; \
	else \
		echo "$(GREEN)✓ Code is properly formatted$(NC)"; \
	fi

.PHONY: lint
lint:
	@echo "$(BLUE)Running vet...$(NC)"
	$(GOCMD) vet ./...
	@echo "$(GREEN)✓ Vet passed$(NC)"

.PHONY: golangci-lint
golangci-lint:
	@echo "$(BLUE)Running golangci-lint...$(NC)"
	@which golangci-lint > /dev/null || \
		(echo "$(YELLOW)Installing golangci-lint...$(NC)" && \
		 go install github.com/golangci/golangci-lint/cmd/golangci-lint@$(GOLANGCI_VERSION))
	@golangci-lint run ./... --deadline=5m
	@echo "$(GREEN)✓ golangci-lint passed$(NC)"

.PHONY: lint-all
lint-all: lint golangci-lint fmt-check
	@echo "$(GREEN)✓ All linting checks passed$(NC)"

# ============================================================================
# Dependency Targets
# ============================================================================

.PHONY: tidy
tidy:
	@echo "$(BLUE)Tidying dependencies...$(NC)"
	$(GOCMD) mod tidy
	@echo "$(GREEN)✓ Dependencies tidied$(NC)"

.PHONY: vendor
vendor:
	@echo "$(BLUE)Vendoring dependencies...$(NC)"
	$(GOCMD) mod vendor
	@echo "$(GREEN)✓ Dependencies vendored$(NC)"

.PHONY: deps-check
deps-check:
	@echo "$(BLUE)Checking for vulnerable dependencies...$(NC)"
	$(GOCMD) list -json -m all | nancy sleuth --skip-update
	@echo "$(GREEN)✓ No vulnerable dependencies found$(NC)"

# ============================================================================
# Docker Targets
# ============================================================================

.PHONY: docker-build
docker-build:
	@echo "$(BLUE)Building Docker image: $(DOCKER_IMAGE):$(DOCKER_TAG)...$(NC)"
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) \
		-t $(DOCKER_IMAGE):latest \
		--build-arg VERSION=$(VERSION) \
		--build-arg BUILD_TIME=$(BUILD_TIME) \
		-f Dockerfile .
	@echo "$(GREEN)✓ Docker image built$(NC)"

.PHONY: docker-run
docker-run: docker-build
	@echo "$(BLUE)Running Docker container...$(NC)"
	docker run -p 3000:3000 \
		--env-file .env \
		$(DOCKER_IMAGE):$(DOCKER_TAG)

.PHONY: docker-push
docker-push: docker-build
	@echo "$(BLUE)Pushing Docker image...$(NC)"
	docker tag $(DOCKER_IMAGE):$(DOCKER_TAG) \
		$(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(DOCKER_TAG)
	docker push $(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(DOCKER_TAG)
	@echo "$(GREEN)✓ Docker image pushed$(NC)"

.PHONY: docker-clean
docker-clean:
	@echo "$(BLUE)Cleaning Docker images...$(NC)"
	docker rmi -f $(DOCKER_IMAGE):$(DOCKER_TAG) || true
	docker rmi -f $(DOCKER_IMAGE):latest || true
	@echo "$(GREEN)✓ Docker images removed$(NC)"

# ============================================================================
# CI/CD Targets
# ============================================================================

.PHONY: ci
ci: lint-all test-coverage build
	@echo "$(GREEN)✓ All CI checks passed$(NC)"

.PHONY: ci-lint
ci-lint:
	@echo "$(BLUE)Running CI linting checks...$(NC)"
	@$(MAKE) fmt-check
	@$(MAKE) lint
	@echo "$(GREEN)✓ Linting checks passed$(NC)"

.PHONY: ci-test
ci-test:
	@echo "$(BLUE)Running CI tests...$(NC)"
	@$(MAKE) test-coverage
	@echo "$(GREEN)✓ Tests passed$(NC)"

.PHONY: ci-build
ci-build:
	@echo "$(BLUE)Running CI build...$(NC)"
	@$(MAKE) build-static
	@echo "$(GREEN)✓ Build successful$(NC)"

.PHONY: ci-docker
ci-docker:
	@echo "$(BLUE)Running CI Docker build...$(NC)"
	@$(MAKE) docker-build
	@echo "$(GREEN)✓ Docker build successful$(NC)"

# ============================================================================
# Release Targets
# ============================================================================

.PHONY: release
release: clean
	@echo "$(BLUE)Building release artifacts (v$(VERSION))...$(NC)"
	@mkdir -p $(DIST_DIR)
	@# Linux x86_64
	@CGO_ENABLED=0 GOOS=linux GOARCH=amd64 $(GOCMD) build $(LDFLAGS) \
		-o $(DIST_DIR)/$(APP_NAME)-linux-amd64 $(CMD_PATH)/main.go
	@# macOS x86_64
	@CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 $(GOCMD) build $(LDFLAGS) \
		-o $(DIST_DIR)/$(APP_NAME)-darwin-amd64 $(CMD_PATH)/main.go
	@# macOS ARM64
	@CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 $(GOCMD) build $(LDFLAGS) \
		-o $(DIST_DIR)/$(APP_NAME)-darwin-arm64 $(CMD_PATH)/main.go
	@# Windows x86_64
	@CGO_ENABLED=0 GOOS=windows GOARCH=amd64 $(GOCMD) build $(LDFLAGS) \
		-o $(DIST_DIR)/$(APP_NAME)-windows-amd64.exe $(CMD_PATH)/main.go
	@echo "$(GREEN)✓ Release artifacts built in $(DIST_DIR)$(NC)"

.PHONY: release-docker
release-docker: release docker-build
	@echo "$(BLUE)Tagging and pushing release Docker image...$(NC)"
	docker tag $(DOCKER_IMAGE):$(DOCKER_TAG) \
		$(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(VERSION)
	docker push $(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(VERSION)
	@echo "$(GREEN)✓ Release Docker image pushed$(NC)"

# ============================================================================
# Documentation Targets
# ============================================================================

.PHONY: docs
docs:
	@echo "$(BLUE)Generating API documentation...$(NC)"
	@mkdir -p docs
	@which swag > /dev/null || \
		(echo "$(YELLOW)Installing swag...$(NC)" && \
		 go install github.com/swaggo/swag/cmd/swag@latest)
	@swag init -g cmd/main.go -d ./ -o docs --parseVendor
	@echo "$(GREEN)✓ Documentation generated in docs/$(NC)"

.PHONY: docs-serve
docs-serve: docs
	@echo "$(BLUE)Serving documentation at http://localhost:8080/swagger/index.html$(NC)"
	@cd docs && python -m http.server 8080

# ============================================================================
# Utility Targets
# ============================================================================

.PHONY: version
version:
	@echo "$(BLUE)Version: $(VERSION)$(NC)"
	@echo "$(BLUE)Build Time: $(BUILD_TIME)$(NC)"

.PHONY: info
info:
	@echo "$(BLUE)Go Version:$(NC) $$($(GOCMD) version)"
	@echo "$(BLUE)Go Path:$(NC) $$($(GOCMD) env GOPATH)"
	@echo "$(BLUE)OS:$(NC) $$(uname -s)"
	@echo "$(BLUE)Architecture:$(NC) $$(uname -m)"

.PHONY: security-scan
security-scan:
	@echo "$(BLUE)Running security scan with gosec...$(NC)"
	@which gosec > /dev/null || \
		(echo "$(YELLOW)Installing gosec...$(NC)" && \
		 go install github.com/securego/gosec/v2/cmd/gosec@latest)
	@gosec -no-fail ./...
	@echo "$(GREEN)✓ Security scan complete$(NC)"

.PHONY: install-tools
install-tools:
	@echo "$(BLUE)Installing development tools...$(NC)"
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@$(GOLANGCI_VERSION)
	go install github.com/securego/gosec/v2/cmd/gosec@latest
	go install github.com/swaggo/swag/cmd/swag@latest
	@echo "$(GREEN)✓ Tools installed$(NC)"

# ============================================================================
# Environment Setup
# ============================================================================

.PHONY: setup-env
setup-env:
	@echo "$(BLUE)Setting up environment...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)Creating .env from .env.example...$(NC)"; \
		cp .env.example .env; \
		echo "$(GREEN)✓ .env created$(NC)"; \
	else \
		echo "$(GREEN)✓ .env already exists$(NC)"; \
	fi

.PHONY: health-check
health-check:
	@echo "$(BLUE)Running health check on http://localhost:3000/health...$(NC)"
	@curl -s http://localhost:3000/health && echo "" || echo "$(RED)✗ Health check failed$(NC)"

# ============================================================================
# Default Target
# ============================================================================

.DEFAULT_GOAL := help

# ============================================================================
# Phony Declarations (Ensure all targets are treated as phony)
# ============================================================================

.PHONY: all
all: lint test build
	@echo "$(GREEN)✓ All targets completed successfully$(NC)"
