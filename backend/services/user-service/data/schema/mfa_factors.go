package schema

import (
	"time"

	"gorm.io/gorm"
)

type MFAFactor struct {
	ID string `gorm:"primaryKey"`

	UserID string `gorm:"not null;index"`

	Type string `gorm:"not null;index"` // totp, sms

	Secret string `gorm:"not null"`

	IsVerified bool `gorm:"default:false"`

	CreatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (MFAFactor) TableName() string {
	return "mfa_factors"
}
