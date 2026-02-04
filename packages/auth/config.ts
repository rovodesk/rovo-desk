export const AUTH_CONFIG = {
	EMAIL_OTP_LENGTH: 6,
	EMAIL_OTP_EXPIRE_IN: 10 * 60, // 10 minutes
	COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
	MAXIMUM_SESSIONS: 6,
	COOKIE_PREFIX: "zero-heads-auth",
	SESSION_TOKEN_NAME: "auth_session_token",
	RATE_LIMIT_WINDOW_IN_SECS: 60, // 60 seconds
	RATE_LIMIT_MAX_REQUESTS: 100,

	DASHBOARD_URL: "http://localhost:3001",

	IMPERSONATION_SESSION_DURATION_IN_SECS: 60 * 60 * 6, // 6 hours

	CORS: {
		origin: ["http://localhost:3001"],
		allowHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	},
};
