export type SessionStatus =
	| "active"
	| "revoked"
	| "expired"
	| "ended"
	| "suspended";

export type Session = {
	id: string;
	userId: string;
	identityId?: string | null;
	status: SessionStatus;
	provider?: string | null;
	authMethod?: string | null;
	sessionVersion: number;
	sessionTokenHash?: string | null;
	refreshFamilyId?: string | null;
	mfaVerified: boolean;
	elevatedUntil?: Date | null;
	ipAddress?: string | null;
	userAgent?: string | null;
	deviceName?: string | null;
	deviceType?: string | null;
	browser?: string | null;
	os?: string | null;
	location?: string | null;
	issuedAt: Date;
	lastSeenAt: Date;
	expiresAt: Date;
	revokedAt?: Date | null;
	revokeReason?: string | null;
	endedAt?: Date | null;
	cacheKey?: string | null;
	metadata: Record<string, unknown>;
	createdAt: Date;
	updatedAt: Date;
};
