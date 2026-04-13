package controllers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/zero-heads-lab/auth-service/auth"
	"github.com/zero-heads-lab/auth-service/config"
	"github.com/zero-heads-lab/auth-service/utils"
)

type AuthController struct {
	svc    auth.Service
	config config.AuthConfig
}

type SignupCookie struct {
	Email   string `json:"email"`
	Sub     string `json:"sub"`
	Session string `json:"session"`
}

func NewAuthController(svc auth.Service, config config.AuthConfig) *AuthController {
	return &AuthController{svc: svc, config: config}
}

// ----------------------
// Routes
// ----------------------

func (c *AuthController) AuthRoutes(r chi.Router) {
	r.Get("/session", c.GetSession)

	r.Post("/signup", c.Register)
	r.Post("/verify", c.VerifyUser)
	r.Post("/resend-verification-code", c.ResendVerificationCode)

	r.Get("/login/social/{provider}", c.LoginViaSocial)
	r.Post("/login/callback/{provider}", c.LoginCallback)

	r.Get("/logout", c.Logout)
	r.Post("/logout/callback", c.LogoutCallback)
}

// ----------------------
// Handlers
// ----------------------

// GetSession godoc
// @Summary Get current session
// @Tags Auth
// @Produce json
// @Success 200 {object} auth.SessionResponse
// @Router /session [get]
func (c *AuthController) GetSession(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		utils.WriteJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "missing user id",
		})
		return
	}

	res, err := c.svc.GetSession(ctx, userID)
	if err != nil {
		utils.WriteJSON(w, http.StatusUnauthorized, map[string]string{
			"error": err.Error(),
		})
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

// Register godoc
// @Summary Register user
// @Tags Auth
// @Accept json
// @Produce json
// @Param body body auth.RegisterInput true "Register Input"
// @Success 200 {object} auth.RegisterOutput
// @Router /signup [post]
func (c *AuthController) Register(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	defer r.Body.Close()

	var input auth.RegisterInput

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	if input.Email == "" {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "email is required",
		})
		return
	}

	res, err := c.svc.Register(ctx, input.Email, input.FirstName, input.LastName)
	if err != nil {
		status := http.StatusInternalServerError

		if strings.Contains(err.Error(), "UsernameExistsException") {
			status = http.StatusConflict
			utils.WriteJSON(w, status, map[string]string{
				"error": "User already exists",
			})
			return
		} else if strings.Contains(err.Error(), "InvalidParameterException") {
			status = http.StatusBadRequest
			utils.WriteJSON(w, status, map[string]string{
				"error": "Invalid parameter",
			})
			return
		}

		utils.WriteJSON(w, status, map[string]string{
			"error": err.Error(),
		})
		return
	}

	var sub, session string
	if res.UserSub != nil {
		sub = *res.UserSub
	}
	if res.Session != nil {
		session = *res.Session
	}

	_ = utils.SetCookie(w, c.config.CookieSecret, "signup_session", SignupCookie{
		Email:   input.Email,
		Sub:     sub,
		Session: session,
	}, c.config.SignupSessionTTL)

	utils.WriteJSON(w, http.StatusOK, res)
}

// VerifyUser godoc
// @Summary Confirm user signup
// @Tags Auth
// @Accept json
// @Produce json
// @Param query body auth.ConfirmInput true "Confirm Input"
// @Success 200 {object} map[string]string
// @Router /verify [post]
func (c *AuthController) VerifyUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	defer r.Body.Close()

	var input auth.ConfirmInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	if input.Code == "" {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "code is required",
		})
		return
	}

	// Try reading cookie (fallback mechanism)
	var signupCookie SignupCookie
	err := utils.GetCookie(r, "signup_session", c.config.CookieSecret, &signupCookie)

	if err == nil && signupCookie.Email != "" {
		// override if missing OR mismatch
		if input.Email == nil || *input.Email != signupCookie.Email {
			input.Email = &signupCookie.Email
		}
	}
	// ❗ Final validation AFTER fallback
	if input.Email == nil || *input.Email == "" {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "email is required (missing from request and cookie)",
		})
		return
	}

	// Call service
	session, err := c.svc.Confirm(ctx, *input.Email, input.Code)
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	// Delete signup cookie (one-time use)
	utils.DeleteCookie(w, "signup_session")

	// Set final session cookie
	if session != nil {
		utils.SetCookie(w, c.config.CookieSecret, c.config.SessionCookieName, *session, c.config.SessionTTL)
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "user confirmed successfully",
	})
}

// ResendVerificationCode godoc
// @Summary Resend Verification Code
// @Tags Auth
// @Accept json
// @Produce json
// @Param body body auth.ResendInput true "Resend Input"
// @Success 200 {object} map[string]string
// @Router /resend-verification-code [post]
func (c *AuthController) ResendVerificationCode(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var input auth.ResendInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	err := c.svc.ResendConfirmationCode(ctx, input.Email)
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]error{
			"error": err,
		})
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "verification code sent successfully",
	})
}

// LoginViaSocial godoc
// @Summary Social login redirect
// @Tags Auth
// @Param provider path string true "Provider"
// @Router /login/social/{provider} [get]
func (c *AuthController) LoginViaSocial(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	provider := chi.URLParam(r, "provider")

	url, state, err := c.svc.GetSocialLoginURL(ctx, provider)
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}
	// Set Cookie
	// Set Cookie
	cookie := http.Cookie{
		Name:     "state",
		Value:    state,
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, &cookie)

	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// LoginCallback godoc
// @Summary Handle login callback
// @Tags Auth
// @Param provider path string false "Provider"
// @Router /login/callback/{provider} [post]
func (c *AuthController) LoginCallback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	provider := chi.URLParam(r, "provider")

	var input auth.LoginCallbackInput
	if err := utils.ReadJSON(r, &input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid body",
		})
		return
	}

	res, err := c.svc.HandleLoginCallback(ctx, provider, input)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	// ✅ SET COOKIE HERE
	http.SetCookie(w, res.Cookie)

	utils.WriteJSON(w, http.StatusOK, res.User)
}

// Logout godoc
// @Summary Logout user
// @Tags Auth
// @Router /logout [get]
func (c *AuthController) Logout(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	url, err := c.svc.GetLogoutURL(ctx)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// LogoutCallback godoc
// @Summary Logout callback
// @Tags Auth
// @Router /logout/callback [post]
func (c *AuthController) LogoutCallback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	err := c.svc.HandleLogoutCallback(ctx)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "logged out",
	})
}
