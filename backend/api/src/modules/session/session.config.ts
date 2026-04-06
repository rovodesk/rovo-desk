export const SessionConfig = {
	cookieName: "rovodesk_session",
	cookieDomain: "localhost",
	cookieSecure: false, // true in prod
	cookieSameSite: "lax" as const,
	maxAge: 60 * 60 * 24 * 7, // 7 days
};
