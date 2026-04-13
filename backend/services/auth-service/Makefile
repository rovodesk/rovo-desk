APP_NAME := auth-service
CMD_PATH := ./cmd
BUILD_DIR := ./bin

GO := go

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make run        - Run the app"
	@echo "  make dev        - Run the app with .env"
	@echo "  make docker-build - Build docker image"
	@echo "  make docker-run - Run docker image"
	@echo "  make build      - Build binary"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make test       - Run tests"
	@echo "  make tidy       - Tidy modules"
	@echo "  make fmt        - Format code"
	@echo "  make lint       - Run vet"

.PHONY: run
run:
	$(GO) run $(CMD_PATH)

.PHONY: build
build:
	$(GO) build -o $(BUILD_DIR)/$(APP_NAME) $(CMD_PATH)/main.go

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)

.PHONY: test
test:
	$(GO) test ./... -v

.PHONY: tidy
tidy:
	$(GO) mod tidy

.PHONY: fmt
fmt:
	$(GO) fmt ./...

.PHONY: lint
lint:
	$(GO) vet ./...

.PHONY: dev
dev:
	@echo "Running with .env"
	@if [ -f .env ]; then \
		echo "Loading .env"; \
		export $$(cat .env | xargs) && $(GO) run ./cmd; \
	else \
		echo ".env not found, running without it"; \
		$(GO) run ./cmd; \
	fi

.PHONY: docker-build
docker-build:
	docker build -t $(APP_NAME):latest .

.PHONY: docker-run
docker-run:
	docker run -p 8080:8080 $(APP_NAME):latest

.PHONY: docs
docs:
	@mkdir -p docs
	@echo "Generating Docs..."
	@swag init -g controllers.go -d controllers,auth,cmd -o docs  --ot json,yaml

# migrations
migrate-create:
	goose -dir migrations create $(name) sql

migrate-up:
	goose -dir migrations postgres "$(DB_DSN)" up

migrate-down:
	goose -dir migrations postgres "$(DB_DSN)" down