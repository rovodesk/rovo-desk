package config

import (
	"time"
)

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
	Cognito        CognitoConfig
	AuthConfig     AuthConfig
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
	Password   string
	DB         int
	Prefix     string
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

type CognitoConfig struct {
	Region        string
	ClientID      string
	ClientSecret  string
	CallbackURL   string
	CognitoDomain string
}

type AuthConfig struct {
	SignupSessionTTL  time.Duration
	LoginSessionTTL   time.Duration
	SessionTTL        time.Duration
	SessionCookieName string
	CookieSecret      []byte
}

func Load() AppConfig {
	return AppConfig{
		Env:            Env(getEnv("APP_ENV", string(EnvDev))),
		ServiceName:    getEnv("SERVICE_NAME", "user-service"),
		ServiceVersion: getEnv("SERVICE_VERSION", "v1"),
		Addr:           getEnv("ADDR", ":5001"),

		Cognito: CognitoConfig{
			Region:        getEnv("COGNITO_REGION", "ap-south-1"),
			ClientID:      mustEnv("COGNITO_CLIENT_ID"),
			ClientSecret:  mustEnv("COGNITO_CLIENT_SECRET"),
			CallbackURL:   getEnv("COGNITO_CALLBACK_URL", "http://localhost:5001/auth/callback"),
			CognitoDomain: mustEnv("COGNITO_DOMAIN"),
		},

		Cache: CacheConfig{
			Addr:       getEnv("REDIS_ADDR", "localhost:6379"),
			DefaultTTL: getEnvDuration("REDIS_TTL", 24*time.Hour),
			Password:   getEnv("REDIS_PASSWORD", ""),
			DB:         getEnvInt("REDIS_DB", 0),
			Prefix:     getEnv("REDIS_PREFIX", "auth-service"),
		},

		AuthConfig: AuthConfig{
			SignupSessionTTL:  getEnvDuration("SIGNUP_SESSION_TTL", 10*time.Minute),
			LoginSessionTTL:   getEnvDuration("LOGIN_SESSION_TTL", 10*time.Minute),
			SessionTTL:        getEnvDuration("SESSION_TTL", 24*time.Hour),
			SessionCookieName: getEnv("SESSION_COOKIE_NAME", "__session"),
			CookieSecret:      []byte(mustEnv("COOKIE_SECRET")),
		},

		Observability: ObservabilityConfig{
			LogLevel:       LogLevel(getEnv("LOG_LEVEL", string(LogLevelInfo))),
			TracingEnabled: getEnv("TRACING_ENABLED", "false") == "true",
			OTELCollector:  getEnv("OTEL_COLLECTOR", "localhost:4317"),
		},
	}
}
