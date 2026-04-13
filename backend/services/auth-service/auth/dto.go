package auth

import (
	"net/http"
)

type TrustedSocialProvider string

const (
	GoogleProvider TrustedSocialProvider = "google"
	GithubProvider TrustedSocialProvider = "github"
)

type RegisterInput struct {
	FirstName *string `json:"first_name,omitempty"`
	LastName  *string `json:"last_name,omitempty"`
	Email     string  `json:"email"`
}

type RegisterOutput struct {
	Verified bool
	UserSub  *string `json:"user_sub,omitempty"`
	Session  *string `json:"session,omitempty"`
}

type ConfirmInput struct {
	Email *string `json:"email,omitempty"`
	Code  string  `json:"code"`
}

type ResendInput struct {
	Email string `json:"email"`
}

type LoginViaEmailInput struct {
	Email string `json:"email"`
}

type LoginViaSocialInput struct {
	Provider string `json:"provider"`
}

type TokenResponse struct {
	AccessToken  string  `json:"access_token"`
	IdToken      string  `json:"id_token"`
	RefreshToken *string `json:"refresh_token,omitempty"`
	ExpriesIn    string  `json:"expires_in"`
	TokenType    string  `json:"token_type"`
}

type LoginCallbackInput struct {
	Code         string
	CodeVerifier string
}

type AuthSession struct {
	AccessToken    string
	Email          string
	CognitoSession string
	ChallengeName  *string
	CreatedAt      string
	ExpiresAt      string
}

type OAuthStateData struct {
	CodeVerifier string
	Provider     TrustedSocialProvider
	ReturnTo     *string
	CreatedAt    string
}

type SessionResponse struct {
	Session AuthSession
	User    any
}

type SessionResult struct {
	Cookie *http.Cookie
	User   any
}
