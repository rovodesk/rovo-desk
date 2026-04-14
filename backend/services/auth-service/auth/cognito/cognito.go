package cognito

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	cip "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
	"github.com/zero-heads-lab/auth-service/config"
)

type SignUpAttrs struct {
	FirstName string
	LastName  string
}

type Service interface {
	// Email OTP Login
	InitiateEmailOTPAuth(ctx context.Context, email string) (*cip.InitiateAuthOutput, error)
	RespondToEmailOTPChallenge(ctx context.Context, email, otp, session string) (*cip.RespondToAuthChallengeOutput, error)
	ExchangeCodeForTokens(ctx context.Context, code, codeVerifier string) (*ExchangeResult, error)
	RefreshAccessToken(ctx context.Context, refreshToken string) (*cip.RespondToAuthChallengeOutput, error)

	// Social Login
	GetOauthLoginURL(provider string) (string, string, error)

	// Sign Up
	SignUp(ctx context.Context, email string, attrs ...map[string]string) (*cip.SignUpOutput, error)
	ConfirmSignUp(ctx context.Context, email, code string) (*cip.ConfirmSignUpOutput, error)
	ResendConfirmationCode(ctx context.Context, email string) (*cip.ResendConfirmationCodeOutput, error)

	// Confirm Email post change email
	SendEmailVerificationCode(ctx context.Context, accessToken, email string) (*cip.GetUserAttributeVerificationCodeOutput, error)
	VerifyEmail(ctx context.Context, accessToken, email, code string) (*cip.VerifyUserAttributeOutput, error)

	// JWKS
	JWKSURL() string
	Domain() string
}

type service struct {
	client *cip.Client
	cfg    config.CognitoConfig
	http   *http.Client
}

func New(awsCfg aws.Config, cfg config.CognitoConfig) (Service, error) {
	return &service{
		client: cip.NewFromConfig(awsCfg),
		cfg:    cfg,
		http: &http.Client{
			Timeout: 10 * time.Second,
		},
	}, nil
}

/**
* Generates a Secret Hash with username
 */
func (s *service) secretHash(username string) *string {
	if s.cfg.ClientSecret == "" {
		return nil
	}

	mac := hmac.New(sha256.New, []byte(s.cfg.ClientSecret))
	mac.Write([]byte(username + s.cfg.ClientID))

	hash := base64.StdEncoding.EncodeToString(mac.Sum(nil))
	return &hash
}

func (s *service) Domain() string {
	return fmt.Sprintf("https://%s.auth.%s.amazoncognito.com", s.cfg.UserPoolId, s.cfg.Region)
}

func (s *service) JWKSURL() string {
	return fmt.Sprintf("https://cognito-idp.%s.amazonaws.com/%s/.well-known/jwks.json", s.cfg.Region, s.cfg.UserPoolId)
}

func (s *service) InitiateEmailOTPAuth(ctx context.Context, email string) (*cip.InitiateAuthOutput, error) {
	authParams := map[string]string{
		"USERNAME":            email,
		"PREFERRED_CHALLENGE": string(types.ChallengeNameTypeEmailOtp),
	}

	if sh := s.secretHash(email); sh != nil {
		authParams["SECRET_HASH"] = *sh
	}

	input := &cip.InitiateAuthInput{
		ClientId:       aws.String(s.cfg.ClientID),
		AuthFlow:       types.AuthFlowTypeUserAuth,
		AuthParameters: authParams,
	}

	return s.client.InitiateAuth(ctx, input)
}

// ----------------------
// Respond to OTP Challenge
// ----------------------

func (s *service) RespondToEmailOTPChallenge(ctx context.Context, email, otp, session string) (*cip.RespondToAuthChallengeOutput, error) {
	challengeResponses := map[string]string{
		"USERNAME":       email,
		"EMAIL_OTP_CODE": otp,
	}

	if sh := s.secretHash(email); sh != nil {
		challengeResponses["SECRET_HASH"] = *sh
	}

	input := &cip.RespondToAuthChallengeInput{
		ClientId:           aws.String(s.cfg.ClientID),
		ChallengeName:      types.ChallengeNameTypeEmailOtp,
		Session:            aws.String(session),
		ChallengeResponses: challengeResponses,
	}

	return s.client.RespondToAuthChallenge(ctx, input)
}

// ----------------------
// Token Exchange
// ----------------------

type TokenResponse struct {
	IDToken      string  `json:"id_token"`
	AccessToken  string  `json:"access_token"`
	RefreshToken *string `json:"refresh_token"`
	ExpiresIn    int     `json:"expires_in"`
	TokenType    string  `json:"token_type"`
}

type ExchangeResult struct {
	AccessToken  string
	IDToken      string
	RefreshToken *string
	ExpiresIn    int
	TokenType    string
}

func (s *service) ExchangeCodeForTokens(ctx context.Context, code, codeVerifier string) (*ExchangeResult, error) {
	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("client_id", s.cfg.ClientID)
	data.Set("code", code)
	data.Set("redirect_uri", s.cfg.CallbackURL)
	data.Set("code_verifier", codeVerifier)

	if s.cfg.ClientSecret != "" {
		data.Set("client_secret", s.cfg.ClientSecret)
	}

	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		fmt.Sprintf("%s/oauth2/token", s.Domain()),
		bytes.NewBufferString(data.Encode()),
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	res, err := s.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, _ := io.ReadAll(res.Body)

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("token exchange failed: %s", string(body))
	}

	var tokenResp TokenResponse
	if err := json.Unmarshal(body, &tokenResp); err != nil {
		return nil, fmt.Errorf("invalid token response: %w", err)
	}

	if tokenResp.TokenType != "Bearer" {
		return nil, fmt.Errorf("unexpected token type")
	}

	return &ExchangeResult{
		AccessToken:  tokenResp.AccessToken,
		IDToken:      tokenResp.IDToken,
		RefreshToken: tokenResp.RefreshToken,
		ExpiresIn:    tokenResp.ExpiresIn,
		TokenType:    tokenResp.TokenType,
	}, nil
}

func (s *service) GetOauthLoginURL(provider string) (string, string, error) {
	baseURL := fmt.Sprintf("%s/oauth2/authorize", s.Domain())

	u, err := url.Parse(baseURL)
	if err != nil {
		return "", "", fmt.Errorf("invalid cognito domain: %w", err)
	}

	q := u.Query()
	q.Set("response_type", "code")
	q.Set("client_id", s.cfg.ClientID)
	q.Set("redirect_uri", s.cfg.CallbackURL)
	q.Set("identity_provider", provider)
	q.Set("scope", "openid email profile")

	// Optional but recommended
	randomState := "abcg"
	// TODO: generate securely per request
	// TODO: Store in cache and return cookie
	q.Set("state", randomState)

	u.RawQuery = q.Encode()

	return u.String(), randomState, nil
}

func (s *service) SignUp(
	ctx context.Context,
	email string,
	attrs ...map[string]string,
) (*cip.SignUpOutput, error) {
	if email == "" {
		return nil, errors.New("Invalid Email")
	}

	// Base attributes (email is required)
	userAttrs := []types.AttributeType{
		{
			Name:  aws.String("email"),
			Value: aws.String(email),
		},
	}

	// Merge optional attributes
	if len(attrs) > 0 {
		for k, v := range attrs[0] {
			userAttrs = append(userAttrs, types.AttributeType{
				Name:  aws.String(k),
				Value: aws.String(v),
			})
		}
	}

	input := &cip.SignUpInput{
		ClientId:       aws.String(s.cfg.ClientID),
		Username:       aws.String(email), // using email as username
		UserAttributes: userAttrs,
	}

	// Add SECRET_HASH
	if sh := s.secretHash(email); sh != nil {
		input.SecretHash = sh
	}

	// SignUp
	res, err := s.client.SignUp(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("cognito signup failed: %w", err)
	}

	return res, nil
}

// ConfirmSignUp verifies the OTP sent to the user's email
func (s *service) ConfirmSignUp(
	ctx context.Context,
	email string,
	code string,
) (*cip.ConfirmSignUpOutput, error) {

	input := &cip.ConfirmSignUpInput{
		ClientId:         aws.String(s.cfg.ClientID),
		Username:         aws.String(email),
		ConfirmationCode: aws.String(code),
	}

	// Add SECRET_HASH if required
	if sh := s.secretHash(email); sh != nil {
		input.SecretHash = sh
	}

	res, err := s.client.ConfirmSignUp(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("confirm signup failed: %w", err)
	}

	return res, nil
}

// ResendConfirmationCode triggers a new OTP to the user's email
func (s *service) ResendConfirmationCode(
	ctx context.Context,
	email string,
) (*cip.ResendConfirmationCodeOutput, error) {

	input := &cip.ResendConfirmationCodeInput{
		ClientId: aws.String(s.cfg.ClientID),
		Username: aws.String(email),
	}

	// Add SECRET_HASH if required
	if sh := s.secretHash(email); sh != nil {
		input.SecretHash = sh
	}

	res, err := s.client.ResendConfirmationCode(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("resend confirmation code failed: %w", err)
	}

	return res, nil
}

func (s *service) SendEmailVerificationCode(ctx context.Context, accessToken, email string) (*cip.GetUserAttributeVerificationCodeOutput, error) {
	input := &cip.GetUserAttributeVerificationCodeInput{
		AccessToken:   aws.String(accessToken),
		AttributeName: aws.String("email"),
	}

	res, err := s.client.GetUserAttributeVerificationCode(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("send email verification code failed: %w", err)
	}

	return res, nil
}

func (s *service) VerifyEmail(ctx context.Context, accessToken, email, code string) (*cip.VerifyUserAttributeOutput, error) {
	input := &cip.VerifyUserAttributeInput{
		AccessToken:   aws.String(accessToken),
		AttributeName: aws.String("email"),
		Code:          aws.String(code),
	}

	res, err := s.client.VerifyUserAttribute(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("verify email failed: %w", err)
	}

	return res, nil
}

// RefreshAccessToken refreshes the access token using a refresh token
func (s *service) RefreshAccessToken(ctx context.Context, refreshToken string) (*cip.RespondToAuthChallengeOutput, error) {
	authParameters := map[string]string{
		"REFRESH_TOKEN": refreshToken,
	}

	// Add SECRET_HASH if required
	if s.cfg.ClientSecret != "" {
		mac := hmac.New(sha256.New, []byte(s.cfg.ClientSecret))
		mac.Write([]byte(s.cfg.ClientID))
		hash := base64.StdEncoding.EncodeToString(mac.Sum(nil))
		authParameters["SECRET_HASH"] = hash
	}

	input := &cip.RespondToAuthChallengeInput{
		ClientId:           aws.String(s.cfg.ClientID),
		ChallengeName:      types.ChallengeNameType("REFRESH_TOKEN"),
		ChallengeResponses: authParameters,
	}

	return s.client.RespondToAuthChallenge(ctx, input)
}
