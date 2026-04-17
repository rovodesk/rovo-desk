package openapi

import (
	"context"
	"os"

	"encore.dev/rlog"
)

type DocsResponse struct {
	HTML string
}

// GetOpenAPIDocs returns the OpenAPI documentation as an HTML string.
//
// encore:api method=GET path=/docs
func GetOpenAPIDocs(ctx context.Context) (*DocsResponse, error) {
	data, err := os.ReadFile("docs/index.html")
	if err != nil {
		rlog.Error("failed to read docs", "error", err)
		return nil, err
	}

	return &DocsResponse{
		HTML: string(data),
	}, nil
}
