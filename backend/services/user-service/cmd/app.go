package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"

	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/trust-none/user-service/config"
	"github.com/trust-none/user-service/controllers"
	"github.com/trust-none/user-service/data"
	"github.com/trust-none/user-service/user"
	"go.opentelemetry.io/otel"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Application struct {
	config config.AppConfig
	logger *slog.Logger
	db     *gorm.DB
	server *http.Server
}

func (app *Application) initDependencies() user.Service {
	// Init Gorm
	db, err := gorm.Open(postgres.Open(app.config.DB.DSN), &gorm.Config{})
	if err != nil {
		app.logger.Error("failed to connect database", "error", err)
		panic(err)
	}

	// DB pool tuning
	sqlDB, err := db.DB()
	if err != nil {
		panic(err)
	}
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// RUN MIGRATIONS BEFORE USING DB
	if app.config.DB.AutoMigrate {
		wd, _ := os.Getwd()
		migrationsPath := filepath.Join(wd, "../../migrations")
		if err := data.RunMigrations(sqlDB, migrationsPath); err != nil {
			app.logger.Error("migration failed", "error", err)
			panic(err)
		}
	}

	// Set Db
	app.db = db
	// Set Tracer
	tracer := otel.Tracer(app.config.ServiceName)
	// Set Repository
	repo := data.NewUserRepository(db, tracer, app.logger)

	svc := user.NewUserService(repo, tracer, app.logger)
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
	userCtrl := controllers.NewUserController(svc)
	docsCtrl := controllers.NewDocsController()

	// mount routes
	userCtrl.FrontendRoutes(r)
	userCtrl.BackendRoutes(r)
	userCtrl.PlatformRoutes(r)
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
