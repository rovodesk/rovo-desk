package schema

import "time"

type Password struct {
	ID string `gorm:"primaryKey"`

	UserID string `gorm:"not null;index"`

	Hash string `gorm:"not null"`

	ExpiresAt *time.Time `gorm:"index"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (Password) TableName() string {
	return "passwords"
}
