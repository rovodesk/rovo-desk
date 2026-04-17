package jwt

import (
	"fmt"
	"time"

	"github.com/MicahParks/keyfunc/v2"
	"github.com/golang-jwt/jwt/v5"
)

type JwtPayload struct {
	Sub         string         `json:"sub"`
	Iss         string         `json:"iss"`
	Aud         any            `json:"aud"`
	Exp         int64          `json:"exp"`
	Iat         int64          `json:"iat"`
	Email       *string        `json:"email,omitempty"`
	OrgCode     *string        `json:"org_code,omitempty"`
	Permissions []string       `json:"permissions,omitempty"`
	Roles       []string       `json:"roles,omitempty"`
	Raw         map[string]any `json:"-"`
}

func createJWKSURL(issuer string) string {
	return issuer + "/.well-known/jwks.json"
}

// ----------------------
// Verify JWT (like jose.jwtVerify)
// ----------------------

func VerifyJWTToken(issuer, audience, token string) (*JwtPayload, error) {
	if issuer == "" {
		return nil, fmt.Errorf("issuer is required")
	}
	if token == "" {
		return nil, fmt.Errorf("token is required")
	}

	// Create Remote JWKS
	jwksURL := createJWKSURL(issuer)

	// Get JWKS from Remote
	jwks, err := keyfunc.Get(jwksURL, keyfunc.Options{
		RefreshInterval: 0, // can tune later
	})
	if err != nil {
		return nil, err
	}

	// Parse JWT Token
	parsed, err := jwt.Parse(token, jwks.Keyfunc)
	if err != nil {
		return nil, err
	}

	// Validate JWT Token
	if !parsed.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	// Get Claims
	claimsMap, ok := parsed.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid claims")
	}

	// Validate issuer
	if claimsMap["iss"] != issuer {
		return nil, fmt.Errorf("invalid issuer")
	}

	// Validate audience
	if audience != "" {
		switch aud := claimsMap["aud"].(type) {
		case string:
			if aud != audience {
				return nil, fmt.Errorf("invalid audience")
			}
		}
	}

	// Validate Expiry
	if exp, ok := claimsMap["exp"].(float64); ok {
		if exp < float64(time.Now().Add(-5*time.Minute).Unix()) {
			return nil, fmt.Errorf("token has expired")
		}
	}

	// Create Payload
	payload := &JwtPayload{
		Raw: map[string]interface{}(claimsMap),
	}

	// Map fields safely
	if v, ok := claimsMap["sub"].(string); ok {
		payload.Sub = v
	}
	if v, ok := claimsMap["iss"].(string); ok {
		payload.Iss = v
	}
	if v, ok := claimsMap["exp"].(float64); ok {
		payload.Exp = int64(v)
	}
	if v, ok := claimsMap["iat"].(float64); ok {
		payload.Iat = int64(v)
	}
	if v, ok := claimsMap["email"].(string); ok {
		payload.Email = &v
	}

	return payload, nil
}

// ----------------------
// Decode only (like jose.decodeJwt)
// ----------------------

func DecodeJWTToken(token string) (*JwtPayload, error) {
	parsed, _, err := new(jwt.Parser).ParseUnverified(token, jwt.MapClaims{})
	if err != nil {
		return nil, err
	}

	claimsMap := parsed.Claims.(jwt.MapClaims)

	payload := &JwtPayload{
		Raw: map[string]interface{}(claimsMap),
	}

	if v, ok := claimsMap["sub"].(string); ok {
		payload.Sub = v
	}
	if v, ok := claimsMap["exp"].(float64); ok {
		payload.Exp = int64(v)
	}

	return payload, nil
}
