include .env
export

APP_NAME := auth-service

# Colors
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
NC := \033[0m

# Ensure DATABASE_URL exists
check-db:
	@if [ -z "$(DATABASE_URL)" ]; then \
		echo "$(RED)Error: DATABASE_URL is not set$(NC)"; \
		exit 1; \
	fi

.PHONY: build
build:
	@echo "$(RED)Not Implemented Yet!$(NC)"

.PHONY: run
run:
	@echo "$(BLUE)Running $(APP_NAME)...$(NC)"
	@encore run

.PHONY: docs
docs:
	@echo "$(GREEN)Generating OpenAPI for $(APP_NAME)...$(NC)"
	@mkdir -p docs
	@rm -f docs/openapi_public.json
	@encore gen client --lang=openapi \
		-o docs/openapi_public.json \
		--openapi-exclude-private-endpoints

.PHONY: clean-docs
clean-docs:
	@rm -f docs/*.json
	@echo "$(RED)Docs cleaned$(NC)"
# ----------------------------
# Migrations
# ----------------------------

.PHONY: migrate-create
migrate-create:
	@if [ -z "$(name)" ]; then \
		echo "$(RED)Error: provide name=your_migration_name$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Creating empty migration: $(name)$(NC)"
	@mkdir -p migrations
	@goose -dir migrations create $(name) sql

# 🔥 Atlas (GORM → SQL)
.PHONY: migrate-diff
migrate-diff: check-db
ifndef name
	$(error name is required. Usage: make migrate-diff name=create_documents)
endif
	@echo "$(BLUE)Generating migration from GORM via Atlas: $(name)$(NC)"
	@atlas migrate diff $(name) --env gorm --dev-url "docker://postgres/15/dev"

# ----------------------------
# Goose execution
# ----------------------------

.PHONY: migrate-up
migrate-up: check-db
	@echo "$(BLUE)Running migrations UP$(NC)"
	@goose -dir migrations postgres "$(DATABASE_URL)" up

.PHONY: migrate-down
migrate-down: check-db
	@echo "$(YELLOW)Rolling back last migration$(NC)"
	@goose -dir migrations postgres "$(DATABASE_URL)" down

.PHONY: migrate-reset
migrate-reset: check-db
	@echo "$(RED)Resetting all migrations$(NC)"
	@goose -dir migrations postgres "$(DATABASE_URL)" reset

.PHONY: migrate-status
migrate-status: check-db
	@goose -dir migrations postgres "$(DATABASE_URL)" status

.PHONY: migrate-version
migrate-version: check-db
	@goose -dir migrations postgres "$(DATABASE_URL)" version