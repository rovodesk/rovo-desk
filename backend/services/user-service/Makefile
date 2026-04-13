APP_NAME := user-service
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
	@mkdir -p docs/frontend docs/backend docs/platform
	@echo "Generating Frontend docs..."
	@swag init -g controllers.go -d controllers,user -o docs/frontend --instanceName frontend -t Frontend --ot json,yaml
	@jq 'del(.tags[]? | select(.name == "Frontend")) | .paths[][].tags |= map(select(. != "Frontend"))' docs/frontend/frontend_swagger.json > docs/frontend/tmp.json && mv docs/frontend/tmp.json docs/frontend/frontend_swagger.json
	@echo "Generating Backend docs..."
	@swag init -g controllers.go -d controllers,user -o docs/backend --instanceName backend -t Backend --ot json,yaml
	@jq 'del(.tags[]? | select(.name == "Backend")) | .paths[][].tags |= map(select(. != "Backend"))' docs/backend/backend_swagger.json > docs/backend/tmp.json && mv docs/backend/tmp.json docs/backend/backend_swagger.json
	@echo "Generating Platform docs..."
	@swag init -g controllers.go -d controllers,user -o docs/platform --instanceName platform -t Platform --ot json,yaml
	@jq 'del(.tags[]? | select(.name == "Platform")) | .paths[][].tags |= map(select(. != "Platform"))' docs/platform/platform_swagger.json > docs/platform/tmp.json && mv docs/platform/tmp.json docs/platform/platform_swagger.json

# migrations
migrate-create:
	goose -dir migrations create $(name) sql

migrate-up:
	goose -dir migrations postgres "$(DB_DSN)" up

migrate-down:
	goose -dir migrations postgres "$(DB_DSN)" down