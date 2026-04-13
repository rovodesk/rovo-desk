package controllers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
)

type DocsController struct{}

func NewDocsController() *DocsController {
	return &DocsController{}
}

func (c *DocsController) Routes(r chi.Router) {
	// Unified Reference Route
	r.Get("/reference", c.unifiedHandler)

	// Legacy redirects
	r.Get("/reference/frontend", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/reference?api=frontend", http.StatusMovedPermanently)
	})
	r.Get("/reference/backend", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/reference?api=backend", http.StatusMovedPermanently)
	})
	r.Get("/reference/platform", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/reference?api=platform", http.StatusMovedPermanently)
	})

	// JSON Spec Routes
	r.Route("/docs", func(r chi.Router) {
		r.Get("/frontend/frontend_swagger.json", func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "./docs/frontend/frontend_swagger.json")
		})
		r.Get("/backend/backend_swagger.json", func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "./docs/backend/backend_swagger.json")
		})
		r.Get("/platform/platform_swagger.json", func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "./docs/platform/platform_swagger.json")
		})
	})
}
func (c *DocsController) unifiedHandler(w http.ResponseWriter, r *http.Request) {
	api := r.URL.Query().Get("api")
	if api == "" {
		api = "frontend"
	}

	var specURL string
	var title string
	switch strings.ToLower(api) {
	case "backend":
		specURL = "/docs/backend/backend_swagger.json"
		title = "Backend API"
	case "platform":
		specURL = "/docs/platform/platform_swagger.json"
		title = "Platform API"
	default:
		api = "frontend"
		specURL = "/docs/frontend/frontend_swagger.json"
		title = "Frontend API"
	}

	// Only one active color needed
	activeColor := "#334155"

	html := fmt.Sprintf(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trust None - %s</title>
    <style>
        body { margin: 0; background-color: #020617; }
        .api-switcher {
            background: #0f172a;
            color: #f8fafc;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #1e293b;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        .logo { font-weight: 700; font-size: 1.1rem; color: #38bdf8; }
        .tabs { display: flex; gap: 8px; }
        .tab-link {
            color: #94a3b8;
            text-decoration: none;
            padding: 6px 16px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.2s;
        }
        .tab-link:hover { color: #f8fafc; background: #1e293b; }
        .tab-active { color: #f8fafc; background: %s !important; }
    </style>
</head>
<body>
    <div class="api-switcher">
        <div class="logo">TrustNone User Service API</div>
        <div class="tabs">
            <a href="/reference?api=frontend" class="tab-link %s">Frontend</a>
            <a href="/reference?api=backend" class="tab-link %s">Backend</a>
            <a href="/reference?api=platform" class="tab-link %s">Platform</a>
        </div>
    </div>
    <script
        id="api-reference"
        data-url="%s"
        data-configuration='{"theme":"deepSpace", "darkMode": true}'
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>
`,
		title,
		activeColor,
		isTabActive(api, "frontend"),
		isTabActive(api, "backend"),
		isTabActive(api, "platform"),
		specURL,
	)

	w.Header().Set("Content-Type", "text/html")
	fmt.Fprint(w, html)
}

func isTabActive(current, target string) string {
	if current == target {
		return "tab-active"
	}
	return ""
}
