package documents

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"hash/fnv"
	"io"

	"net/http"
	"net/url"

	"encore.dev/beta/errs"
	"encore.dev/rlog"
	"gorm.io/gorm"

	data "github.com/zero-heads-lab/api/modules/documents/data"
	"github.com/zero-heads-lab/api/pkg/database"
)

//encore:service
type Service struct {
	db            *gorm.DB
	electricNodes []string // multiple instances
}

var secrets struct {
	DATABASE_URL string
}

func initService() (*Service, error) {
	db, err := database.Conn(context.Background(), secrets.DATABASE_URL)
	if err != nil {
		rlog.Error("failed to connect to database", "err", err)
		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: "failed to connect to database",
		}
	}

	return &Service{
		db: db,
		electricNodes: []string{
			"http://electric-1:8080/v1/shape",
			"http://electric-2:8080/v1/shape",
			"http://electric-3:8080/v1/shape",
		}}, nil
}

// Electric protocol query params (mirror from client)
var electricProtocolQueryParams = map[string]bool{
	"live":         true,
	"cursor":       true,
	"handle":       true,
	"offset":       true,
	"limit":        true,
	"experimental": true,
}

func (s *Service) pickNode(key string) string {
	h := fnv.New32a()
	h.Write([]byte(key))
	idx := int(h.Sum32()) % len(s.electricNodes)
	return s.electricNodes[idx]
}

func (s *Service) buildRoutingKey(r *http.Request) string {
	return r.URL.Query().Get("table") +
		r.URL.Query().Get("where") +
		r.Header.Get("Authorization")
}

func (s *Service) getTxID(tx *gorm.DB) (int64, error) {
	var txid int64

	err := tx.Raw(`SELECT pg_current_xact_id()::xid::text`).Scan(&txid).Error
	if err != nil {
		return 0, err
	}

	return txid, nil
}

//encore:api public method=POST path=/docs
func (s *Service) CreateDocument(ctx context.Context, req *CreateDocumentRequest) (*TxResponse, error) {
	var txid int64

	err := s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		doc := data.Document{
			ID:    req.ID,
			Title: req.Title,
		}

		if err := tx.Create(&doc).Error; err != nil {
			return err
		}

		var err error
		txid, err = s.getTxID(tx)
		return err
	})

	if err != nil {
		return nil, err
	}

	return &TxResponse{TxID: txid}, nil
}

// Stream documents from Electric over HTTP
//
//encore:api public raw
func (s *Service) ServeDocuments(w http.ResponseWriter, r *http.Request) {
	// TODO: add auth check here

	// Parse incoming request URL
	reqURL := r.URL
	rlog.Info("Electric Proxy Request", "url", reqURL.String())

	// 1. Build routing key
	routingKey := s.buildRoutingKey(r)

	// 2. Pick Electric node
	targetBase := s.pickNode(routingKey)

	originURL, err := url.Parse(targetBase)
	if err != nil {
		http.Error(w, "Invalid upstream", http.StatusInternalServerError)
		return
	}

	// Copy allowed query params
	query := originURL.Query()
	for key, values := range reqURL.Query() {
		if electricProtocolQueryParams[key] {
			for _, v := range values {
				query.Set(key, v)
			}
		}
	}

	// Set required params
	query.Set("table", "documents")
	// Optional filters
	// query.Set("where", "completed = true")
	// query.Set("columns", "id,text,completed")

	originURL.RawQuery = query.Encode()

	// 5. Create upstream request
	proxyReq, err := http.NewRequestWithContext(r.Context(), "GET", originURL.String(), nil)
	if err != nil {
		http.Error(w, "Failed to create request", http.StatusInternalServerError)
		return
	}

	// Forward headers (important for auth + caching)
	proxyReq.Header = r.Header.Clone()

	// 6. Streaming client (IMPORTANT)
	resp, err := http.DefaultClient.Do(proxyReq)
	if err != nil {
		http.Error(w, "Upstream failed", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// 7. Copy headers safely
	for key, values := range resp.Header {
		if key == "Content-Encoding" || key == "Content-Length" {
			continue
		}
		for _, v := range values {
			w.Header().Add(key, v)
		}
	}

	// Write status
	w.WriteHeader(resp.StatusCode)

	// 8. STREAM (critical for Electric live queries)
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	buf := make([]byte, 32*1024)

	for {
		n, err := resp.Body.Read(buf)
		if n > 0 {
			w.Write(buf[:n])
			flusher.Flush() // 🔥 THIS enables realtime streaming
		}
		if err != nil {
			if err == io.EOF {
				break
			}
			rlog.Error("stream error", "err", err)
			break
		}
	}
}

// GetDocument retrieves a document by id.
//
//encore:api public method=GET path=/docs/:id
func (s *Service) GetDocument(ctx context.Context, id string) (*GetDocumentResponse, error) {
	var doc data.Document

	// 1. Fetch document
	if err := s.db.WithContext(ctx).
		Where("id = ? AND deleted_at IS NULL", id).
		First(&doc).Error; err != nil {

		if err == gorm.ErrRecordNotFound {
			return nil, &errs.Error{
				Code:    errs.NotFound,
				Message: "document not found",
			}
		}

		rlog.Error("failed to fetch document", "err", err)
		return nil, err
	}

	// 2. Ensure published version exists
	if doc.CurrentVersionID == nil {
		return nil, &errs.Error{
			Code:    errs.NotFound,
			Message: "document is not published",
		}
	}

	// 3. Fetch version
	var version data.DocumentVersion
	if err := s.db.WithContext(ctx).
		Where("id = ? AND is_published = true", *doc.CurrentVersionID).
		First(&version).Error; err != nil {

		rlog.Error("failed to fetch document version", "err", err)
		return nil, err
	}

	contentBytes, err := json.Marshal(version.Content)
	if err != nil {
		rlog.Error("failed to marshal content", "err", err)
		return nil, err
	}

	// 4. Build response
	return &GetDocumentResponse{
		ID:        doc.ID,
		Title:     version.Title,
		Slug:      doc.Slug,
		Status:    string(doc.Status),
		Content:   contentBytes,
		Version:   version.VersionNumber,
		UpdatedAt: doc.UpdatedAt,
	}, nil
}

// FIXME: replace public with auth
//
//encore:api public method=GET path=/docs/:id/draft
func (s *Service) GetDraft(ctx context.Context, id string) (*GetDraftResponse, error) {
	var draft data.DocumentDraft

	if err := s.db.WithContext(ctx).
		Where("document_id = ?", id).
		Order("updated_at DESC").
		First(&draft).Error; err != nil {

		if err == gorm.ErrRecordNotFound {
			return nil, &errs.Error{
				Code:    errs.NotFound,
				Message: "draft not found",
			}
		}
		return nil, err
	}

	contentBytes, err := json.Marshal(draft.Content)
	if err != nil {
		rlog.Error("failed to marshal content", "err", err)
		return nil, err
	}

	return &GetDraftResponse{
		DocumentID:  draft.DocumentID,
		Content:     contentBytes,
		VersionBase: draft.VersionBase,
	}, nil
}

// FIXME: replace public with auth
//
//encore:api public method=POST path=/docs/publish
func (s *Service) PublishDocument(ctx context.Context, req *PublishDocumentRequest) (*PublishDocumentResponse, error) {
	err := s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {

		var draft data.DocumentDraft
		if err := tx.Where("document_id = ?", req.DocumentID).
			Order("updated_at DESC").
			First(&draft).Error; err != nil {
			return err
		}

		// 1. Get latest version number
		var latest data.DocumentVersion
		tx.Where("document_id = ?", req.DocumentID).
			Order("version_number DESC").
			First(&latest)

		newVersionNumber := latest.VersionNumber + 1

		// 2. Create new version
		version := data.DocumentVersion{
			DocumentID:    req.DocumentID,
			VersionNumber: newVersionNumber,
			IsPublished:   true,
			Content:       draft.Content,
		}

		if err := tx.Create(&version).Error; err != nil {
			return err
		}

		// 3. Update document pointer
		if err := tx.Model(&data.Document{}).
			Where("id = ?", req.DocumentID).
			Updates(map[string]interface{}{
				"current_version_id": version.ID,
				"status":             data.DocumentStatusPublished,
			}).Error; err != nil {
			return err
		}

		// TODO: enqueue embedding job (IMPORTANT)
		// enqueueChunkingJob(version.ID)

		return nil
	})
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: err.Error(),
		}
	}
	return &PublishDocumentResponse{
		PublishedURL: rand.Text(),
	}, nil
}

//encore:api public method=POST path=/docs/search
func (s *Service) Search(ctx context.Context, req *SearchRequest) (*SearchResponse, error) {

	// 1. Embed query (Workers AI) → done outside or via client

	// 2. Query Vectorize → returns chunk IDs
	// (pseudo)
	// results := vectorize.Search(req.QueryEmbedding)

	// 3. Fetch metadata from PG
	var chunks []data.DocumentChunk

	// Example placeholder:
	if err := s.db.WithContext(ctx).
		Limit(5).
		Find(&chunks).Error; err != nil {
		return nil, err
	}

	var contents []string
	for _, c := range chunks {
		contents = append(contents, c.Content)
	}

	return &SearchResponse{
		Chunks: contents,
	}, nil
}
