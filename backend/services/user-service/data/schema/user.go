package schema

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID string `gorm:"column:id;primaryKey"`

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`

	// Multi-tenant
	TenantID string `gorm:"column:tenant_id;not null;index"`

	// Profile
	FirstName string `gorm:"column:first_name"`
	LastName  string `gorm:"column:last_name"`

	AvatarURL string          `gorm:"column:avatar_url"`
	HasAvatar bool            `gorm:"column:has_avatar;default:false"`
	Metadata  json.RawMessage `gorm:"column:metadata;type:jsonb"`

	// Identifiers
	Username string `gorm:"column:username;index"`

	// Auth flags
	PasswordEnabled    bool `gorm:"column:password_enabled;default:false"`
	TwoFactorEnabled   bool `gorm:"column:two_factor_enabled;default:false"`
	TOTPEnabled        bool `gorm:"column:totp_enabled;default:false"`
	BackupCodesEnabled bool `gorm:"column:backup_codes_enabled;default:false"`

	// Relations (Aggregate)
	Emails      []EmailAddress `gorm:"foreignKey:UserID"`
	Identities  []Identity     `gorm:"foreignKey:UserID"`
	Passwords   []Password     `gorm:"foreignKey:UserID"`
	MFAFactors  []MFAFactor    `gorm:"foreignKey:UserID"`
	BackupCodes []BackupCode   `gorm:"foreignKey:UserID"`
}

func (User) TableName() string {
	return "users"
}
