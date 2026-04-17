package cookieManager

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"
)

// CookieManager handles all cookie operations with secure defaults
type CookieManager struct {
	secret []byte
	domain string
	secure bool
}

// CookieConfig holds cookie configuration
type CookieConfig struct {
	Secret string
	Domain string
	Secure bool
}

// NewCookieManager creates a new cookie manager instance
func NewCookieManager(config CookieConfig) *CookieManager {
	return &CookieManager{
		secret: []byte(config.Secret),
		domain: config.Domain,
		secure: config.Secure,
	}
}

// CookieOptions defines cookie settings
type CookieOptions struct {
	MaxAge   int
	Path     string
	Secure   bool
	SameSite http.SameSite
	Sign     bool // Whether to sign the cookie
}

// DefaultCookieOptions returns secure defaults for auth cookies
func DefaultCookieOptions(ttl time.Duration) CookieOptions {
	return CookieOptions{
		MaxAge:   int(ttl.Seconds()),
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Sign:     true,
	}
}

// SessionOnlyCookieOptions returns secure defaults for session-only cookies (no MaxAge)
func SessionOnlyCookieOptions() CookieOptions {
	return CookieOptions{
		MaxAge:   0, // Session cookie
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Sign:     true,
	}
}

// RefreshTokenCookieOptions returns secure defaults for refresh token cookies
func RefreshTokenCookieOptions(ttl time.Duration) CookieOptions {
	return CookieOptions{
		MaxAge:   int(ttl.Seconds()),
		Path:     "/auth/refresh", // Scoped to refresh endpoint only
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Sign:     true,
	}
}

// signValue signs a value using HMAC-SHA256
func (cm *CookieManager) signValue(value string) string {
	h := hmac.New(sha256.New, cm.secret)
	h.Write([]byte(value))
	signature := hex.EncodeToString(h.Sum(nil))
	return fmt.Sprintf("%s.%s", value, signature)
}

// verifyValue verifies a signed value
func (cm *CookieManager) verifyValue(signedValue string) (string, error) {
	// Split value and signature
	var value, signature string
	_, err := fmt.Sscanf(signedValue, "%[^.].%s", &value, &signature)
	if err != nil {
		return "", fmt.Errorf("invalid signed value format: %w", err)
	}

	// Verify signature
	h := hmac.New(sha256.New, cm.secret)
	h.Write([]byte(value))
	expectedSignature := hex.EncodeToString(h.Sum(nil))

	if !hmac.Equal([]byte(signature), []byte(expectedSignature)) {
		return "", fmt.Errorf("signature verification failed")
	}

	return value, nil
}

// SetCookie sets a secure cookie with optional signing
func (cm *CookieManager) SetCookie(w http.ResponseWriter, name, value string, opts CookieOptions) error {
	cookieValue := value
	if opts.Sign {
		cookieValue = cm.signValue(value)
	}

	cookie := &http.Cookie{
		Name:     name,
		Value:    cookieValue,
		Path:     opts.Path,
		HttpOnly: true,
		Secure:   opts.Secure && cm.secure,
		SameSite: opts.SameSite,
		MaxAge:   opts.MaxAge,
	}

	if cm.domain != "" {
		cookie.Domain = cm.domain
	}

	http.SetCookie(w, cookie)
	return nil
}

// GetCookie retrieves and verifies a signed cookie
func (cm *CookieManager) GetCookie(r *http.Request, name string, signed bool) (string, error) {
	cookie, err := r.Cookie(name)
	if err != nil {
		return "", fmt.Errorf("cookie not found: %w", err)
	}

	if !signed {
		return cookie.Value, nil
	}

	// Verify signature if required
	value, err := cm.verifyValue(cookie.Value)
	if err != nil {
		return "", fmt.Errorf("cookie verification failed: %w", err)
	}

	return value, nil
}

// ClearCookie removes a cookie by setting MaxAge to -1
func (cm *CookieManager) ClearCookie(w http.ResponseWriter, name, path string) {
	cookie := &http.Cookie{
		Name:     name,
		Value:    "",
		Path:     path,
		HttpOnly: true,
		Secure:   cm.secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
	}

	if cm.domain != "" {
		cookie.Domain = cm.domain
	}

	http.SetCookie(w, cookie)
}

// AuthSessionCookie manages the temporary auth session cookie (stores Cognito session ID)
func (cm *CookieManager) SetAuthSession(w http.ResponseWriter, sessionID string, ttl time.Duration) error {
	opts := DefaultCookieOptions(ttl)
	opts.Path = "/auth" // Scoped to auth endpoints
	return cm.SetCookie(w, "auth_session", sessionID, opts)
}

// GetAuthSession retrieves the auth session cookie
func (cm *CookieManager) GetAuthSession(r *http.Request) (string, error) {
	return cm.GetCookie(r, "auth_session", true)
}

// ClearAuthSession removes the auth session cookie
func (cm *CookieManager) ClearAuthSession(w http.ResponseWriter) {
	cm.ClearCookie(w, "auth_session", "/auth")
}

// TokenCookies holds all token-related cookies
type TokenCookies struct {
	AccessToken  string
	IDToken      string
	RefreshToken string
}

// SetTokens stores access, ID, and refresh tokens in secure cookies
func (cm *CookieManager) SetTokens(w http.ResponseWriter, tokens TokenCookies) error {
	// Access token: short TTL, HttpOnly, Secure
	opts := DefaultCookieOptions(15 * time.Minute)
	if err := cm.SetCookie(w, "access_token", tokens.AccessToken, opts); err != nil {
		return fmt.Errorf("failed to set access_token: %w", err)
	}

	// ID token: short TTL, HttpOnly, Secure
	if err := cm.SetCookie(w, "id_token", tokens.IDToken, opts); err != nil {
		return fmt.Errorf("failed to set id_token: %w", err)
	}

	// Refresh token: long TTL, HttpOnly, Secure, scoped to /auth/refresh
	refreshOpts := RefreshTokenCookieOptions(7 * 24 * time.Hour)
	if err := cm.SetCookie(w, "refresh_token", tokens.RefreshToken, refreshOpts); err != nil {
		return fmt.Errorf("failed to set refresh_token: %w", err)
	}

	return nil
}

// GetAccessToken retrieves the access token from cookies
func (cm *CookieManager) GetAccessToken(r *http.Request) (string, error) {
	return cm.GetCookie(r, "access_token", true)
}

// GetRefreshToken retrieves the refresh token from cookies
func (cm *CookieManager) GetRefreshToken(r *http.Request) (string, error) {
	return cm.GetCookie(r, "refresh_token", true)
}

// GetIDToken retrieves the ID token from cookies
func (cm *CookieManager) GetIDToken(r *http.Request) (string, error) {
	return cm.GetCookie(r, "id_token", true)
}

// ClearTokens removes all token cookies
func (cm *CookieManager) ClearTokens(w http.ResponseWriter) {
	cm.ClearCookie(w, "access_token", "/")
	cm.ClearCookie(w, "id_token", "/")
	cm.ClearCookie(w, "refresh_token", "/auth/refresh")
}

// ClearAllAuth clears all auth-related cookies
func (cm *CookieManager) ClearAllAuth(w http.ResponseWriter) {
	cm.ClearAuthSession(w)
	cm.ClearTokens(w)
}

// HasValidTokens checks if both access and refresh tokens are present
func (cm *CookieManager) HasValidTokens(r *http.Request) bool {
	_, accessErr := cm.GetAccessToken(r)
	_, refreshErr := cm.GetRefreshToken(r)
	return accessErr == nil && refreshErr == nil
}
