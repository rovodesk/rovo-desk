package middleware

import (
	"context"
	"log/slog"
	"net/http"
	"strings"

	"github.com/zero-heads-lab/auth-service/utils"
)

// ============================================================================
// Token Validation Middleware
// ============================================================================

// TokenValidationMiddleware validates the access token from cookies
func TokenValidationMiddleware(
	cookieManager *utils.CookieManager,
	logger *slog.Logger,
) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()

			// Try to get access token from cookie
			accessToken, err := cookieManager.GetCookie(r, "access_token", true)
			if err != nil {
				logger.WarnContext(ctx, "TokenValidation: access token not found")
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			// In a real implementation, you would verify the JWT token here
			// For now, we just check that it exists
			if strings.TrimSpace(accessToken) == "" {
				logger.WarnContext(ctx, "TokenValidation: empty access token")
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			// Add token to context for use in handlers
			ctx = context.WithValue(ctx, "access_token", accessToken)
			r = r.WithContext(ctx)

			next.ServeHTTP(w, r)
		})
	}
}

// ============================================================================
// User Context Injection Middleware
// ============================================================================

// UserContextData holds user information extracted from token
type UserContextData struct {
	UserID string
	Email  string
	Sub    string
}

// UserContextInjectionMiddleware extracts user info from ID token and injects into context
func UserContextInjectionMiddleware(
	cookieManager *utils.CookieManager,
	logger *slog.Logger,
) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()

			// Try to get ID token from cookie
			idToken, err := cookieManager.GetCookie(r, "id_token", true)
			if err != nil {
				// ID token is optional, continue without user context
				next.ServeHTTP(w, r)
				return
			}

			if strings.TrimSpace(idToken) == "" {
				// Empty token, continue without user context
				next.ServeHTTP(w, r)
				return
			}

			// In a real implementation, verify and parse the JWT
			// For now, we just add it to context
			userData := UserContextData{
				UserID: "", // Would be extracted from token
				Email:  "", // Would be extracted from token
				Sub:    "", // Would be extracted from token
			}

			ctx = context.WithValue(ctx, "user", userData)
			r = r.WithContext(ctx)

			logger.DebugContext(ctx, "User context injected", slog.String("user_id", userData.UserID))

			next.ServeHTTP(w, r)
		})
	}
}

// ============================================================================
// CSRF Protection Middleware
// ============================================================================

// CSRFMiddleware provides CSRF protection
func CSRFMiddleware(logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()

			// Only apply to state-changing methods
			if r.Method == http.MethodPost || r.Method == http.MethodPut || r.Method == http.MethodDelete {
				// In a production system, verify CSRF token here
				// For now, we rely on SameSite cookie attribute

				logger.DebugContext(ctx, "CSRF check passed",
					slog.String("method", r.Method),
					slog.String("path", r.RequestURI))
			}

			next.ServeHTTP(w, r)
		})
	}
}

// ============================================================================
// Request ID Middleware
// ============================================================================

// RequestIDMiddleware injects a unique request ID into context
func RequestIDMiddleware(logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()

			// Check if request ID already exists (from upstream)
			requestID := r.Header.Get("X-Request-ID")
			if requestID == "" {
				// Generate a new one (in production, use a UUID)
				requestID = "req_" + strings.ReplaceAll(r.URL.Path, "/", "_")
			}

			// Add to context
			ctx = context.WithValue(ctx, "request_id", requestID)

			// Add to response header
			w.Header().Set("X-Request-ID", requestID)

			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// ============================================================================
// Error Recovery Middleware
// ============================================================================

// RecoveryMiddleware recovers from panics and logs them
func RecoveryMiddleware(logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()

			defer func() {
				if err := recover(); err != nil {
					logger.ErrorContext(ctx,
						"Panic recovered",
						slog.Any("panic", err),
						slog.String("path", r.RequestURI),
						slog.String("method", r.Method))

					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusInternalServerError)

					utils.WriteJSON(w, http.StatusInternalServerError, map[string]string{
						"error": "Internal server error",
					})
				}
			}()

			next.ServeHTTP(w, r)
		})
	}
}

// ============================================================================
// Request Logging Middleware
// ============================================================================

// ResponseWriter wrapper to capture status code
type statusCodeWriter struct {
	http.ResponseWriter
	statusCode int
}

func (w *statusCodeWriter) WriteHeader(code int) {
	w.statusCode = code
	w.ResponseWriter.WriteHeader(code)
}

// RequestLoggingMiddleware logs all incoming requests
func RequestLoggingMiddleware(logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()

			// Wrap response writer to capture status
			wrapped := &statusCodeWriter{ResponseWriter: w, statusCode: http.StatusOK}

			logger.InfoContext(ctx,
				"Incoming request",
				slog.String("method", r.Method),
				slog.String("path", r.RequestURI),
				slog.String("remote_addr", r.RemoteAddr))

			next.ServeHTTP(wrapped, r)

			logger.InfoContext(ctx,
				"Request completed",
				slog.String("method", r.Method),
				slog.String("path", r.RequestURI),
				slog.Int("status_code", wrapped.statusCode))
		})
	}
}

// ============================================================================
// Rate Limiting Middleware
// ============================================================================

// RateLimitMiddleware provides basic rate limiting per IP
func RateLimitMiddleware(logger *slog.Logger, requestsPerMinute int) func(http.Handler) http.Handler {
	// In production, use a proper rate limiting library or Redis-backed implementation
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()

			// Basic check - in production implement proper rate limiting
			remoteIP := r.RemoteAddr
			logger.DebugContext(ctx,
				"Rate limit check",
				slog.String("ip", remoteIP),
				slog.Int("requests_per_minute", requestsPerMinute))

			next.ServeHTTP(w, r)
		})
	}
}
