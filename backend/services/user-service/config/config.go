package config

import "time"

type Env string

const (
	EnvDev     Env = "development"
	EnvProd    Env = "production"
	EnvStaging Env = "staging"
)

type AppConfig struct {
	Env            Env
	ServiceName    string
	ServiceVersion string
	Addr           string
	DB             DBConfig
	Cache          CacheConfig
	Observability  ObservabilityConfig
}

type DBConfig struct {
	DSN         string
	AutoMigrate bool
}

type CacheConfig struct {
	Addr       string
	DefaultTTL time.Duration
}

type LogLevel string

const (
	LogLevelInfo  LogLevel = "info"
	LogLevelDebug LogLevel = "debug"
	LogLevelError LogLevel = "error"
	LogLevelWarn  LogLevel = "warn"
	LogLevelFatal LogLevel = "fatal"
)

type ObservabilityConfig struct {
	LogLevel       LogLevel
	TracingEnabled bool
	OTELCollector  string
}

func Load() AppConfig {
	return AppConfig{
		Env:            EnvDev,
		ServiceName:    "user-service",
		ServiceVersion: "v1",
		Addr:           ":5001",
		DB: DBConfig{
			DSN:         "postgresql://neondb_owner:npg_0IwrSnhuUe9Z@ep-mute-lab-am8ktzpm.c-5.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require",
			AutoMigrate: true,
		},
		Cache: CacheConfig{
			Addr:       "",
			DefaultTTL: time.Hour * 24, // 1 Day
		},
		Observability: ObservabilityConfig{
			LogLevel:       LogLevelInfo,
			TracingEnabled: false,
			OTELCollector:  "localhost:4317",
		},
	}
}
