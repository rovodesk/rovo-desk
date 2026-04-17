package auth

import (
	"context"
	"fmt"
	"log/slog"
	"regexp"
	"strconv"
	"strings"
	"time"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
	"encore.dev/storage/cache"
	awscfg "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/smithy-go/middleware"
	"github.com/nrednav/cuid2"
	"github.com/zero-heads-lab/api/pkg/cognito"
	"github.com/zero-heads-lab/api/pkg/jwt"
	"github.com/zero-heads-lab/api/pkg/utils"
)

const (
	// Rate limiting constants
	MaxOTPAttempts    = 5
	MaxOTPResendLimit = 5

	OTPLength    = 8
	MinOTPLength = 0
	MaxOTPLength = 9

	// Email validation regex
	emailRegex = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
)

var secrets struct {
	AWS_REGION string

	COGNITO_CLIENT_ID     string
	COGNITO_USER_POOL_ID  string
	COGNITO_CLIENT_SECRET string
	COGNITO_CALLBACK_URL  string
}

//encore:service
type Service struct {
	cognito        cognito.Service
	otpAttempts    cache.IntKeyspace[EmailKey]
	otpResendLimit cache.IntKeyspace[EmailKey]
	loginAttempts  cache.IntKeyspace[EmailKey]
	oAuthState     cache.StringKeyspace[OAuthStateKey]
	sessionState   cache.StructKeyspace[SessionKey, AuthSession]
}

// initService by encore
func initService() (*Service, error) {
	ctx := context.Background()

	// 1. Load AWS config
	awsCfg, err := awscfg.LoadDefaultConfig(
		ctx,
		awscfg.WithRegion(secrets.AWS_REGION),
		awscfg.WithAPIOptions([]func(*middleware.Stack) error{
			func(stack *middleware.Stack) error {
				return stack.Finalize.Add(utils.AwsRequestLogger{}, middleware.After)
			},
		}))
	if err != nil {
		return nil, err
	}

	// 2. Build Cognito config (from env / secrets)
	cfg := cognito.Config{
		Region:       secrets.AWS_REGION,
		ClientID:     secrets.COGNITO_CLIENT_ID,
		ClientSecret: secrets.COGNITO_CLIENT_SECRET,
		CallbackURL:  secrets.COGNITO_CALLBACK_URL,
		UserPoolId:   secrets.COGNITO_USER_POOL_ID,
	}

	// 3. Create a Cognito service
	cognitoSvc, err := cognito.New(awsCfg, cfg)
	if err != nil {
		return nil, err
	}

	return &Service{
		cognito:        cognitoSvc,
		otpAttempts:    *otpAttempts,
		otpResendLimit: *otpResendLimit,
		loginAttempts:  *loginAttempts,
		oAuthState:     *oauthState,
		sessionState:   *authSession,
	}, nil
}

// ============================================================================
// Helper Methods
// ============================================================================

// validateEmail validates email format
var emailRe = regexp.MustCompile(emailRegex)

func normalizeString(str string) string {
	return strings.ToLower(strings.TrimSpace(str))
}

func getSafeString(m map[string]string, key string) string {
	return m[key] // already string-safe
}

func toStringMap(raw map[string]any) map[string]string {
	out := make(map[string]string, len(raw))

	for k, v := range raw {
		switch val := v.(type) {
		case string:
			out[k] = val

		case float64:
			out[k] = strconv.FormatFloat(val, 'f', -1, 64)

		case int64:
			out[k] = strconv.FormatInt(val, 10)

		case bool:
			out[k] = strconv.FormatBool(val)

		case []any:
			// handle array of strings (common for Cognito groups/roles)
			var parts []string
			for _, item := range val {
				if s, ok := item.(string); ok {
					parts = append(parts, s)
				}
			}
			if len(parts) > 0 {
				out[k] = strings.Join(parts, ",")
			}
		}
	}

	return out
}

func (s *Service) validateEmail(email string) error {
	if email == "" {
		return ErrInvalidEmail
	}

	if !emailRe.MatchString(email) {
		return ErrInvalidEmail
	}

	return nil
}

// extractCognitoErrorInfo extracts error code and message from Cognito error
func (s *Service) extractCognitoErrorInfo(err error) (code, message string) {
	if err == nil {
		return "UNKNOWN", "unknown error"
	}

	errStr := err.Error()

	// Expected format: "... ErrorCode: message"
	parts := strings.SplitN(errStr, ":", 2)
	if len(parts) == 2 {
		code = strings.TrimSpace(parts[0])
		message = strings.TrimSpace(parts[1])
		return
	}

	// fallback
	return "COGNITO_ERROR", errStr
}

func normalizeEmailKey(email string) EmailKey {
	return EmailKey{
		Email: normalizeString(email),
	}
}

// generateSessionID creates a cryptographically secure random string
// to be used as a session identifier.
func generateSecureSessionID() (*string, error) {
	generate, err := cuid2.Init(
		cuid2.WithLength(32),
	)
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: "error generating session id",
		}
	}
	id := generate()

	return &id, nil
}

// checkOTPRateLimit checks if user has exceeded OTP attempt limit
func (s *Service) checkAndIncrementOTPAttempt(ctx context.Context, email string) error {
	key := normalizeEmailKey(email)

	attempts, _ := s.otpAttempts.Get(ctx, key)

	if attempts >= MaxOTPAttempts {
		rlog.Warn("OTP rate limit exceeded",
			"email", email,
			"attempts", attempts,
		)

		return &errs.Error{
			Code:    errs.ResourceExhausted,
			Message: "otp-limit-exceeded",
		}
	}

	return s.otpAttempts.Set(ctx, key, attempts+1)
}

// clearOTPAttempts clears OTP attempt counter on successful verification
func (s *Service) clearOTPAttempts(ctx context.Context, email string) error {
	key := normalizeEmailKey(email)

	_, err := s.otpAttempts.Delete(ctx, key)
	if err != nil {
		rlog.Error("failed to clear OTP attempts",
			"email", key.Email,
			"err", err,
		)
		return err
	}

	return nil
}

// checkResendRateLimit checks if user can request a new OTP
func (s *Service) checkAndIncrementResendLimit(ctx context.Context, email string) error {
	key := normalizeEmailKey(email)

	limit, _ := s.otpResendLimit.Get(ctx, key)

	if limit >= MaxOTPResendLimit {
		rlog.Warn("Resend rate limit exceeded",
			"email", key.Email,
			"limit", limit,
		)

		return &errs.Error{
			Code:    errs.ResourceExhausted,
			Message: "too-many-attempts",
		}
	}

	return s.otpResendLimit.Set(ctx, key, limit+1)
}

// setResendRateLimit sets a rate limit for OTP resend
func (s *Service) clearResendLimit(ctx context.Context, email string) error {
	key := normalizeEmailKey(email)

	_, err := s.otpResendLimit.Delete(ctx, key)
	if err != nil {
		rlog.Error("failed to clear resend limit",
			"email", key.Email,
			"err", err,
		)
		return err
	}

	return nil
}

// ============================================================================
// Email OTP Authentication Methods
// ============================================================================

// StartEmailOTPLogin initiates email-based OTP authentication
//
//encore:api public method=POST path=/auth/login/email-otp
func (s *Service) StartEmailOTPLogin(ctx context.Context, params *EmailOTPLoginRequest) (*EmailOTPLoginResponse, error) {
	email := normalizeString(params.Email)

	// 1. Validate email format
	if err := s.validateEmail(email); err != nil {
		return nil, &errs.Error{
			Code:    errs.InvalidArgument,
			Message: "Invalid Email format",
		}
	}
	// 2. Rate Limit Login attempts
	if err := s.checkAndIncrementOTPAttempt(ctx, email); err != nil {
		return nil, err
	}

	// 3. Initiate OTP flow with Cognito
	rlog.Debug("Starting email OTP login", "email", email)

	res, err := s.cognito.InitiateEmailOTPAuth(ctx, email, nil)
	if err != nil {
		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)
		rlog.Error("Cognito InitiateAuth failed",
			"email", email,
			"error", err.Error(),
		)
		return nil, cognitoErr
	}

	// 4. Validate response
	if res.Session == nil {
		rlog.Error("cognito returned empty session", "email", email)
		return nil, ErrMissingAuthSession
	}

	// 5. Create temporary session (for OTP verification step)
	sessionID, err := generateSecureSessionID()
	if err != nil {
		return nil, err
	}

	session := AuthSession{
		SessionID: *sessionID,
		UserID:    "", // unknown until verified
		Claims: map[string]string{
			"email":          email,
			"cognitoSession": *res.Session,
		},
		RefreshToken: "",                                              // not available yet
		ExpiresAt:    uint64(time.Now().Add(10 * time.Minute).Unix()), // short-lived
	}

	// 6. Store session
	err = s.sessionState.Set(ctx, SessionKey{
		SessionID: *sessionID,
	}, session)
	if err != nil {
		rlog.Error("failed to cache login session",
			"email", email,
			"err", err,
		)

		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: "failed to save session",
		}
	}

	rlog.Info("email OTP login session created",
		"email", email,
		"app_session_id", *sessionID,
	)

	// 7. Return sessionID (NOT Cognito session)
	return &EmailOTPLoginResponse{
		*sessionID,
	}, nil
}

// VerifyEmailOTP verifies the OTP and returns authentication tokens
//
//encore:api public method=POST path=/auth/login/email-otp/verify
func (s *Service) VerifyEmailOTP(ctx context.Context, params *VerifyEmailOTPRequest) (*AuthSuccessResponse, error) {
	sessionID := strings.ToLower(strings.TrimSpace(params.SessionID))

	// 1. Validate Session Id
	if parse := cuid2.IsCuid(sessionID); parse == false {
		return nil, &errs.Error{
			Code:    errs.InvalidArgument,
			Message: "invalid session id",
		}
	}

	// 2. Retrive Session from cache
	session, err := s.sessionState.Get(ctx, SessionKey{SessionID: sessionID})
	if err != nil {
		return nil, ErrInternalServer
	}

	email := normalizeString(getSafeString(session.Claims, "email"))
	cognitoSession := getSafeString(session.Claims, "cognitoSession")
	if email == "" || cognitoSession == "" {
		return nil, &errs.Error{
			Code:    errs.NotFound,
			Message: "session not found",
		}
	}

	// 3. Trim and validate OTP
	code := strings.TrimSpace(params.Code)
	if len(code) != OTPLength {
		return nil, ErrInvalidOTP
	}
	for _, c := range code {
		if c < MinOTPLength || c > MaxOTPLength {
			return nil, ErrInvalidOTP
		}
	}

	// 4. Rate Limit Login attempts
	if err := s.checkAndIncrementOTPAttempt(ctx, sessionID); err != nil {
		return nil, err
	}

	rlog.Info("Verifying email OTP",
		"email", email,
		"sessionID", sessionID,
	)

	// Respond to OTP challenge
	res, err := s.cognito.RespondToEmailOTPChallenge(ctx, email, code, cognitoSession)
	if err != nil {
		// Increment attempt counter on failure
		_, _ = s.otpAttempts.Increment(ctx, normalizeEmailKey(email), 1)

		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)

		return nil, cognitoErr
	}

	// Validate authentication result
	if res.AuthenticationResult == nil {
		rlog.Warn("Cognito returned empty authentication result",
			"email", email,
			"sessionID", sessionID,
		)

		return nil, ErrInternalServer
	}

	idToken := *res.AuthenticationResult.IdToken
	claims, err := jwt.VerifyJWTToken(
		s.cognito.JWTIssuer(),     // Iss / JWKS
		secrets.COGNITO_CLIENT_ID, // Aud
		idToken,
	)
	if err != nil {
		rlog.Warn("JWT token verification failed",
			"email", email,
			"sessionID", sessionID,
		)
		return nil, ErrInvalidToken
	}

	rlog.Info("JWT token verified successfully",
		"email", email,
		"claims", claims,
		"sessionID", sessionID,
	)

	// Clear OTP attempts and resend limits
	_ = s.clearOTPAttempts(ctx, email)
	_ = s.clearResendLimit(ctx, email)
	// Clear Previous session
	_, err = s.sessionState.Delete(ctx, SessionKey{SessionID: sessionID})
	if err != nil {
		return nil, ErrInternalServer
	}

	//	Create New Session
	newSessionID, err := generateSecureSessionID()
	if err != nil {
		return nil, err
	}
	//TODO: Create A NEW User
	newSession := AuthSession{
		SessionID:    *newSessionID,
		UserID:       auth.UID(claims.Sub),                       //TODO: REPLACE with app userID not COgnito user sub
		Claims:       toStringMap(claims.Raw),                    // TODO: Loop and Map
		RefreshToken: *res.AuthenticationResult.RefreshToken,     // not available yet
		ExpiresAt:    uint64(res.AuthenticationResult.ExpiresIn), // access token expiry
	}

	// 6. Store new session
	err = s.sessionState.Set(ctx, SessionKey{
		SessionID: *newSessionID,
	}, newSession)
	if err != nil {
		rlog.Error("failed to save user session",
			"email", email,
			"err", err,
		)

		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: "failed to save session",
		}
	}

	rlog.Info("Email OTP verification successful",
		"email", email,
		"previousSessionID", sessionID,
		"newSessionID", newSessionID,
	)

	return &AuthSuccessResponse{
		AccessToken:  res.AuthenticationResult.AccessToken,
		IDToken:      idToken,
		RefreshToken: res.AuthenticationResult.RefreshToken,
		ExpiresIn:    uint64(res.AuthenticationResult.ExpiresIn),
		TokenType:    "Bearer",
	}, nil
}

// // RefreshAccessToken refreshes the access token using refresh token
// func (s *authService) RefreshAccessToken(ctx context.Context, refreshToken string) (TokenResult, error) {
// 	//TODO: Retrieve refresh token from cache
// 	if strings.TrimSpace(refreshToken) == "" {
// 		return TokenResult{}, ErrRefreshTokenExpired.WithDetail("reason", "refresh token is required")
// 	}

// 	rlog.Info("Attempting to refresh access token")

// 	// Call Cognito to refresh tokens
// 	res, err := s.cognito.RefreshAccessToken(ctx, refreshToken)
// 	if err != nil {
// 		code, msg := s.extractCognitoErrorInfo(err)
// 		cognitoErr := CognitoErrorMapper(code, msg)
// 		rlog.Error("Token refresh failed",
// 			slog.String("error", err.Error()))
// 		return TokenResult{}, cognitoErr
// 	}

// 	if res.AuthenticationResult == nil || res.AuthenticationResult.AccessToken == nil {
// 		rlog.Error("Cognito returned empty authentication result on refresh")
// 		return TokenResult{}, NewAuthError("TOKEN_ERROR", "Token refresh failed", http.StatusInternalServerError)
// 	}

// 	expiresIn := 3600 // Default to 1 hour
// 	if res.AuthenticationResult.ExpiresIn > 0 {
// 		expiresIn = int(res.AuthenticationResult.ExpiresIn)
// 	}

// 	tokenResult := TokenResult{
// 		AccessToken:  *res.AuthenticationResult.AccessToken,
// 		IDToken:      "", // ID token not provided in refresh response
// 		RefreshToken: res.AuthenticationResult.RefreshToken,
// 		ExpiresIn:    expiresIn,
// 		TokenType:    "Bearer",
// 	}

// 	rlog.Info("Access token refreshed successfully",
// 		slog.Int("expires_in", expiresIn))

// 	return tokenResult, nil
// }

// ============================================================================
// Sign Up Methods
// ============================================================================

// Register creates a new user account
func (s *Service) Register(ctx context.Context, params *RegisterInput) (*RegisterOutput, error) {
	email := normalizeString(params.Email)

	// 1. Validate email
	if err := s.validateEmail(email); err != nil {
		rlog.Info("Invalid email format", slog.String("email", email))
		return nil, err
	}

	rlog.Info("Registering new user", "email", email)

	// 2. Build attributes
	attrs := map[string]string{}
	if params.Tracking != nil && params.Tracking.UTM != nil {
		if params.Tracking.UTM.Source != nil {
			attrs["custom:utm_source"] = *params.Tracking.UTM.Source
		}
		if params.Tracking.UTM.Medium != nil {
			attrs["custom:utm_medium"] = *params.Tracking.UTM.Medium
		}
		if params.Tracking.UTM.Campaign != nil {
			attrs["custom:utm_campaign"] = *params.Tracking.UTM.Campaign
		}
	}
	// OPTIONAL: Store UTM / tracking
	if params.Tracking != nil && params.Tracking.UTM != nil {
		if params.Tracking.UTM.Source != nil {
			attrs["custom:utm_source"] = *params.Tracking.UTM.Source
		}
		if params.Tracking.UTM.Medium != nil {
			attrs["custom:utm_medium"] = *params.Tracking.UTM.Medium
		}
		if params.Tracking.UTM.Campaign != nil {
			attrs["custom:utm_campaign"] = *params.Tracking.UTM.Campaign
		}
	}

	// 3. SignUp User
	res, err := s.cognito.SignUp(ctx, email, attrs)
	if err != nil {
		code, msg := s.extractCognitoErrorInfo(err)
		cognitoErr := CognitoErrorMapper(code, msg)
		rlog.Error("Cognito SignUp failed",
			slog.String("email", email),
			slog.String("error", err.Error()))
		return nil, cognitoErr
	}

	// ⚠️ At this point the user is NOT logged in yet [ Need to log in from Frontend ]

	rlog.Info("User registered successfully",
		slog.String("email", email),
		slog.String("user_sub", fmt.Sprintf("%v", res.UserSub)))

	return &RegisterOutput{
		Verified: res.UserConfirmed,
		Email:    email,
	}, nil
}

// // Confirm verifies the user's email during signup
// func (s *authService) Confirm(ctx context.Context, email, code string) (*string, error) {
// 	// Validate email
// 	if err := s.validateEmail(email); err != nil {
// 		return nil, err
// 	}

// 	// Trim and validate code
// 	code = strings.TrimSpace(code)
// 	if len(code) == 0 {
// 		return nil, ErrInvalidOTP.WithDetail("reason", "confirmation code is required")
// 	}

// 	rlog.Info("Confirming user email", slog.String("email", email))

// 	// Try to retrieve cached session (optional)
// 	sessionKey := SignupSessionKey + ":" + email
// 	var session string
// 	_ = s.cache.Get(ctx, sessionKey, &session)

// 	// Call Cognito
// 	res, err := s.cognito.ConfirmSignUp(ctx, email, code)
// 	if err != nil {
// 		code, msg := s.extractCognitoErrorInfo(err)
// 		cognitoErr := CognitoErrorMapper(code, msg)
// 		rlog.Warn("Signup confirmation failed",
// 			slog.String("email", email),
// 			slog.String("error", err.Error()))
// 		return nil, cognitoErr
// 	}

// 	// Clear session cache
// 	_ = s.cache.Delete(ctx, sessionKey)

// 	rlog.Info("User email confirmed successfully",
// 		slog.String("email", email))

// 	return res.Session, nil
// }

// // ResendConfirmationCode resends the confirmation code to the user's email
// func (s *authService) ResendConfirmationCode(ctx context.Context, email string) error {
// 	// Validate email
// 	if err := s.validateEmail(email); err != nil {
// 		return err
// 	}

// 	// Check rate limit
// 	if err := s.checkResendRateLimit(ctx, email); err != nil {
// 		return err
// 	}

// 	rlog.Info("Resending confirmation code", slog.String("email", email))

// 	// Call Cognito
// 	_, err := s.cognito.ResendConfirmationCode(ctx, email)
// 	if err != nil {
// 		code, msg := s.extractCognitoErrorInfo(err)
// 		cognitoErr := CognitoErrorMapper(code, msg)
// 		rlog.Error("Resend confirmation failed",
// 			slog.String("email", email),
// 			slog.String("error", err.Error()))
// 		return cognitoErr
// 	}

// 	// Set rate limit
// 	_ = s.setResendRateLimit(ctx, email)

// 	rlog.Info("Confirmation code sent successfully",
// 		slog.String("email", email))

// 	return nil
// }

// // ============================================================================
// // Email Verification Methods
// // ============================================================================

// // SendEmailVerificationCode sends a verification code for email change
// func (s *authService) SendEmailVerificationCode(ctx context.Context, email, accessToken string) error {
// 	if strings.TrimSpace(accessToken) == "" {
// 		return NewAuthError("MISSING_TOKEN", "Access token is required", http.StatusUnauthorized)
// 	}

// 	rlog.Info("Sending email verification code", slog.String("email", email))

// 	_, err := s.cognito.SendEmailVerificationCode(ctx, accessToken, email)
// 	if err != nil {
// 		code, msg := s.extractCognitoErrorInfo(err)
// 		cognitoErr := CognitoErrorMapper(code, msg)
// 		rlog.Error("Send email verification failed",
// 			slog.String("email", email),
// 			slog.String("error", err.Error()))
// 		return cognitoErr
// 	}

// 	rlog.Info("Email verification code sent", slog.String("email", email))
// 	return nil
// }

// // VerifyEmail verifies the user's email change
// func (s *authService) VerifyEmail(ctx context.Context, email, code, accessToken string) error {
// 	if strings.TrimSpace(accessToken) == "" {
// 		return NewAuthError("MISSING_TOKEN", "Access token is required", http.StatusUnauthorized)
// 	}

// 	code = strings.TrimSpace(code)
// 	if len(code) == 0 {
// 		return ErrInvalidOTP.WithDetail("reason", "verification code is required")
// 	}

// 	rlog.Info("Verifying email", slog.String("email", email))

// 	_, err := s.cognito.VerifyEmail(ctx, accessToken, email, code)
// 	if err != nil {
// 		code, msg := s.extractCognitoErrorInfo(err)
// 		cognitoErr := CognitoErrorMapper(code, msg)
// 		rlog.Error("Email verification failed",
// 			slog.String("email", email),
// 			slog.String("error", err.Error()))
// 		return cognitoErr
// 	}

// 	rlog.Info("Email verified successfully",
// 		slog.String("email", email))

// 	return nil
// }

// // ============================================================================
// // Social Login Methods
// // ============================================================================

// // GetSocialLoginURL returns the OAuth login URL for a given provider
// func (s *authService) GetSocialLoginURL(ctx context.Context, provider string) (string, string, error) {
// 	rlog.Info("Generating social login URL", slog.String("provider", provider))
// 	return s.cognito.GetOauthLoginURL(provider)
// }

// // HandleLoginCallback handles the OAuth callback
// func (s *authService) HandleLoginCallback(
// 	ctx context.Context,
// 	provider string,
// 	code string,
// 	codeVerifier string,
// ) (*SessionResult, error) {
// 	rlog.Info("Handling login callback", slog.String("provider", provider))

// 	tokens, err := s.cognito.ExchangeCodeForTokens(ctx, code, codeVerifier)
// 	if err != nil {
// 		code, msg := s.extractCognitoErrorInfo(err)
// 		cognitoErr := CognitoErrorMapper(code, msg)
// 		rlog.Error("Token exchange failed",
// 			slog.String("provider", provider),
// 			slog.String("error", err.Error()))
// 		return nil, cognitoErr
// 	}

// 	// ⚠️ Minimal session (don't store raw tokens directly in prod)
// 	sessionData := map[string]any{
// 		"access_token": tokens.AccessToken,
// 		"id_token":     tokens.IDToken,
// 		"exp":          time.Now().Add(time.Duration(tokens.ExpiresIn) * time.Second).Unix(),
// 	}

// 	raw, _ := json.Marshal(sessionData)
// 	encoded := base64.StdEncoding.EncodeToString(raw)

// 	cookie := &http.Cookie{
// 		Name:     "session",
// 		Value:    encoded,
// 		HttpOnly: true,
// 		Secure:   true,
// 		Path:     "/",
// 		SameSite: http.SameSiteLaxMode,
// 		Expires:  time.Now().Add(24 * time.Hour),
// 	}

// 	rlog.Info("Login callback successful", slog.String("provider", provider))

// 	return &SessionResult{
// 		Cookie: cookie,
// 		User: map[string]string{
// 			"status": "logged_in",
// 		},
// 	}, nil
// }

// // GetSession retrieves session information for a user
// func (s *authService) GetSession(ctx context.Context, userID string) (any, error) {
// 	rlog.Info("Getting session", slog.String("user_id", userID))
// 	// In real system:
// 	// - decode cookie
// 	// - verify JWT
// 	// - fetch user

// 	return map[string]string{
// 		"user_id": userID,
// 	}, nil
// }

// // GetLogoutURL returns the logout URL
// func (s *authService) GetLogoutURL(ctx context.Context) (string, error) {
// 	return s.cognito.Domain() + "/logout", nil
// }

// // HandleLogoutCallback handles the logout callback
// func (s *authService) HandleLogoutCallback(ctx context.Context) error {
// 	rlog.Info("Handling logout callback")
// 	return nil
// }
