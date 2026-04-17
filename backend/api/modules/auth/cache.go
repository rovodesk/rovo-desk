package auth

import (
	"time"

	"encore.dev/beta/auth"
	"encore.dev/storage/cache"
)

type AuthSession struct {
	SessionID    string            `json:"session_id"`
	UserID       auth.UID          `json:"user_id"`
	Claims       map[string]string `json:"claims"`
	RefreshToken string            `json:"refresh_token"`
	ExpiresAt    uint64            `json:"expires_at"`
}

type EmailKey struct {
	Email string `json:"email"`
}

type SessionKey struct {
	SessionID string `json:"session_id"`
}

type OAuthStateKey struct {
	State string `json:"state"`
}

var authCache = cache.NewCluster("auth-cache", cache.ClusterConfig{
	EvictionPolicy: cache.AllKeysLRU,
})
var otpAttempts = cache.NewIntKeyspace[EmailKey](authCache, cache.KeyspaceConfig{
	KeyPattern:    "auth/otp-attempts/:Email",
	DefaultExpiry: cache.ExpireIn(15 * time.Minute),
})

var otpResendLimit = cache.NewIntKeyspace[EmailKey](authCache, cache.KeyspaceConfig{
	KeyPattern:    "auth/otp-resend/:Email",
	DefaultExpiry: cache.ExpireIn(10 * time.Minute),
})

var loginAttempts = cache.NewIntKeyspace[EmailKey](authCache, cache.KeyspaceConfig{
	KeyPattern:    "auth/login-attempts/:Email",
	DefaultExpiry: cache.ExpireIn(15 * time.Minute),
})

var oauthState = cache.NewStringKeyspace[OAuthStateKey](authCache, cache.KeyspaceConfig{
	KeyPattern:    "auth/oauth-state/:State",
	DefaultExpiry: cache.ExpireIn(10 * time.Minute),
})

var authSession = cache.NewStructKeyspace[SessionKey, AuthSession](authCache, cache.KeyspaceConfig{
	KeyPattern:    "auth/session/:SessionID",
	DefaultExpiry: cache.ExpireIn(5 * 24 * time.Hour),
})
