package auth

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/zero-heads-lab/auth-service/auth/cognito"
	"github.com/zero-heads-lab/auth-service/auth/jwt"
	"github.com/zero-heads-lab/auth-service/cache"
	"github.com/zero-heads-lab/auth-service/config"
	"go.opentelemetry.io/otel/trace"
)

const (
	// Cache key prefixes
	SignupSessionKey     = "signup:session"
	LoginSessionKey      = "login:session"
	SessionKey           = "session"
	OTPRateLimitKey      = "ratelimit:otp"
	OTPAttemptsKey       = "attempts:otp"
	ResendRateLimitKey   = "ratelimit:resend"
	SessionValidationKey = "session:validation"

	// Rate limiting constants
	MaxOTPAttempts        = 5
	OTPRateLimitWindow    = 5 * time.Minute
	ResendRateLimitWindow = 1 * time.Minute
	SessionValidationTTL  = 5 * time.Minute

	// Email validation regex
	emailRegex = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
)

type Service interface {
	GetSession(ctx context.Context, userID string) (any, error)

	Register(ctx context.Context, email string, firstName, lastName *string) (RegisterOutput, error)
	Confirm(ctx context.Context, email, code string) (*string, error)
	ResendConfirmationCode(ctx context.Context, email string) error

	SendEmailVerificationCode(ctx context.Context, email, accessToken string) error
	VerifyEmail(ctx context.Context, email, code, accessToken string) error

	GetSocialLoginURL(ctx context.Context, provider string) (string, string, error)
	HandleLoginCallback(ctx context.Context, provider string, code, codeVerifier string) (*SessionResult, error)
	GetLogoutURL(ctx context.Context) (string, error)
	HandleLogoutCallback(ctx context.Context) error

	StartEmailOTPLogin(ctx context.Context, email string) (string, error)
	VerifyEmailOTP(ctx context.Context, email string, otp string) (TokenResult, error)
	RefreshAccessToken(ctx context.Context, refreshToken string) (TokenResult, error)
}

type authService struct {
	tracer  trace.Tracer
	logger  *slog.Logger
	cognito cognito.Service
	config  config.AppConfig
	cache   cache.Store
}

// TokenResult represents successful authentication tokens
type TokenResult struct {
	AccessToken  string
	IDToken      string
	RefreshToken *string
	ExpiresIn    int
	TokenType    string
}

func NewAuthService(
	tracer trace.Tracer,
	logger *slog.Logger,
	cognitoSvc cognito.Service,
	config config.AppConfig,
	cache cache.Store,
) Service {
	return &authService{
		tracer:  tracer,
		logger:  logger,
		cognito: cognitoSvc,
		config:  config,
		cache:   cache,
	}
}

// ============================================================================
// Helper Methods
// ============================================================================

// validateEmail validates email format
func (s *authService) validateEmail(email string) *AuthError {
	email = strings.TrimSpace(email)
	if email == "" {
		return ErrInvalidEmail.WithDetail("reason", "email is required")
	}

	re := regexp.MustCompile(emailRegex)
	if !re.MatchString(email) {
		return ErrInvalidEmail.WithDetail("reason", "invalid email format")
	}
	return nil
}

// checkOTPRateLimit checks if user has exceeded OTP attempt limit
func (s *authService) checkOTPRateLimit(ctx context.Context, email string) *AuthError {
	key := OTPAttemptsKey + ":" + email
	var attempts int

	err := s.cache.Get(ctx, key, &attempts)
	if err == nil && attempts >= MaxOTPAttempts {
		s.logger.WarnContext(ctx, "OTP rate limit exceeded",
			slog.String("email", email),
			slog.Int("attempts", attempts))
		return ErrTooManyOTPAttempts.WithDetail("attempts", attempts)
	}
	return nil
}

// incrementOTPAttempts increments OTP attempt counter
func (s *authService) incrementOTPAttempts(ctx context.Context, email string) error {
	key := OTPAttemptsKey + ":" + email
	var attempts int
	_ = s.cache.Get(ctx, key, &attempts) // Ignore error if not found

	attempts++
	return s.cache.Set(ctx, key, attempts, OTPRateLimitWindow)
}

// clearOTPAttempts clears OTP attempt counter on successful verification
func (s *authService) clearOTPAttempts(ctx context.Context, email string) error {
	key := OTPAttemptsKey + ":" + email
	return s.cache.Delete(ctx, key)
}

// checkResendRateLimit checks if user can request a new OTP
func (s *authService) checkResendRateLimit(ctx context.Context, email string) *AuthError {
	key := ResendRateLimitKey + ":" + email
	if exists, err := s.cache.Exists(ctx, key); err == nil && exists {
		s.logger.WarnContext(ctx, "Resend rate limited",
			slog.String("email", email))
		return ErrTooManyOTPAttempts.WithDetail("reason", "please wait before requesting another code")
	}
	return nil
}

// setResendRateLimit sets a rate limit for OTP resend
func (s *authService) setResendRateLimit(ctx context.Context, email string) error {
	key := ResendRateLimitKey + ":" + email
	return s.cache.Set(ctx, key, true, ResendRateLimitWindow)
}

// extractCognitoErrorInfo extracts error code and message from Cognito error
func (s *authService) extractCognitoErrorInfo(err error) (code, message string) {
	if err == nil {
		return "UNKNOWN", "Unknown error"
	}

	errStr := err.Error()
	// Cognito errors typically have format: "operation failed: ErrorCode: message"
	code = "COGNITO_ERROR"
	message = errStr

	return code, message
}

// ============================================================================
// Email OTP Authentication Methods
// ============================================================================

// StartEmailOTPLogin initiates email-based OTP authentication
func (s *authService) StartEmailOTPLogin(ctx context.Context, email string) (string, error) {
	// Validate email format
	if err := s.validateEmail(email); err != nil {
		s.logger.InfoContext(ctx, "Invalid email format", slog.String("email", email))
		return "", err
	}

	// Initiate OTP flow with Cognito
	s.logger.InfoContext(ctx, "Starting email OTP login", slog.String("email", email))
	res, err := s.cognito.InitiateEmailOTPAuth(ctx, email)
	if err != nil {
		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)
		s.logger.ErrorContext(ctx, "Cognito InitiateAuth failed",
			slog.String("email", email),
			slog.String("error", err.Error()))
		return "", cognitoErr
	}

	// Validate response
	if res.Session == nil {
		s.logger.ErrorContext(ctx, "Cognito returned empty session",
			slog.String("email", email))
		return "", ErrMissingAuthSession
	}

	// Cache session for OTP verification
	sessionKey := LoginSessionKey + ":" + email
	if err := s.cache.Set(
		ctx,
		sessionKey,
		*res.Session,
		s.config.AuthConfig.LoginSessionTTL,
	); err != nil {
		s.logger.ErrorContext(ctx, "Failed to cache login session",
			slog.String("email", email),
			slog.String("error", err.Error()))
		return "", NewAuthError("CACHE_ERROR", "Failed to save session", http.StatusInternalServerError)
	}

	s.logger.InfoContext(ctx, "Email OTP login session created",
		slog.String("email", email),
		slog.String("challenge", fmt.Sprintf("%v", res.ChallengeName)))

	return *res.Session, nil
}

// VerifyEmailOTP verifies the OTP and returns authentication tokens
func (s *authService) VerifyEmailOTP(ctx context.Context, email string, otp string) (TokenResult, error) {
	// Validate email
	if err := s.validateEmail(email); err != nil {
		return TokenResult{}, err
	}

	// Trim and validate OTP
	otp = strings.TrimSpace(otp)
	if len(otp) == 0 {
		return TokenResult{}, ErrInvalidOTP.WithDetail("reason", "OTP is required")
	}

	// Check rate limit
	if err := s.checkOTPRateLimit(ctx, email); err != nil {
		return TokenResult{}, err
	}

	// Retrieve cached session
	sessionKey := LoginSessionKey + ":" + email
	var session string
	if err := s.cache.Get(ctx, sessionKey, &session); err != nil {
		s.logger.WarnContext(ctx, "Session not found for OTP verification",
			slog.String("email", email))
		return TokenResult{}, ErrMissingAuthSession
	}

	s.logger.InfoContext(ctx, "Verifying email OTP", slog.String("email", email))

	// Respond to OTP challenge
	res, err := s.cognito.RespondToEmailOTPChallenge(ctx, email, otp, session)
	if err != nil {
		// Increment attempt counter on failure
		_ = s.incrementOTPAttempts(ctx, email)

		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)
		s.logger.WarnContext(ctx, "OTP verification failed",
			slog.String("email", email),
			slog.String("error", err.Error()))
		return TokenResult{}, cognitoErr
	}

	// Validate authentication result
	if res.AuthenticationResult == nil {
		s.logger.ErrorContext(ctx, "Cognito returned empty authentication result",
			slog.String("email", email))
		return TokenResult{}, NewAuthError("AUTH_ERROR", "Authentication failed", http.StatusInternalServerError)
	}

	// Verify ID token
	if res.AuthenticationResult.IdToken == nil {
		s.logger.ErrorContext(ctx, "Cognito returned empty ID token",
			slog.String("email", email))
		return TokenResult{}, NewAuthError("TOKEN_ERROR", "Token verification failed", http.StatusInternalServerError)
	}

	idToken := *res.AuthenticationResult.IdToken
	claims, err := jwt.VerifyJWTToken(
		idToken,
		s.cognito.JWKSURL(),
		s.config.Cognito.ClientID,
		s.cognito.Domain(),
	)
	if err != nil {
		s.logger.ErrorContext(ctx, "JWT token verification failed",
			slog.String("email", email),
			slog.String("error", err.Error()))
		return TokenResult{}, ErrInvalidToken.WithDetail("reason", "token verification failed")
	}

	s.logger.InfoContext(ctx, "JWT token verified successfully",
		slog.String("email", email),
		slog.Any("claims", claims))

	// Clear OTP attempts and session on success
	_ = s.clearOTPAttempts(ctx, email)
	_ = s.cache.Delete(ctx, sessionKey)

	// Build token result
	expiresIn := 3600 // Default to 1 hour
	if res.AuthenticationResult.ExpiresIn > 0 {
		expiresIn = int(res.AuthenticationResult.ExpiresIn)
	}

	tokenResult := TokenResult{
		AccessToken:  *res.AuthenticationResult.AccessToken,
		IDToken:      idToken,
		RefreshToken: res.AuthenticationResult.RefreshToken,
		ExpiresIn:    expiresIn,
		TokenType:    "Bearer",
	}

	s.logger.InfoContext(ctx, "Email OTP verification successful",
		slog.String("email", email),
		slog.Int("expires_in", expiresIn))

	return tokenResult, nil
}

// RefreshAccessToken refreshes the access token using refresh token
func (s *authService) RefreshAccessToken(ctx context.Context, refreshToken string) (TokenResult, error) {
	if strings.TrimSpace(refreshToken) == "" {
		return TokenResult{}, ErrRefreshTokenExpired.WithDetail("reason", "refresh token is required")
	}

	s.logger.InfoContext(ctx, "Attempting to refresh access token")

	// Call Cognito to refresh tokens
	res, err := s.cognito.RefreshAccessToken(ctx, refreshToken)
	if err != nil {
		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)
		s.logger.ErrorContext(ctx, "Token refresh failed",
			slog.String("error", err.Error()))
		return TokenResult{}, cognitoErr
	}

	if res.AuthenticationResult == nil || res.AuthenticationResult.AccessToken == nil {
		s.logger.ErrorContext(ctx, "Cognito returned empty authentication result on refresh")
		return TokenResult{}, NewAuthError("TOKEN_ERROR", "Token refresh failed", http.StatusInternalServerError)
	}

	expiresIn := 3600 // Default to 1 hour
	if res.AuthenticationResult.ExpiresIn > 0 {
		expiresIn = int(res.AuthenticationResult.ExpiresIn)
	}

	tokenResult := TokenResult{
		AccessToken:  *res.AuthenticationResult.AccessToken,
		IDToken:      "", // ID token not provided in refresh response
		RefreshToken: res.AuthenticationResult.RefreshToken,
		ExpiresIn:    expiresIn,
		TokenType:    "Bearer",
	}

	s.logger.InfoContext(ctx, "Access token refreshed successfully",
		slog.Int("expires_in", expiresIn))

	return tokenResult, nil
}

// ============================================================================
// Sign Up Methods
// ============================================================================

// Register creates a new user account
func (s *authService) Register(ctx context.Context, email string, firstName, lastName *string) (RegisterOutput, error) {
	// Validate email
	if err := s.validateEmail(email); err != nil {
		s.logger.InfoContext(ctx, "Invalid email format", slog.String("email", email))
		return RegisterOutput{}, err
	}

	s.logger.InfoContext(ctx, "Registering new user", slog.String("email", email))

	// Build attributes
	attrs := map[string]string{}
	if firstName != nil {
		attrs["given_name"] = *firstName
	}
	if lastName != nil {
		attrs["family_name"] = *lastName
	}

	// Call Cognito
	res, err := s.cognito.SignUp(ctx, email, attrs)
	if err != nil {
		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)
		s.logger.ErrorContext(ctx, "Cognito SignUp failed",
			slog.String("email", email),
			slog.String("error", err.Error()))
		return RegisterOutput{}, cognitoErr
	}

	// Cache session for confirmation step
	if res.Session != nil {
		sessionKey := SignupSessionKey + ":" + email
		if err := s.cache.Set(
			ctx,
			sessionKey,
			*res.Session,
			s.config.AuthConfig.SignupSessionTTL,
		); err != nil {
			s.logger.ErrorContext(ctx, "Failed to cache signup session",
				slog.String("email", email),
				slog.String("error", err.Error()))
			return RegisterOutput{}, NewAuthError("CACHE_ERROR", "Failed to save session", http.StatusInternalServerError)
		}
	}

	s.logger.InfoContext(ctx, "User registered successfully",
		slog.String("email", email),
		slog.String("user_sub", fmt.Sprintf("%v", res.UserSub)))

	return RegisterOutput{
		Verified: res.UserConfirmed,
		UserSub:  res.UserSub,
		Session:  res.Session,
	}, nil
}

// Confirm verifies the user's email during signup
func (s *authService) Confirm(ctx context.Context, email, code string) (*string, error) {
	// Validate email
	if err := s.validateEmail(email); err != nil {
		return nil, err
	}

	// Trim and validate code
	code = strings.TrimSpace(code)
	if len(code) == 0 {
		return nil, ErrInvalidOTP.WithDetail("reason", "confirmation code is required")
	}

	s.logger.InfoContext(ctx, "Confirming user email", slog.String("email", email))

	// Try to retrieve cached session (optional)
	sessionKey := SignupSessionKey + ":" + email
	var session string
	_ = s.cache.Get(ctx, sessionKey, &session)

	// Call Cognito
	res, err := s.cognito.ConfirmSignUp(ctx, email, code)
	if err != nil {
		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)
		s.logger.WarnContext(ctx, "Signup confirmation failed",
			slog.String("email", email),
			slog.String("error", err.Error()))
		return nil, cognitoErr
	}

	// Clear session cache
	_ = s.cache.Delete(ctx, sessionKey)

	s.logger.InfoContext(ctx, "User email confirmed successfully",
		slog.String("email", email))

	return res.Session, nil
}

// ResendConfirmationCode resends the confirmation code to the user's email
func (s *authService) ResendConfirmationCode(ctx context.Context, email string) error {
	// Validate email
	if err := s.validateEmail(email); err != nil {
		return err
	}

	// Check rate limit
	if err := s.checkResendRateLimit(ctx, email); err != nil {
		return err
	}

	s.logger.InfoContext(ctx, "Resending confirmation code", slog.String("email", email))

	// Call Cognito
	_, err := s.cognito.ResendConfirmationCode(ctx, email)
	if err != nil {
		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)
		s.logger.ErrorContext(ctx, "Resend confirmation failed",
			slog.String("email", email),
			slog.String("error", err.Error()))
		return cognitoErr
	}

	// Set rate limit
	_ = s.setResendRateLimit(ctx, email)

	s.logger.InfoContext(ctx, "Confirmation code sent successfully",
		slog.String("email", email))

	return nil
}

// ============================================================================
// Email Verification Methods
// ============================================================================

// SendEmailVerificationCode sends a verification code for email change
func (s *authService) SendEmailVerificationCode(ctx context.Context, email, accessToken string) error {
	if strings.TrimSpace(accessToken) == "" {
		return NewAuthError("MISSING_TOKEN", "Access token is required", http.StatusUnauthorized)
	}

	s.logger.InfoContext(ctx, "Sending email verification code", slog.String("email", email))

	_, err := s.cognito.SendEmailVerificationCode(ctx, accessToken, email)
	if err != nil {
		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)
		s.logger.ErrorContext(ctx, "Send email verification failed",
			slog.String("email", email),
			slog.String("error", err.Error()))
		return cognitoErr
	}

	s.logger.InfoContext(ctx, "Email verification code sent", slog.String("email", email))
	return nil
}

// VerifyEmail verifies the user's email change
func (s *authService) VerifyEmail(ctx context.Context, email, code, accessToken string) error {
	if strings.TrimSpace(accessToken) == "" {
		return NewAuthError("MISSING_TOKEN", "Access token is required", http.StatusUnauthorized)
	}

	code = strings.TrimSpace(code)
	if len(code) == 0 {
		return ErrInvalidOTP.WithDetail("reason", "verification code is required")
	}

	s.logger.InfoContext(ctx, "Verifying email", slog.String("email", email))

	_, err := s.cognito.VerifyEmail(ctx, accessToken, email, code)
	if err != nil {
		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)
		s.logger.ErrorContext(ctx, "Email verification failed",
			slog.String("email", email),
			slog.String("error", err.Error()))
		return cognitoErr
	}

	s.logger.InfoContext(ctx, "Email verified successfully",
		slog.String("email", email))

	return nil
}

// ============================================================================
// Social Login Methods
// ============================================================================

// GetSocialLoginURL returns the OAuth login URL for a given provider
func (s *authService) GetSocialLoginURL(ctx context.Context, provider string) (string, string, error) {
	s.logger.InfoContext(ctx, "Generating social login URL", slog.String("provider", provider))
	return s.cognito.GetOauthLoginURL(provider)
}

// HandleLoginCallback handles the OAuth callback
func (s *authService) HandleLoginCallback(
	ctx context.Context,
	provider string,
	code string,
	codeVerifier string,
) (*SessionResult, error) {
	s.logger.InfoContext(ctx, "Handling login callback", slog.String("provider", provider))

	tokens, err := s.cognito.ExchangeCodeForTokens(ctx, code, codeVerifier)
	if err != nil {
		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)
		s.logger.ErrorContext(ctx, "Token exchange failed",
			slog.String("provider", provider),
			slog.String("error", err.Error()))
		return nil, cognitoErr
	}

	// ⚠️ Minimal session (don't store raw tokens directly in prod)
	sessionData := map[string]any{
		"access_token": tokens.AccessToken,
		"id_token":     tokens.IDToken,
		"exp":          time.Now().Add(time.Duration(tokens.ExpiresIn) * time.Second).Unix(),
	}

	raw, _ := json.Marshal(sessionData)
	encoded := base64.StdEncoding.EncodeToString(raw)

	cookie := &http.Cookie{
		Name:     "session",
		Value:    encoded,
		HttpOnly: true,
		Secure:   true,
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(24 * time.Hour),
	}

	s.logger.InfoContext(ctx, "Login callback successful", slog.String("provider", provider))

	return &SessionResult{
		Cookie: cookie,
		User: map[string]string{
			"status": "logged_in",
		},
	}, nil
}

// GetSession retrieves session information for a user
func (s *authService) GetSession(ctx context.Context, userID string) (any, error) {
	s.logger.InfoContext(ctx, "Getting session", slog.String("user_id", userID))
	// In real system:
	// - decode cookie
	// - verify JWT
	// - fetch user

	return map[string]string{
		"user_id": userID,
	}, nil
}

// GetLogoutURL returns the logout URL
func (s *authService) GetLogoutURL(ctx context.Context) (string, error) {
	return s.cognito.Domain() + "/logout", nil
}

// HandleLogoutCallback handles the logout callback
func (s *authService) HandleLogoutCallback(ctx context.Context) error {
	s.logger.InfoContext(ctx, "Handling logout callback")
	return nil
}
