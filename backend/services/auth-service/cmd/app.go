package main

import (
	"context"
	"fmt"
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
	appMiddleware "github.com/zero-heads-lab/auth-service/middleware"
	"github.com/zero-heads-lab/auth-service/utils"
	"go.opentelemetry.io/otel"
)

type Application struct {
	config config.AppConfig
	logger *slog.Logger
	server *http.Server
}

func (app *Application) initDependencies() (auth.Service, cache.Store, error) {
	ctx := context.Background()

	// Set Tracer
	tracer := otel.Tracer(app.config.ServiceName)

	// Load AWS config (~/.aws/config or env)
	awsCfg, err := awsConfig.LoadDefaultConfig(
		ctx,
		awsConfig.WithRegion(app.config.Cognito.Region),
	)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to load AWS config: %w", err)
	}

	// Initialize Cognito client
	cognitoClient, err := cognito.New(awsCfg, app.config.Cognito)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to initialize Cognito: %w", err)
	}

	// Initialize Cache
	cacheStore, err := cache.NewRedisStore(app.config.Cache)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to initialize cache: %w", err)
	}

	// Initialize Auth Service
	svc := auth.NewAuthService(tracer, app.logger, cognitoClient, app.config, cacheStore)

	return svc, cacheStore, nil
}

func (app *Application) mount() (http.Handler, error) {
	r := chi.NewRouter()

	// Core middleware
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)

	// Request logging middleware
	r.Use(appMiddleware.RequestLoggingMiddleware(app.logger))

	// CORS middleware (if enabled)
	if app.config.CORS.Enabled && len(app.config.CORS.AllowedOrigins) > 0 {
		r.Use(func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Access-Control-Allow-Origin", app.config.CORS.AllowedOrigins[0])
				w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
				w.Header().Set("Access-Control-Allow-Credentials", "true")
				w.Header().Set("Access-Control-Max-Age", "3600")

				if r.Method == http.MethodOptions {
					w.WriteHeader(http.StatusOK)
					return
				}
				next.ServeHTTP(w, r)
			})
		})
	}

	// Health check endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"healthy"}`))
	})

	// Initialize dependencies
	authService, _, err := app.initDependencies()
	if err != nil {
		return nil, err
	}

	// Cookie Manager with config from app
	cookieManager := utils.NewCookieManager(utils.CookieConfig{
		Domain: app.config.AuthConfig.CookieDomain,
		Secret: string(app.config.AuthConfig.CookieSecret),
		Secure: app.config.AuthConfig.CookieSecure,
	})

	// Initialize controllers
	authCtrl := controllers.NewAuthController(authService, app.config.AuthConfig, cookieManager, app.logger)
	docsCtrl := controllers.NewDocsController()

	// Mount routes
	authCtrl.RegisterRoutes(r)
	docsCtrl.Routes(r)

	return r, nil
}

func (app *Application) run() error {
	handler, err := app.mount()
	if err != nil {
		return fmt.Errorf("failed to mount routes: %w", err)
	}

	app.server = &http.Server{
		Addr:         app.config.Addr,
		Handler:      handler,
		WriteTimeout: 30 * time.Second,
		ReadTimeout:  10 * time.Second,
		IdleTimeout:  time.Minute,
	}

	app.logger.Info("starting server",
		"addr", app.config.Addr,
		"env", app.config.Env,
		"service", app.config.ServiceName,
		"version", app.config.ServiceVersion,
	)

	errCh := make(chan error, 1)

	// Start server in goroutine
	go func() {
		if err := app.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			errCh <- err
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-errCh:
		return err
	case sig := <-quit:
		app.logger.Info("shutdown signal received", "signal", sig)
	}

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	app.logger.Info("shutting down server...")
	return app.server.Shutdown(ctx)
}
