import {
	type ISessionCacheRepository,
	SessionCacheRepository,
} from "./cache-repository";
import { type ISessionRepository, SessionRepository } from "./repository";
import type { AnonymousSession, AuthenticatedSession } from "./types";

const MAX_ACTIVE_SESSIONS = 10;
const LAST_SEEN_WRITE_THROTTLE_MS = 5 * 60 * 1000; // 5 min

export interface ISessionService {
	createSession(session: AuthenticatedSession): Promise<void>;
	getSession(sessionId: string): Promise<AuthenticatedSession | null>;
	ensureSessionExists(sessionId: string): Promise<void>;
	revokeSession(sessionId: string): Promise<void>;
	revokeAllSessions(userId: string): Promise<void>;
	listUserSessions(userId: string): Promise<AuthenticatedSession[]>;

	createAnonymousSession(session: AnonymousSession): Promise<void>;
	getAnonymousSession(accessToken: string): Promise<AnonymousSession | null>;
	revokeAnonymousSession(accessToken: string): Promise<void>;
}

export class SessionService implements ISessionService {
	constructor(
		private readonly repository: ISessionRepository = new SessionRepository(),
		private readonly cacheRepository: ISessionCacheRepository = new SessionCacheRepository()
	) {}

	/**
	 * Create a durable authenticated session.
	 * Enforces max 10 active sessions per user.
	 * If user already has 10 sessions, oldest session is revoked first.
	 */
	async createSession(session: AuthenticatedSession): Promise<void> {
		const activeSessions = await this.repository.listActiveSessionsByUserId(
			session.userId
		);

		if (activeSessions.length >= MAX_ACTIVE_SESSIONS) {
			const sessionsToRevoke = activeSessions.slice(
				0,
				activeSessions.length - MAX_ACTIVE_SESSIONS + 1
			);

			const revokedAt = new Date().toISOString();

			await Promise.all(
				sessionsToRevoke.map(async (s) => {
					await this.repository.revokeSession(s.sessionId, revokedAt);
					await this.cacheRepository.deleteSession(s.sessionId);
				})
			);
		}

		await this.repository.insertSession(session);
		await this.cacheRepository.saveSession(session);
	}

	/**
	 * Get session using cache-first, DB fallback.
	 */
	async getSession(sessionId: string): Promise<AuthenticatedSession | null> {
		const cached = await this.cacheRepository.findSessionById(sessionId);
		if (cached && this.isSessionActive(cached)) {
			return cached;
		}

		const persisted = await this.repository.findSessionById(sessionId);
		if (!(persisted && this.isSessionActive(persisted))) {
			if (cached) {
				await this.cacheRepository.deleteSession(sessionId);
			}
			return null;
		}

		await this.cacheRepository.saveSession(persisted);
		return persisted;
	}

	/**
	 * Sliding session touch.
	 * Cache is updated every request.
	 * DB is updated only if lastSeenAt is stale enough.
	 */
	async ensureSessionExists(sessionId: string): Promise<void> {
		const session = await this.getSession(sessionId);
		if (!session) return;

		const now = new Date();
		const nowIso = now.toISOString();

		const updated: AuthenticatedSession = {
			...session,
			lastSeenAt: nowIso,
		};

		await this.cacheRepository.saveSession(updated);

		const previousLastSeen = new Date(session.lastSeenAt).getTime();
		if (now.getTime() - previousLastSeen >= LAST_SEEN_WRITE_THROTTLE_MS) {
			await this.repository.updateLastSeenAt(sessionId, nowIso);
		}
	}

	/**
	 * Revoke one session
	 */
	async revokeSession(sessionId: string): Promise<void> {
		await this.repository.revokeSession(sessionId, new Date().toISOString());
		await this.cacheRepository.deleteSession(sessionId);
	}

	/**
	 * Revoke all sessions for a user
	 */
	async revokeAllSessions(userId: string): Promise<void> {
		const activeSessions =
			await this.repository.listActiveSessionsByUserId(userId);
		const revokedAt = new Date().toISOString();

		await this.repository.revokeAllSessions(userId, revokedAt);

		await Promise.all(
			activeSessions.map((s) => this.cacheRepository.deleteSession(s.sessionId))
		);
	}

	/**
	 * List active sessions for account/device management UI
	 */
	async listUserSessions(userId: string): Promise<AuthenticatedSession[]> {
		return this.repository.listActiveSessionsByUserId(userId);
	}

	/**
	 * Anonymous OTP / pre-auth session
	 */
	async createAnonymousSession(session: AnonymousSession): Promise<void> {
		await this.cacheRepository.saveAnonymousSession(session);
	}

	async getAnonymousSession(
		accessToken: string
	): Promise<AnonymousSession | null> {
		const session =
			await this.cacheRepository.findAnonymousSessionByAccessToken(accessToken);
		if (!session) return null;

		return session;
	}

	async revokeAnonymousSession(accessToken: string): Promise<void> {
		await this.cacheRepository.deleteAnonymousSession(accessToken);
	}

	private isSessionActive(session: AuthenticatedSession): boolean {
		const now = Date.now();
		const expiresAt = new Date(session.expiresAt).getTime();
		const revokedAt = session.revokedAt
			? new Date(session.revokedAt).getTime()
			: null;

		return expiresAt > now && revokedAt === null;
	}
}

export const sessionService = new SessionService();
