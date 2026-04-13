package main

import (
	"log/slog"
	"os"

	"github.com/trust-none/user-service/config"
)

func main() {
	cfg := config.Load()

	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	app := &Application{
		config: cfg,
		logger: logger,
		db:     nil,
		server: nil,
	}

	if err := app.run(); err != nil {
		logger.Error("shutdown error", "error", err)
		os.Exit(1)
	}
}
