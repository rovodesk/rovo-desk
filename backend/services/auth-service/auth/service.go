package auth

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/zero-heads-lab/auth-service/auth/cognito"
	"github.com/zero-heads-lab/auth-service/cache"
	"github.com/zero-heads-lab/auth-service/config"
	"go.opentelemetry.io/otel/trace"
)

const (
	SignupSessionKey = "signup:session"
	LoginSessionKey  = "login:session"
)

type Service interface {
	GetSession(ctx context.Context, userID string) (any, error)

	Register(ctx context.Context, email string, firstName, lastName *string) (RegisterOutput, error)
	Confirm(ctx context.Context, email, code string) (*string, error)
	ResendConfirmationCode(ctx context.Context, email string) error

	SendEmailVerificationCode(ctx context.Context, email string) error
	VerifyEmail(ctx context.Context, email string, code string) error

	GetSocialLoginURL(ctx context.Context, provider string) (string, string, error)
	HandleLoginCallback(ctx context.Context, provider string, input LoginCallbackInput) (*SessionResult, error)
	GetLogoutURL(ctx context.Context) (string, error)
	HandleLogoutCallback(ctx context.Context) error
}

type authService struct {
	tracer  trace.Tracer
	logger  *slog.Logger
	cognito cognito.Service
	config  config.AuthConfig
	cache   cache.Store
}

func NewAuthService(
	tracer trace.Tracer,
	logger *slog.Logger,
	cognitoSvc cognito.Service,
	config config.AuthConfig,
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

func (s *authService) GetSocialLoginURL(ctx context.Context, provider string) (string, string, error) {
	// You’ll replace this with real Cognito Hosted UI URL
	return s.cognito.GetOauthLoginURL(provider)
}

func (s *authService) HandleLoginCallback(
	ctx context.Context,
	provider string,
	input LoginCallbackInput,
) (*SessionResult, error) {

	tokens, err := s.cognito.ExchangeCodeForTokens(ctx, input.Code, input.CodeVerifier)
	if err != nil {
		return nil, err
	}

	// ⚠️ Minimal session (don’t store raw tokens directly in prod)
	session := map[string]interface{}{
		"access_token": tokens.AccessToken,
		"id_token":     tokens.IDToken,
		"exp":          time.Now().Add(time.Duration(tokens.ExpiresIn) * time.Second).Unix(),
	}

	raw, _ := json.Marshal(session)
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

	return &SessionResult{
		Cookie: cookie,
		User: map[string]string{
			"status": "logged_in",
		},
	}, nil
}

func (s *authService) GetSession(ctx context.Context, userID string) (any, error) {
	// In real system:
	// - decode cookie
	// - verify JWT
	// - fetch user

	return map[string]string{
		"user_id": userID,
	}, nil
}

func (s *authService) GetLogoutURL(ctx context.Context) (string, error) {
	return "/logged-out", nil
}

func (s *authService) HandleLogoutCallback(ctx context.Context) error {
	return nil
}

func (s *authService) Register(ctx context.Context, email string, firstName, lastName *string) (RegisterOutput, error) {
	attrs := map[string]string{}

	if firstName != nil {
		attrs["given_name"] = *firstName
	}

	if lastName != nil {
		attrs["family_name"] = *lastName
	}

	res, err := s.cognito.SignUp(ctx, email, attrs)
	if err != nil {
		return RegisterOutput{}, err
	}
	// Cache session for confirmation step
	if res.Session != nil {
		if err := s.cache.Set(
			ctx,
			SignupSessionKey+":"+email,
			*res.Session,
			s.config.SignupSessionTTL,
		); err != nil {
			return RegisterOutput{}, err
		}
	}
	return RegisterOutput{
		Verified: res.UserConfirmed,
		UserSub:  res.UserSub,
		Session:  res.Session,
	}, nil
}

func (s *authService) Confirm(ctx context.Context, email, code string) (*string, error) {
	// Try cache (optional now)
	var session string
	_ = s.cache.Get(ctx, SignupSessionKey+":"+email, &session)

	res, err := s.cognito.ConfirmSignUp(ctx, email, code)
	if err != nil || res.Session == nil {
		return nil, fmt.Errorf("Error Confirming User %s", err)
	}

	// Clear session cache
	_ = s.cache.Delete(ctx, SignupSessionKey+":"+email)

	return res.Session, nil
}

func (s *authService) ResendConfirmationCode(ctx context.Context, email string) error {
	//TODO: Add RateLimit with redis
	_, err := s.cognito.ResendConfirmationCode(ctx, email)
	if err != nil {
		return fmt.Errorf("Error Sending Confirmation Code %s", err)
	}
	return nil
}

func (s *authService) SendEmailVerificationCode(ctx context.Context, email string) error {
	//TODO: Add RateLimit with redis
	//TODO: Get Access Token from session
	_, err := s.cognito.SendEmailVerificationCode(ctx, "", email)
	if err != nil {
		return fmt.Errorf("Error Sending Email Verification Code %s", err)
	}
	return nil
}

func (s *authService) VerifyEmail(ctx context.Context, email string, code string) error {
	//TODO: Add RateLimit with redis
	//TODO: Get Access Token from session
	_, err := s.cognito.VerifyEmail(ctx, "", email, code)
	if err != nil {
		return fmt.Errorf("Error Verifying Email %s", err)
	}
	return nil
}
