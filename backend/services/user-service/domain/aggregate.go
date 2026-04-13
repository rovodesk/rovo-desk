package domain

import (
	"time"
)

//////////////////////////////////////////////////////
// 👤 Aggregate Root: User
//////////////////////////////////////////////////////

type User struct {
	id       ID
	tenantID ID

	firstName string
	lastName  string
	username  Username

	emails     []Email
	password   *Password
	identities []Identity
	mfaFactors []MFAFactor
	backups    []BackupCode

	createdAt time.Time
	updatedAt time.Time
}

//////////////////////////////////////////////////////
// 🏗️ Constructor
//////////////////////////////////////////////////////

func NewUser(id, tenantID ID, username string) (*User, error) {
	un, err := NewUsername(username)
	if err != nil {
		return nil, err
	}

	now := time.Now()

	return &User{
		id:         id,
		tenantID:   tenantID,
		username:   un,
		emails:     []Email{},
		identities: []Identity{},
		mfaFactors: []MFAFactor{},
		backups:    []BackupCode{},
		createdAt:  now,
		updatedAt:  now,
	}, nil
}

//////////////////////////////////////////////////////
// 📧 EMAIL BEHAVIOR
//////////////////////////////////////////////////////

func (u *User) AddEmail(email string) error {
	e, err := NewEmail(email)
	if err != nil {
		return err
	}

	for _, existing := range u.emails {
		if existing.Value() == e.Value() {
			return ErrEmailExists
		}
	}

	u.emails = append(u.emails, e)
	u.touch()

	return nil
}

func (u *User) SetPrimaryEmail(email string) error {
	found := false

	for i := range u.emails {
		if u.emails[i].Value() == email {
			found = true
		}
	}

	if !found {
		return ErrEmailNotFound
	}

	// NOTE: "primary" should ideally be an Entity concern,
	// but for MVP we enforce uniqueness here.

	u.touch()
	return nil
}

//////////////////////////////////////////////////////
// 🔐 PASSWORD
//////////////////////////////////////////////////////

func (u *User) SetPassword(hash string) error {
	p, err := NewPassword(hash)
	if err != nil {
		return err
	}

	u.password = &p
	u.touch()

	return nil
}

func (u *User) HasPassword() bool {
	return u.password != nil
}

//////////////////////////////////////////////////////
// 🔗 IDENTITIES
//////////////////////////////////////////////////////

func (u *User) AddIdentity(provider, externalID string) error {
	identity, err := NewIdentity(provider, externalID)
	if err != nil {
		return err
	}

	for _, existing := range u.identities {
		if existing.Provider() == identity.Provider() &&
			existing.ExternalID() == identity.ExternalID() {
			return ErrIdentityExists
		}
	}

	u.identities = append(u.identities, identity)
	u.touch()

	return nil
}

//////////////////////////////////////////////////////
// 🔐 MFA
//////////////////////////////////////////////////////

func (u *User) EnableTOTP() (MFAFactor, error) {
	mfa, err := NewTOTP()
	if err != nil {
		return MFAFactor{}, err
	}

	u.mfaFactors = append(u.mfaFactors, mfa)
	u.touch()

	return mfa, nil
}

func (u *User) VerifyMFA(secret string, code string) error {
	for i := range u.mfaFactors {
		if u.mfaFactors[i].Secret() == secret {
			if u.mfaFactors[i].Verified() {
				return ErrMFAAlreadyVerified
			}
			return u.mfaFactors[i].Verify(code)
		}
	}
	return ErrMFAFactorNotFound
}

func (u *User) MFAEnabled() bool {
	for _, f := range u.mfaFactors {
		if f.Verified() {
			return true
		}
	}
	return false
}

//////////////////////////////////////////////////////
// 🧾 BACKUP CODES
//////////////////////////////////////////////////////

func (u *User) GenerateBackupCodes(n int) error {
	codes, err := GenerateBackupCodes(n)
	if err != nil {
		return err
	}

	u.backups = codes
	u.touch()

	return nil
}

func (u *User) UseBackupCode(code string) error {
	for i := range u.backups {
		if u.backups[i].Value() == code {
			if u.backups[i].IsUsed() {
				return ErrBackupCodeUsed
			}
			return u.backups[i].Use()
		}
	}
	return ErrBackupCodeNotFound
}

//////////////////////////////////////////////////////
// 🧠 PROFILE
//////////////////////////////////////////////////////

func (u *User) SetName(first, last string) {
	u.firstName = first
	u.lastName = last
	u.touch()
}

//////////////////////////////////////////////////////
// 🔍 READ MODELS (Getters)
//////////////////////////////////////////////////////

func (u *User) ID() string             { return u.id.String() }
func (u *User) TenantID() string       { return u.tenantID.String() }
func (u *User) Username() string       { return u.username.Value() }
func (u *User) Emails() []Email        { return append([]Email{}, u.emails...) }
func (u *User) Identities() []Identity { return append([]Identity{}, u.identities...) }

//////////////////////////////////////////////////////
// 🕒 INTERNAL
//////////////////////////////////////////////////////

func (u *User) touch() {
	u.updatedAt = time.Now()
}
