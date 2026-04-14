package controllers

import (
	"encoding/json"
	"errors"
	"log"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/zero-heads-lab/auth-service/auth"
	"github.com/zero-heads-lab/auth-service/config"
	"github.com/zero-heads-lab/auth-service/utils"
)

// AuthController provides production-grade authentication endpoints
type AuthController struct {
	svc           auth.Service
	config        config.AuthConfig
	cookieManager *utils.CookieManager
	logger        *slog.Logger
}

// NewEnhancedAuthController creates a new enhanced auth controller
func NewAuthController(
	svc auth.Service,
	config config.AuthConfig,
	cookieManager *utils.CookieManager,
	logger *slog.Logger,
) *AuthController {
	return &AuthController{
		svc:           svc,
		config:        config,
		cookieManager: cookieManager,
		logger:        logger,
	}
}

// RegisterRoutes registers all authentication routes
func (c *AuthController) RegisterRoutes(r chi.Router) {
	// Session management
	r.Get("/session", c.GetSession)

	// Email OTP Login
	r.Post("/login/email-otp", c.StartEmailOTPLogin)
	r.Post("/login/email-otp/verify", c.VerifyEmailOTP)
	r.Post("/login/email-otp/resend", c.ResendEmailOTP)

	// Signup
	r.Post("/signup", c.SignupHandler)
	r.Post("/signup/verify", c.VerifySignup)
	r.Post("/signup/resend", c.ResendSignupCode)

	// Email verification (for existing users)
	r.Post("/email/verify/send-code", c.SendEmailVerificationCode)
	r.Post("/email/verify", c.VerifyEmailChange)

	// Social login
	r.Get("/login/social/{provider}", c.LoginViaSocial)
	r.Post("/login/callback/{provider}", c.LoginCallback)

	// Token management
	r.Post("/refresh-token", c.RefreshToken)

	// Logout
	r.Get("/logout", c.Logout)
	r.Post("/logout/callback", c.LogoutCallback)
}

// ============================================================================
// Helper Methods
// ============================================================================

// getAuthError attempts to extract an AuthError from an error
func (c *AuthController) getAuthError(err error) (*auth.AuthError, bool) {
	var authErr *auth.AuthError
	if errors.As(err, &authErr) {
		return authErr, true
	}
	return nil, false
}

// writeErrorResponse writes an error response with proper HTTP status code
func (c *AuthController) writeErrorResponse(w http.ResponseWriter, err error) {
	authErr, ok := c.getAuthError(err)
	if ok {
		utils.WriteJSON(w, authErr.StatusCode, auth.NewErrorResponse(authErr, ""))
		return
	}

	// Fallback to generic error
	utils.WriteJSON(w, http.StatusInternalServerError, map[string]string{
		"code":    "INTERNAL_SERVER_ERROR",
		"message": "An unexpected error occurred",
	})
}

// ============================================================================
// Session Management Endpoints
// ============================================================================

// GetSession godoc
// @Summary Get current session
// @Tags Session
// @Security Bearer
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 401 {object} auth.ErrorResponse
// @Router /session [get]
func (c *AuthController) GetSession(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	c.logger.InfoContext(ctx, "GetSession request")

	// TODO: Get Session and Verify Session and return user attributes and session
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		c.logger.WarnContext(ctx, "GetSession: missing user id")
		utils.WriteJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "missing user id",
		})
		return
	}

	res, err := c.svc.GetSession(ctx, userID)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

// ============================================================================
// Email OTP Login Endpoints
// ============================================================================

// StartEmailOTPLogin godoc
// @Summary Start email OTP login
// @Tags Email OTP Login
// @Accept json
// @Produce json
// @Param body body auth.LoginViaEmailInput true "Email"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} auth.ErrorResponse
// @Failure 429 {object} auth.ErrorResponse
// @Router /login/email-otp [post]
func (c *AuthController) StartEmailOTPLogin(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	defer r.Body.Close()

	var input auth.LoginViaEmailInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		c.logger.WarnContext(ctx, "StartEmailOTPLogin: invalid request body")
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	input.Email = strings.TrimSpace(input.Email)

	c.logger.InfoContext(ctx, "Starting email OTP login", slog.String("email", input.Email))

	session, err := c.svc.StartEmailOTPLogin(ctx, input.Email)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	// Store session in auth_session cookie
	opts := utils.SessionOnlyCookieOptions()
	_ = c.cookieManager.SetCookie(w, "auth_session", session, opts)

	c.logger.InfoContext(ctx, "Email OTP login session created", slog.String("email", input.Email))

	utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"message": "OTP sent to your email",
	})
}

// VerifyEmailOTP godoc
// @Summary Verify email OTP
// @Tags Email OTP Login
// @Accept json
// @Produce json
// @Param body body auth.ConfirmInput true "Email and OTP"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} auth.ErrorResponse
// @Failure 401 {object} auth.ErrorResponse
// @Failure 429 {object} auth.ErrorResponse
// @Router /login/email-otp/verify [post]
func (c *AuthController) VerifyEmailOTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	defer r.Body.Close()

	var input auth.ConfirmInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	email := strings.TrimSpace(*input.Email)
	code := strings.TrimSpace(input.Code)

	c.logger.InfoContext(ctx, "Verifying email OTP", slog.String("email", email))

	tokenResult, err := c.svc.VerifyEmailOTP(ctx, email, code)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	// Store tokens in secure cookies
	opts := utils.DefaultCookieOptions(15 * time.Minute)

	_ = c.cookieManager.SetCookie(w, "access_token", tokenResult.AccessToken, opts)
	_ = c.cookieManager.SetCookie(w, "id_token", tokenResult.IDToken, opts)

	// Store refresh token with longer TTL
	if tokenResult.RefreshToken != nil {
		refreshOpts := utils.RefreshTokenCookieOptions(7 * 24 * time.Hour)
		_ = c.cookieManager.SetCookie(w, "refresh_token", *tokenResult.RefreshToken, refreshOpts)
	}

	// Clear auth_session cookie
	_ = c.cookieManager.SetCookie(w, "auth_session", "", utils.SessionOnlyCookieOptions())

	c.logger.InfoContext(ctx, "Email OTP verified successfully", slog.String("email", email))

	utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"message":    "Login successful",
		"expires_in": tokenResult.ExpiresIn,
	})
}

// ResendEmailOTP godoc
// @Summary Resend email OTP
// @Tags Email OTP Login
// @Accept json
// @Produce json
// @Param body body auth.ResendInput true "Email"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} auth.ErrorResponse
// @Failure 429 {object} auth.ErrorResponse
// @Router /login/email-otp/resend [post]
func (c *AuthController) ResendEmailOTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	defer r.Body.Close()

	var input auth.ResendInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	input.Email = strings.TrimSpace(input.Email)

	c.logger.InfoContext(ctx, "Resending email OTP", slog.String("email", input.Email))

	// Use ResendConfirmationCode for now - in a real implementation,
	// you might have a separate OTP resend method
	err := c.svc.ResendConfirmationCode(ctx, input.Email)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	c.logger.InfoContext(ctx, "Email OTP resent", slog.String("email", input.Email))

	utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"message": "OTP resent to your email",
	})
}

// ============================================================================
// Signup Endpoints
// ============================================================================

// SignupHandler godoc
// @Summary Register a new user
// @Tags Signup
// @Accept json
// @Produce json
// @Param body body auth.RegisterInput true "Signup Data"
// @Success 200 {object} auth.RegisterOutput
// @Failure 400 {object} auth.ErrorResponse
// @Failure 409 {object} auth.ErrorResponse
// @Router /signup [post]
func (c *AuthController) SignupHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	defer r.Body.Close()

	var input auth.RegisterInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}
	log.Println("Signup request", input)

	input.Email = strings.TrimSpace(input.Email)

	c.logger.InfoContext(ctx, "New signup request", slog.String("email", input.Email))

	res, err := c.svc.Register(ctx, input.Email, input.FirstName, input.LastName)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	c.logger.InfoContext(ctx, "User registered successfully", slog.String("email", input.Email))

	utils.WriteJSON(w, http.StatusOK, res)
}

// VerifySignup godoc
// @Summary Verify signup email
// @Tags Signup
// @Accept json
// @Produce json
// @Param body body auth.ConfirmInput true "Confirmation Code"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} auth.ErrorResponse
// @Router /signup/verify [post]
func (c *AuthController) VerifySignup(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	defer r.Body.Close()

	var input auth.ConfirmInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	email := strings.TrimSpace(*input.Email)
	input.Code = strings.TrimSpace(input.Code)

	c.logger.InfoContext(ctx, "Verifying signup", slog.String("email", email))

	session, err := c.svc.Confirm(ctx, email, input.Code)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	c.logger.InfoContext(ctx, "Signup verified successfully", slog.String("email", email))

	utils.WriteJSON(w, http.StatusOK, map[string]any{
		"message": "Email verified successfully",
		"session": session,
	})
}

// ResendSignupCode godoc
// @Summary Resend signup verification code
// @Tags Signup
// @Accept json
// @Produce json
// @Param body body auth.ResendInput true "Email"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} auth.ErrorResponse
// @Router /signup/resend [post]
func (c *AuthController) ResendSignupCode(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	defer r.Body.Close()

	var input auth.ResendInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	input.Email = strings.TrimSpace(input.Email)

	c.logger.InfoContext(ctx, "Resending signup code", slog.String("email", input.Email))

	err := c.svc.ResendConfirmationCode(ctx, input.Email)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	c.logger.InfoContext(ctx, "Signup code resent", slog.String("email", input.Email))

	utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"message": "Verification code sent",
	})
}

// ============================================================================
// Email Verification Endpoints
// ============================================================================

// SendEmailVerificationCode godoc
// @Summary Send email verification code
// @Tags Email Verification
// @Security Bearer
// @Accept json
// @Produce json
// @Param body body map[string]string true "Email"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} auth.ErrorResponse
// @Failure 401 {object} auth.ErrorResponse
// @Router /email/verify/send-code [post]
func (c *AuthController) SendEmailVerificationCode(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	defer r.Body.Close()

	var input struct {
		Email string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	input.Email = strings.TrimSpace(input.Email)

	// Get access token from cookie
	accessToken, err := c.cookieManager.GetCookie(r, "access_token", true)
	if err != nil {
		utils.WriteJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "access token not found",
		})
		return
	}

	c.logger.InfoContext(ctx, "Sending email verification code", slog.String("email", input.Email))

	err = c.svc.SendEmailVerificationCode(ctx, input.Email, accessToken)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	c.logger.InfoContext(ctx, "Email verification code sent", slog.String("email", input.Email))

	utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"message": "Verification code sent to your email",
	})
}

// VerifyEmailChange godoc
// @Summary Verify email change
// @Tags Email Verification
// @Security Bearer
// @Accept json
// @Produce json
// @Param body body map[string]string true "Email and Code"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} auth.ErrorResponse
// @Failure 401 {object} auth.ErrorResponse
// @Router /email/verify [post]
func (c *AuthController) VerifyEmailChange(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	defer r.Body.Close()

	var input auth.ConfirmInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	email := strings.TrimSpace(*input.Email)
	input.Code = strings.TrimSpace(input.Code)

	// Get access token from cookie
	accessToken, err := c.cookieManager.GetCookie(r, "access_token", true)
	if err != nil {
		utils.WriteJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "access token not found",
		})
		return
	}

	c.logger.InfoContext(ctx, "Verifying email change", slog.String("email", email))

	err = c.svc.VerifyEmail(ctx, email, input.Code, accessToken)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	c.logger.InfoContext(ctx, "Email verified successfully", slog.String("email", email))

	utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"message": "Email verified successfully",
	})
}

// ============================================================================
// Social Login Endpoints
// ============================================================================

// LoginViaSocial godoc
// @Summary Social login redirect
// @Tags Social Login
// @Param provider path string true "Provider (google, github)"
// @Router /login/social/{provider} [get]
func (c *AuthController) LoginViaSocial(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	provider := chi.URLParam(r, "provider")

	c.logger.InfoContext(ctx, "Social login request", slog.String("provider", provider))

	url, state, err := c.svc.GetSocialLoginURL(ctx, provider)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	// Set state cookie
	opts := utils.SessionOnlyCookieOptions()
	_ = c.cookieManager.SetCookie(w, "oauth_state", state, opts)

	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// LoginCallback godoc
// @Summary Handle login callback
// @Tags Social Login
// @Accept json
// @Produce json
// @Param provider path string true "Provider"
// @Param body body auth.LoginCallbackInput true "Code and Verifier"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} auth.ErrorResponse
// @Router /login/callback/{provider} [post]
func (c *AuthController) LoginCallback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	defer r.Body.Close()

	provider := chi.URLParam(r, "provider")

	var input auth.LoginCallbackInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	c.logger.InfoContext(ctx, "Processing login callback", slog.String("provider", provider))

	res, err := c.svc.HandleLoginCallback(ctx, provider, input.Code, input.CodeVerifier)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	// Set session cookie from service response
	http.SetCookie(w, res.Cookie)

	c.logger.InfoContext(ctx, "Login callback successful", slog.String("provider", provider))

	utils.WriteJSON(w, http.StatusOK, res.User)
}

// ============================================================================
// Token Management Endpoints
// ============================================================================

// RefreshToken godoc
// @Summary Refresh access token
// @Tags Token Management
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 401 {object} auth.ErrorResponse
// @Router /refresh-token [post]
func (c *AuthController) RefreshToken(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Get refresh token from cookie
	refreshToken, err := c.cookieManager.GetCookie(r, "refresh_token", true)
	if err != nil {
		c.logger.WarnContext(ctx, "RefreshToken: no refresh token cookie")
		utils.WriteJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "refresh token not found",
		})
		return
	}

	c.logger.InfoContext(ctx, "Refreshing access token")

	tokenResult, err := c.svc.RefreshAccessToken(ctx, refreshToken)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	// Update access token cookie
	opts := utils.DefaultCookieOptions(15 * 60) // 15 minutes
	_ = c.cookieManager.SetCookie(w, "access_token", tokenResult.AccessToken, opts)

	c.logger.InfoContext(ctx, "Access token refreshed successfully")

	utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"message":    "Token refreshed",
		"expires_in": tokenResult.ExpiresIn,
	})
}

// ============================================================================
// Logout Endpoints
// ============================================================================

// Logout godoc
// @Summary Get logout URL
// @Tags Logout
// @Produce json
// @Success 302
// @Router /logout [get]
func (c *AuthController) Logout(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	c.logger.InfoContext(ctx, "Logout request")

	url, err := c.svc.GetLogoutURL(ctx)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	// Clear all auth cookies
	_ = c.cookieManager.SetCookie(w, "access_token", "", utils.SessionOnlyCookieOptions())
	_ = c.cookieManager.SetCookie(w, "id_token", "", utils.SessionOnlyCookieOptions())
	_ = c.cookieManager.SetCookie(w, "refresh_token", "", utils.RefreshTokenCookieOptions(0))
	_ = c.cookieManager.SetCookie(w, "auth_session", "", utils.SessionOnlyCookieOptions())

	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// LogoutCallback godoc
// @Summary Handle logout callback
// @Tags Logout
// @Produce json
// @Success 200 {object} map[string]string
// @Router /logout/callback [post]
func (c *AuthController) LogoutCallback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	c.logger.InfoContext(ctx, "Logout callback")

	err := c.svc.HandleLogoutCallback(ctx)
	if err != nil {
		c.writeErrorResponse(w, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "Logged out successfully",
	})
}
