package domain

import (
	"crypto/rand"
	"encoding/base32"
	"encoding/hex"
	"fmt"
	"regexp"
	"strings"
	"time"
)

var (
	emailRegex    = regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`)
	usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_\-]{3,30}$`)
	backupRegex   = regexp.MustCompile(`^[a-f0-9]{4}-[a-f0-9]{4}$`)
)

//////////////////////////////////////////////////////
// 🆔 ID (Generic Strong ID)
//////////////////////////////////////////////////////

type ID string

func NewID() ID {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return ID(hex.EncodeToString(b))
}

func (id ID) String() string {
	return string(id)
}

//////////////////////////////////////////////////////
// 📧 Email
//////////////////////////////////////////////////////

type Email struct {
	value string
}

func NewEmail(v string) (Email, error) {
	clean := strings.ToLower(strings.TrimSpace(v))
	if !emailRegex.MatchString(clean) {
		return Email{}, fmt.Errorf("invalid email: %s", v)
	}
	return Email{value: clean}, nil
}

func (e Email) Value() string  { return e.value }
func (e Email) Domain() string { return strings.Split(e.value, "@")[1] }
func (e Email) String() string { return e.value }

//////////////////////////////////////////////////////
// 👤 Username
//////////////////////////////////////////////////////

type Username struct {
	value string
}

func NewUsername(v string) (Username, error) {
	clean := strings.TrimSpace(v)
	if !usernameRegex.MatchString(clean) {
		return Username{}, ErrInvalidUsername
	}
	return Username{value: clean}, nil
}

func (u Username) Value() string  { return u.value }
func (u Username) String() string { return u.value }

//////////////////////////////////////////////////////
// 🔐 Password (HASH ONLY)
//////////////////////////////////////////////////////

type Password struct {
	hash      string
	createdAt time.Time
}

func NewPassword(hash string) (Password, error) {
	if len(hash) < 20 {
		return Password{}, ErrInvalidPasswordHash
	}
	return Password{
		hash:      hash,
		createdAt: time.Now(),
	}, nil
}

func (p Password) Hash() string { return p.hash }

//////////////////////////////////////////////////////
// 🌐 Identity Provider
//////////////////////////////////////////////////////

type IdentityProvider string

const (
	Google  IdentityProvider = "google"
	GitHub  IdentityProvider = "github"
	Okta    IdentityProvider = "okta"
	AzureAD IdentityProvider = "azure-ad"
	EmailPW IdentityProvider = "email_password"
)

//////////////////////////////////////////////////////
// 🔗 Identity (Value Object)
//////////////////////////////////////////////////////

type Identity struct {
	provider   IdentityProvider
	externalID string
}

func NewIdentity(provider string, extID string) (Identity, error) {
	p := IdentityProvider(strings.ToLower(provider))

	switch p {
	case Google, GitHub, Okta, AzureAD, EmailPW:
		if extID == "" {
			return Identity{}, ErrExternalIdRequired
		}
		return Identity{provider: p, externalID: extID}, nil
	default:
		return Identity{}, fmt.Errorf("unsupported provider: %s", provider)
	}
}

func (i Identity) Provider() string   { return string(i.provider) }
func (i Identity) ExternalID() string { return i.externalID }

//////////////////////////////////////////////////////
// 🔐 MFA
//////////////////////////////////////////////////////

type MFAFactorType string

const (
	TOTP     MFAFactorType = "totp"
	Push     MFAFactorType = "push"
	WebAuthn MFAFactorType = "webauthn"
)

type MFAFactor struct {
	secret   string // base32 encoded
	factor   MFAFactorType
	verified bool
}

func NewTOTP() (MFAFactor, error) {
	// 20 bytes = strong secret
	b := make([]byte, 20)
	if _, err := rand.Read(b); err != nil {
		return MFAFactor{}, err
	}

	secret := base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(b)

	return MFAFactor{
		secret:   secret,
		factor:   TOTP,
		verified: false,
	}, nil
}

func (m *MFAFactor) Verify(code string) error {
	// Stub (replace with real TOTP validation)
	if len(code) != 6 {
		return ErrInvalidMFACode
	}
	m.verified = true
	return nil
}

func (m MFAFactor) Secret() string { return m.secret }
func (m MFAFactor) Type() string   { return string(m.factor) }
func (m MFAFactor) Verified() bool { return m.verified }

//////////////////////////////////////////////////////
// 🧾 Backup Codes
//////////////////////////////////////////////////////

type BackupCode struct {
	code string
	used bool
}

func NewBackupCode(v string) (BackupCode, error) {
	clean := strings.ToLower(strings.TrimSpace(v))
	if !backupRegex.MatchString(clean) {
		return BackupCode{}, ErrInvalidBackupCode
	}
	return BackupCode{code: clean}, nil
}

func GenerateBackupCodes(n int) ([]BackupCode, error) {
	res := make([]BackupCode, n)

	for i := 0; i < n; i++ {
		b := make([]byte, 4)
		if _, err := rand.Read(b); err != nil {
			return nil, err
		}

		raw := hex.EncodeToString(b)
		formatted := raw[:4] + "-" + raw[4:]

		res[i] = BackupCode{
			code: formatted,
			used: false,
		}
	}

	return res, nil
}

func (b *BackupCode) Use() error {
	if b.used {
		return ErrBackupCodeUsed
	}
	b.used = true
	return nil
}

func (b BackupCode) Value() string { return b.code }
func (b BackupCode) IsUsed() bool  { return b.used }
