export const AUTH_CONFIG = {
	EMAIL_OTP_LENGTH: 6,
	EMAIL_OTP_EXPIRE_IN: 10 * 60, // 10 minutes
	COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
	MAXIMUM_SESSIONS: 6,
	COOKIE_PREFIX: "zero-heads-auth",
	SESSION_TOKEN_NAME: "auth_session_token",
	DOMAIN: "zeroheads.local",
	RATE_LIMIT_WINDOW_IN_SECS: 60, // 60 seconds
	RATE_LIMIT_MAX_REQUESTS: 100,

	IMPERSONATION_SESSION_DURATION_IN_SECS: 60 * 60 * 6, // 6 hours

	JWT_ISSUER: "http://localhost:5001",
	JWT_AUDIENCE: "http://localhost:3000",
	JWT_EXPIRATION_TIME_IN_SECS: 60 * 60 * 1, // 1 hour
	JWT_ALGORITHM: "ES256" as const,
	JWKS_URL: "http://localhost:5001/.well-known/jwks.json",
};
