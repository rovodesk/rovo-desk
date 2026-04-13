package schema

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Identity struct {
	ID string `gorm:"primaryKey"`

	UserID   string `gorm:"not null;index"`
	TenantID string `gorm:"not null;index"`

	Provider       string `gorm:"not null;index"` // google, github
	ProviderUserID string `gorm:"not null;index"`

	Type string `gorm:"index"` // oauth, password, saml

	Metadata json.RawMessage `gorm:"type:jsonb"`

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (Identity) TableName() string {
	return "identities"
}
