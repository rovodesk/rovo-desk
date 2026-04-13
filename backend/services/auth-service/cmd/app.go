package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"

	"syscall"
	"time"

	awsConfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/zero-heads-lab/auth-service/auth"
	"github.com/zero-heads-lab/auth-service/auth/cognito"
	"github.com/zero-heads-lab/auth-service/cache"
	"github.com/zero-heads-lab/auth-service/config"
	"github.com/zero-heads-lab/auth-service/controllers"
	"go.opentelemetry.io/otel"
)

type Application struct {
	config config.AppConfig
	logger *slog.Logger
	server *http.Server
}

func (app *Application) initDependencies() auth.Service {
	// Set Tracer
	tracer := otel.Tracer(app.config.ServiceName)
	// Set Repository
	// repo := data.NewUserRepository(db, tracer, app.logger)

	// Set Cognito service
	// Load the Shared AWS Configuration (~/.aws/config)
	// Set Cognito service

	ctx := context.Background()

	// Load AWS config (~/.aws/config or env)
	cfg, err := awsConfig.LoadDefaultConfig(
		ctx,
		awsConfig.WithRegion(app.config.Cognito.Region),
	)
	if err != nil {
		app.logger.Error("failed to load AWS config", "error", err)
		return nil // or return err if inside a constructor
	}

	// Initialize Cognito client
	cognitoClient, err := cognito.New(cfg, app.config.Cognito)
	if err != nil {
		app.logger.Error("failed to initialize Cognito", "error", err)
		return nil // better than os.Exit in most cases
	}
	// Initialize Cache
	cache, err := cache.NewRedisStore(app.config.Cache)
	if err != nil {
		app.logger.Error("failed to initialize cache", "error", err)
		return nil
	}
	// Initialize Auth Service
	svc := auth.NewAuthService(tracer, app.logger, cognitoClient, app.config.AuthConfig, cache)
	return svc
}

func (app *Application) mount() http.Handler {
	r := chi.NewRouter()

	// middleware
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Logger)

	// health
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	// dependencies
	svc := app.initDependencies()

	// controllers
	userCtrl := controllers.NewAuthController(svc, app.config.AuthConfig)
	docsCtrl := controllers.NewDocsController()

	// mount routes
	userCtrl.AuthRoutes(r)
	docsCtrl.Routes(r)

	return r
}

func (app *Application) run() error {
	app.server = &http.Server{
		Addr:         app.config.Addr,
		Handler:      app.mount(),
		WriteTimeout: 30 * time.Second,
		ReadTimeout:  10 * time.Second,
		IdleTimeout:  time.Minute,
	}

	errCh := make(chan error, 1)

	go func() {
		app.logger.Info("server started", "addr", app.config.Addr)

		if err := app.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			errCh <- err
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-errCh:
		return err
	case <-quit:
		app.logger.Info("shutting down server...")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	return app.server.Shutdown(ctx)
}
