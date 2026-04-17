package auth

type EmailOTPLoginRequest struct {
	Email string `json:"email"`
}

type EmailOTPLoginResponse struct {
	SessionID string `json:"session_id"`
}

type VerifyEmailOTPRequest struct {
	SessionID string `json:"session_id"`
	Code      string `json:"code"`
}

type AuthSuccessResponse struct {
	AccessToken  *string
	IDToken      string
	RefreshToken *string
	ExpiresIn    uint64
	TokenType    string
}

type UTMParams struct {
	Source   *string `json:"utm_source,omitempty"`
	Medium   *string `json:"utm_medium,omitempty"`
	Campaign *string `json:"utm_campaign,omitempty"`
}

type AttributionParams struct {
	ClickID     *string `json:"click_id,omitempty"`     // generic click id
	GCLID       *string `json:"gclid,omitempty"`        // Google Ads
	FBCLID      *string `json:"fbclid,omitempty"`       // Facebook Ads
	TTCLID      *string `json:"ttclid,omitempty"`       // TikTok Ads
	Referrer    *string `json:"referrer,omitempty"`     // document.referrer
	LandingPage *string `json:"landing_page,omitempty"` // first URL
}

type ContextParams struct {
	SessionID *string `json:"session_id,omitempty"` // anon or authenticated
	Device    *string `json:"device,omitempty"`     // mobile, desktop
	OS        *string `json:"os,omitempty"`         // iOS, Android, Mac
	Browser   *string `json:"browser,omitempty"`    // Chrome, Safari
	IP        *string `json:"ip,omitempty"`
	Country   *string `json:"country,omitempty"`
	City      *string `json:"city,omitempty"`
}

type ProductParams struct {
	SignupSource *string `json:"signup_source,omitempty"` // landing_page, invite, referral
	ReferralCode *string `json:"referral_code,omitempty"`
	ExperimentID *string `json:"experiment_id,omitempty"` // A/B testing
	VariantID    *string `json:"variant_id,omitempty"`
}

type TracingParams struct {
	UTM         *UTMParams         `json:"utm,omitempty"`
	Attribution *AttributionParams `json:"attribution,omitempty"`
	Context     *ContextParams     `json:"context,omitempty"`
	Product     *ProductParams     `json:"product,omitempty"`
}

type RegisterInput struct {
	FirstName *string        `json:"first_name,omitempty"`
	LastName  *string        `json:"last_name,omitempty"`
	Email     string         `json:"email"`
	Tracking  *TracingParams `json:"metadata,omitempty"`
}

type RegisterOutput struct {
	Verified bool
	Email    string
}
