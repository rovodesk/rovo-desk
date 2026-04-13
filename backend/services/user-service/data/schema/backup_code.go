package schema

import (
	"time"

	"gorm.io/gorm"
)

type BackupCode struct {
	ID string `gorm:"primaryKey"`

	UserID string `gorm:"not null;index"`

	CodeHash string `gorm:"not null"`

	LastUsedAt *time.Time `gorm:"index"`

	CreatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (BackupCode) TableName() string {
	return "backup_codes"
}
