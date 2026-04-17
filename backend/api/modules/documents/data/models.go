package data

import (
	"time"

	"gorm.io/gorm"
)

type DocumentStatus string

const (
	DocumentStatusDraft     DocumentStatus = "draft"
	DocumentStatusPublished DocumentStatus = "published"
	DocumentStatusArchived  DocumentStatus = "archived"
)

type Document struct {
	ID          string         `gorm:"type:text;primaryKey"`
	WorkspaceID string         `gorm:"type:text;index;not null"`
	Title       string         `gorm:"type:text;not null"`
	Slug        string         `gorm:"type:text;index"`
	Status      DocumentStatus `gorm:"type:text;index;default:'draft'"`

	CurrentVersionID *string `gorm:"type:text;index"`

	CreatedBy string `gorm:"type:text;index"`

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`

	Versions []DocumentVersion `gorm:"foreignKey:DocumentID"`
	Drafts   []DocumentDraft   `gorm:"foreignKey:DocumentID"`
}

type DocumentVersion struct {
	ID         string `gorm:"type:text;primaryKey"`
	DocumentID string `gorm:"type:text;index;not null"`

	VersionNumber int  `gorm:"not null"`
	IsPublished   bool `gorm:"default:false;index"`

	Title   string                 `gorm:"type:text"`
	Content map[string]interface{} `gorm:"type:jsonb;not null"`

	CreatedBy string `gorm:"type:text;index"`

	CreatedAt time.Time

	// Constraints
	// UNIQUE(document_id, version_number)
}

type DocumentDraft struct {
	ID         string `gorm:"type:text;primaryKey"`
	DocumentID string `gorm:"type:text;index;not null"`

	Content map[string]interface{} `gorm:"type:jsonb;not null"`

	VersionBase int `gorm:"not null"`

	CreatedBy string `gorm:"type:text;index"`

	LastSyncedAt time.Time
	UpdatedAt    time.Time
}

type DocumentChunk struct {
	ID string `gorm:"type:text;primaryKey"`

	DocumentID string `gorm:"type:text;index;not null"`
	VersionID  string `gorm:"type:text;index;not null"`

	ChunkIndex int    `gorm:"index"`
	Content    string `gorm:"type:text;not null"`

	VectorID       string                 `gorm:"type:text;index"` // Vectorize ID
	EmbeddingModel string                 `gorm:"type:text"`
	Metadata       map[string]interface{} `gorm:"type:jsonb"`

	CreatedAt time.Time
}

type DocumentEvent struct {
	ID         string `gorm:"type:text;primaryKey"`
	DocumentID string `gorm:"type:text;index;not null"`

	EventType string `gorm:"type:text;index"` // created, updated, published

	ActorID string                 `gorm:"type:text;index"`
	Payload map[string]interface{} `gorm:"type:jsonb"`

	CreatedAt time.Time
}

type DocumentView struct {
	ID int64 `gorm:"primaryKey;autoIncrement"`

	DocumentID string `gorm:"type:text;index;not null"`

	UserID    *string `gorm:"type:text;index"`
	SessionID *string `gorm:"type:text;index"`

	Source   string                 `gorm:"type:text;index"` // ai, search, direct
	Metadata map[string]interface{} `gorm:"type:jsonb"`

	CreatedAt time.Time `gorm:"index"`
}

// type AIQuery struct {
// 	ID string `gorm:"type:text;primaryKey`

// 	WorkspaceID string `gorm:"type:text;index"`

// 	Query string `gorm:"type:text;not null"`

// 	Response        string                 `gorm:"type:text"`
// 	RetrievedChunks map[string]interface{} `gorm:"type:jsonb"`

// 	LatencyMs int
// 	Success   bool `gorm:"index"`

// 	CreatedAt time.Time `gorm:"index"`
// }

// type AIFeedback struct {
// 	ID string `gorm:"type:text;primaryKey`

// 	QueryID string `gorm:"type:text;index"`

// 	Rating   int
// 	Feedback string `gorm:"type:text"`

// 	CreatedAt time.Time
// }

// type CollaborationSession struct {
// 	ID string `gorm:"type:text;primaryKey`

// 	DocumentID string `gorm:"type:text;index"`
// 	UserID     string `gorm:"type:text;index"`

// 	StartedAt    time.Time
// 	LastActiveAt time.Time
// }

var Models = []any{
	&Document{},
	&DocumentVersion{},
	&DocumentDraft{},
	&DocumentChunk{},
	&DocumentEvent{},
	&DocumentView{},
}
