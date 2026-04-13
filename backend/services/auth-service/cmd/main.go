package main

import (
	"log/slog"
	"os"

	"github.com/zero-heads-lab/auth-service/config"
)

// @title           Auth Service API
// @version         1.0
// @description     This is  server.

// @host      localhost:5001
// @BasePath  /v1

// @securityDefinitions.basic  BasicAuth

// @externalDocs.description  OpenAPI
// @externalDocs.url          http://localhost:5001/docs/openapi.json
func main() {
	cfg := config.Load()

	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	app := &Application{
		config: cfg,
		logger: logger,
		server: nil,
	}

	if err := app.run(); err != nil {
		logger.Error("shutdown error", "error", err)
		os.Exit(1)
	}
}
