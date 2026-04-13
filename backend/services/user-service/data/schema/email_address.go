package schema

import (
	"time"

	"gorm.io/gorm"
)

type EmailAddress struct {
	ID string `gorm:"primaryKey"`

	UserID   string `gorm:"not null;index"`
	TenantID string `gorm:"not null;index"`

	Email string `gorm:"not null;uniqueIndex"`

	IsPrimary bool `gorm:"default:false"`
	Verified  bool `gorm:"default:false"`

	VerifiedAt *time.Time

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (EmailAddress) TableName() string {
	return "email_addresses"
}
