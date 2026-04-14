package config

import (
	"net/http"
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
	RateLimit      RateLimitConfig
	CORS           CORSConfig
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
	Region       string
	ClientID     string
	ClientSecret string
	CallbackURL  string
	UserPoolId   string
}

type AuthConfig struct {
	SignupSessionTTL      time.Duration
	LoginSessionTTL       time.Duration
	SessionTTL            time.Duration
	SessionCookieName     string
	CookieSecret          []byte
	CookieDomain          string
	CookiePath            string
	CookieMaxAge          int
	CookieSecure          bool
	CookieHttpOnly        bool
	CookieSameSite        http.SameSite
	OTPRateLimitAttempts  int
	OTPRateLimitWindow    time.Duration
	ResendRateLimitWindow time.Duration
}

type RateLimitConfig struct {
	Enabled       bool
	Requests      int
	WindowSeconds int
}

type CORSConfig struct {
	Enabled        bool
	AllowedOrigins []string
	AllowedMethods []string
	AllowedHeaders []string
	MaxAge         int
}

func Load() AppConfig {
	return AppConfig{
		Env:            Env(getEnv("SERVER_ENV", string(EnvDev))),
		ServiceName:    getEnv("SERVICE_NAME", "auth-service"),
		ServiceVersion: getEnv("SERVICE_VERSION", "v1"),
		Addr:           getEnv("SERVER_HOST", "0.0.0.0") + ":" + getEnv("SERVER_PORT", "8080"),

		Cognito: CognitoConfig{
			Region:       getEnv("COGNITO_REGION", "us-east-1"),
			ClientID:     getEnv("COGNITO_CLIENT_ID", ""),
			ClientSecret: getEnv("COGNITO_CLIENT_SECRET", ""),
			CallbackURL:  getEnv("COGNITO_REDIRECT_URI", "http://localhost:8080/auth/callback"),
			UserPoolId:   getEnv("COGNITO_USER_POOL_ID", ""),
		},

		Cache: CacheConfig{
			Addr:       getEnv("REDIS_ADDR", "localhost:6379"),
			DefaultTTL: getEnvDuration("REDIS_TTL", 24*time.Hour),
			Password:   getEnv("REDIS_PASSWORD", ""),
			DB:         getEnvInt("REDIS_DB", 0),
			Prefix:     getEnv("REDIS_PREFIX", "auth-service"),
		},

		AuthConfig: AuthConfig{
			SignupSessionTTL:      getEnvDuration("SIGNUP_SESSION_TTL", 10*time.Minute),
			LoginSessionTTL:       getEnvDuration("LOGIN_SESSION_TTL", 10*time.Minute),
			SessionTTL:            getEnvDuration("SESSION_TTL", 24*time.Hour),
			SessionCookieName:     getEnv("SESSION_COOKIE_NAME", "__session"),
			CookieSecret:          []byte(getEnv("COOKIE_SECRET", "dev-secret-key-change-in-production")),
			CookieDomain:          getEnv("COOKIE_DOMAIN", ".localhost"),
			CookiePath:            getEnv("COOKIE_PATH", "/"),
			CookieMaxAge:          getEnvInt("COOKIE_MAX_AGE", 604800), // 7 days
			CookieSecure:          getEnvBool("COOKIE_SECURE", false),
			CookieHttpOnly:        getEnvBool("COOKIE_HTTP_ONLY", true),
			CookieSameSite:        http.SameSiteLaxMode,
			OTPRateLimitAttempts:  getEnvInt("OTP_RATE_LIMIT_ATTEMPTS", 5),
			OTPRateLimitWindow:    getEnvDuration("OTP_RATE_LIMIT_WINDOW_MINUTES", 5*time.Minute),
			ResendRateLimitWindow: getEnvDuration("RESEND_RATE_LIMIT_WINDOW_MINUTES", 1*time.Minute),
		},

		RateLimit: RateLimitConfig{
			Enabled:       getEnvBool("RATE_LIMIT_ENABLED", true),
			Requests:      getEnvInt("RATE_LIMIT_REQUESTS", 100),
			WindowSeconds: getEnvInt("RATE_LIMIT_WINDOW_SECONDS", 60),
		},

		CORS: CORSConfig{
			Enabled:        getEnvBool("CORS_ENABLED", true),
			AllowedOrigins: parseStringList(getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000")),
			AllowedMethods: parseStringList(getEnv("CORS_ALLOWED_METHODS", "GET,POST,PUT,DELETE,OPTIONS")),
			AllowedHeaders: parseStringList(getEnv("CORS_ALLOWED_HEADERS", "Content-Type,Authorization")),
			MaxAge:         getEnvInt("CORS_MAX_AGE", 3600),
		},

		Observability: ObservabilityConfig{
			LogLevel:       LogLevel(getEnv("LOG_LEVEL", string(LogLevelInfo))),
			TracingEnabled: getEnv("TRACING_ENABLED", "false") == "true",
			OTELCollector:  getEnv("OTEL_COLLECTOR", "localhost:4317"),
		},
	}
}
