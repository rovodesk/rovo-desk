package documents

import (
	"encoding/json"
	"time"
)

type GetDocumentResponse struct {
	ID        string          `json:"id"`
	Title     string          `json:"title"`
	Slug      string          `json:"slug"`
	Status    string          `json:"status"`
	Content   json.RawMessage `json:"content"`
	Version   int             `json:"version"`
	UpdatedAt time.Time       `json:"updated_at"`
}

type GetDraftResponse struct {
	DocumentID  string          `json:"document_id"`
	Content     json.RawMessage `json:"content"`
	VersionBase int             `json:"version_base"`
}

type SearchRequest struct {
	Query string `json:"query"`
}

type SearchResponse struct {
	Chunks []string `json:"chunks"`
}

type PublishDocumentRequest struct {
	DocumentID string `json:"document_id"`
}

type PublishDocumentResponse struct {
	PublishedURL string `json:"published_url"`
}

type CreateDocumentRequest struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

type TxResponse struct {
	TxID int64 `json:"txid"`
}
