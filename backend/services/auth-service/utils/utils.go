package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func WriteJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func ReadJSON(r *http.Request, v any) error {
	return json.NewDecoder(r.Body).Decode(v)
}

func GetTenantID(r *http.Request) string {
	return r.Header.Get("X-Tenant-ID")
}

func Ptr(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func QueryInt(r *http.Request, key string, def int) int {
	val := r.URL.Query().Get(key)
	if val == "" {
		return def
	}
	parsed, err := strconv.Atoi(val)
	if err != nil {
		return def
	}
	return parsed
}

func sign(data []byte, secret []byte) string {
	mac := hmac.New(sha256.New, secret)
	mac.Write(data)
	return base64.StdEncoding.EncodeToString(mac.Sum(nil))
}

func SetCookie(w http.ResponseWriter, cookieSecret []byte, name string, value any, ttl time.Duration) error {
	raw, err := json.Marshal(value)
	if err != nil {
		return err
	}

	encoded := base64.StdEncoding.EncodeToString(raw)

	sig := sign(raw, cookieSecret)
	payload := encoded + "." + sig

	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    payload,
		HttpOnly: true,
		Secure:   true,
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(ttl),
	})

	return nil
}

func GetCookie(r *http.Request, name string, secret []byte, dest any) error {
	cookie, err := r.Cookie(name)
	if err != nil {
		return err
	}

	parts := strings.Split(cookie.Value, ".")
	if len(parts) != 2 {
		return fmt.Errorf("invalid cookie format")
	}

	encoded, sig := parts[0], parts[1]

	raw, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return err
	}

	expectedSig := sign(raw, secret)

	// Constant-time comparison
	if !hmac.Equal([]byte(sig), []byte(expectedSig)) {
		return fmt.Errorf("invalid cookie signature")
	}

	if err := json.Unmarshal(raw, dest); err != nil {
		return err
	}

	return nil
}

func DeleteCookie(w http.ResponseWriter, name string) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0), // ensures deletion across browsers
	})
}
