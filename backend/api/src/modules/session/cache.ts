import type {
	AnonymousSession,
	AuthenticatedSession,
} from "@zero-heads-lab/auth/types";
import {
	CacheCluster,
	expireInHours,
	expireInMinutes,
	StructKeyspace,
} from "encore.dev/storage/cache";

const cluster = CacheCluster.named("shared-cache");

const sessionCache = new StructKeyspace<
	{ sessionId: string },
	AuthenticatedSession
>(cluster, {
	keyPattern: "auth/session/:sessionId",
	defaultExpiry: expireInHours(24 * 7),
});

const anonymousSessionCache = new StructKeyspace<
	{ accessToken: string },
	AnonymousSession
>(cluster, {
	keyPattern: "auth/email-otp-login/:accessToken",
	defaultExpiry: expireInMinutes(10),
});

export interface ISessionCacheRepository {
	saveSession(session: AuthenticatedSession): Promise<void>;
	findSessionById(sessionId: string): Promise<AuthenticatedSession | null>;
	deleteSession(sessionId: string): Promise<void>;

	saveAnonymousSession(session: AnonymousSession): Promise<void>;
	findAnonymousSessionByAccessToken(
		accessToken: string
	): Promise<AnonymousSession | null>;
	deleteAnonymousSession(accessToken: string): Promise<void>;
}

export class SessionCacheRepository implements ISessionCacheRepository {
	async saveSession(session: AuthenticatedSession): Promise<void> {
		await sessionCache.set({ sessionId: session.sessionId }, session);
	}

	async findSessionById(
		sessionId: string
	): Promise<AuthenticatedSession | null> {
		return (await sessionCache.get({ sessionId })) ?? null;
	}

	async deleteSession(sessionId: string): Promise<void> {
		await sessionCache.delete({ sessionId });
	}

	async saveAnonymousSession(session: AnonymousSession): Promise<void> {
		await anonymousSessionCache.set(
			{ accessToken: session.accessToken },
			session
		);
	}

	async findAnonymousSessionByAccessToken(
		accessToken: string
	): Promise<AnonymousSession | null> {
		return (await anonymousSessionCache.get({ accessToken })) ?? null;
	}

	async deleteAnonymousSession(accessToken: string): Promise<void> {
		await anonymousSessionCache.delete({ accessToken });
	}
}
