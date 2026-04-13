package user

import (
	"time"

	"github.com/trust-none/user-service/data/schema"
	"github.com/trust-none/user-service/domain"
)

//////////////////////////////////////////////////////
// 🔁 TO DOMAIN
//////////////////////////////////////////////////////

func ToDomainUser(s *schema.User) (*domain.User, error) {
	u, err := domain.NewUser(
		domain.ID(s.ID),
		domain.ID(s.TenantID),
		s.Username,
	)
	if err != nil {
		return nil, err
	}

	u.SetName(s.FirstName, s.LastName)

	// Emails
	for _, e := range s.Emails {
		_ = u.AddEmail(e.Email) // ignore dup errors for now
	}

	// Password (only latest assumed)
	if len(s.Passwords) > 0 {
		_ = u.SetPassword(s.Passwords[0].Hash)
	}

	// Identities
	for _, i := range s.Identities {
		_ = u.AddIdentity(i.Provider, i.ProviderUserID)
	}

	// MFA
	for _, _ = range s.MFAFactors {
		mfa := domain.MFAFactor{}
		// NOTE: we bypass constructor since it's already stored
		// ideally expose a "rehydrate" constructor in domain
		_ = mfa.Verify("000000") // stub or skip
		u.EnableTOTP()
	}

	// Backup codes
	for _, b := range s.BackupCodes {
		u.GenerateBackupCodes(0) // reset
		_ = u.UseBackupCode(b.CodeHash)
	}

	return u, nil
}

func ToSchemaUser(u *domain.User) *schema.User {
	now := time.Now()

	s := &schema.User{
		ID:        u.ID(),
		TenantID:  u.TenantID(),
		Username:  u.Username(),
		CreatedAt: now,
		UpdatedAt: now,
	}

	// Emails
	for _, e := range u.Emails() {
		s.Emails = append(s.Emails, schema.EmailAddress{
			ID:     string(domain.NewID()),
			UserID: u.ID(),
			Email:  e.Value(),
		})
	}

	// Identities
	for _, i := range u.Identities() {
		s.Identities = append(s.Identities, schema.Identity{
			ID:             string(domain.NewID()),
			UserID:         u.ID(),
			Provider:       i.Provider(),
			ProviderUserID: i.ExternalID(),
		})
	}

	return s
}

func ToResponseUser(u *domain.User) *UserResponse {
	res := &UserResponse{
		ID:         u.ID(),
		TenantID:   u.TenantID(),
		Username:   u.Username(),
		CreatedAt:  time.Now().Format(time.RFC3339),
		MFAEnabled: u.MFAEnabled(),
	}

	// Emails
	for _, e := range u.Emails() {
		res.Emails = append(res.Emails, e.Value())
	}

	// Identities
	for _, i := range u.Identities() {
		res.Identities = append(res.Identities, i.Provider())
	}

	return res
}
