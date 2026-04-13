{
	"id": "rovo-desk-q6ui",
	"lang": "typescript",
	"build": {
		"docker": {
			"bundle_source": true
		}
	},
	"debug": true,
	"allow_headers": [
		"Content-Type",
		"Authorization",
		"X-Requested-With",
		"X-CSRF-Token"
	],
	"expose_headers": [
		"Content-Type",
		"Set-Cookie"
	],
	"allow_origins_without_credentials": [
		"*"
	],
	"allow_origins_with_credentials": [
		"http://localhost:3000",
		"http://localhost:5173",
		"http://localhost:4173",
		"https://app.rovodesk.com",
		"https://admin.rovodesk.com",
		"https://auth.rovodesk.com",
		"https://*.rovodesk.com"
	]
}
