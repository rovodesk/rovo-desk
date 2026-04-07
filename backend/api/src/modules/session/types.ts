export interface AuthenticatedSession {
	sessionId: string;
	userId: string;
	provider?: string | null;
	mfaVerified: boolean;
	createdAt: string;
	lastSeenAt: string;
	expiresAt: string;
	revokedAt?: string | null;

	ipAddress?: string | null;
	userAgent?: string | null;
	deviceName?: string | null;
}

export interface AnonymousSession {
	accessToken: string; // loginToken
	email: string;
	cognitoSession: string;
	challengeName?: string | null;
	createdAt: string;
}
