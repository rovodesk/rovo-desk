import { anonymousSessionCache, sessionCache } from "./cache";
import type { AnonymousSession, AuthenticatedSession } from "./types";

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
