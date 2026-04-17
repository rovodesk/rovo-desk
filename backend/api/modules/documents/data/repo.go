package data

import (
	"context"

	"gorm.io/gorm"
)

type Repository interface {
	// Document
	CreateDocument(ctx context.Context, doc *Document) error
	GetDocumentByID(ctx context.Context, id string) (*Document, error)
	ListDocumentsByWorkspace(ctx context.Context, workspaceID string) ([]Document, error)
	UpdateDocument(ctx context.Context, doc *Document) error
	DeleteDocument(ctx context.Context, id string) error

	// // Versions
	// CreateVersion(ctx context.Context, v *DocumentVersion) error
	// GetVersions(ctx context.Context, documentID string) ([]DocumentVersion, error)

	// // Drafts
	// UpsertDraft(ctx context.Context, draft *DocumentDraft) error
	// GetDraft(ctx context.Context, documentID string) (*DocumentDraft, error)

	// // Chunks (RAG critical)
	// CreateChunks(ctx context.Context, chunks []DocumentChunk) error
	// GetChunksByDocument(ctx context.Context, documentID string) ([]DocumentChunk, error)
}

type repo struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) (Repository, error) {
	return &repo{db: db}, nil
}
func (r *repo) CreateDocument(ctx context.Context, doc *Document) error {
	return r.db.WithContext(ctx).Create(doc).Error
}

func (r *repo) GetDocumentByID(ctx context.Context, id string) (*Document, error) {
	var doc Document
	err := r.db.WithContext(ctx).
		Preload("Versions").
		First(&doc, "id = ?", id).Error
	return &doc, err
}

func (r *repo) ListDocumentsByWorkspace(ctx context.Context, workspaceID string) ([]Document, error) {
	var docs []Document
	err := r.db.WithContext(ctx).
		Where("workspace_id = ?", workspaceID).
		Order("created_at DESC").
		Find(&docs).Error
	return docs, err
}

func (r *repo) UpdateDocument(ctx context.Context, doc *Document) error {
	return r.db.WithContext(ctx).Save(doc).Error
}

func (r *repo) DeleteDocument(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&Document{}, "id = ?", id).Error
}
