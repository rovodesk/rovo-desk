import { createId } from "@paralleldrive/cuid2";
import type { SessionManager } from "@zero-heads-lab/auth";
import type { ICacheStore } from "@zero-heads-lab/cache";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { AuthServieEnv } from "@/types";

const DEFAULT_SESSION_TTL = 60 * 60 * 24 * 7; // 7 days
const SESSION_COOKIE_NAME = "zh_session";

export class KVSessionManager implements SessionManager {
	private readonly cacheStore: ICacheStore;
	private readonly sessionId: string;
	private readonly ttl = DEFAULT_SESSION_TTL;

	constructor(cache: ICacheStore, sessionId?: string) {
		this.sessionId = sessionId || createId();
		this.cacheStore = cache.withPrefix(`session:${this.sessionId}`);
	}

	async getSessionItem<T = unknown>(key: string): Promise<T | null> {
		return await this.cacheStore.get<T>(key);
	}

	async setSessionItem(key: string, value: unknown): Promise<void> {
		await this.cacheStore.set(key, value, this.ttl);
	}

	async removeSessionItem(key: string): Promise<void> {
		await this.cacheStore.delete(key);
	}

	async destroySession(): Promise<void> {
		let cursor: string | undefined;

		do {
			const result = await this.cacheStore.list({
				limit: 1000,
				cursor,
			});

			await Promise.all(
				result.keys.map((entry) =>
					this.cacheStore.delete(this.stripPrefix(entry.name))
				)
			);

			cursor = result.list_complete ? undefined : result.cursor;
		} while (cursor);
	}

	private stripPrefix(fullKey: string): string {
		const prefix = `session:${this.sessionId}:`;
		return fullKey.startsWith(prefix) ? fullKey.slice(prefix.length) : fullKey;
	}
}

export const getOrCreateSessionId = (c: Context<AuthServieEnv>) => {
	let sessionId = getCookie(c, SESSION_COOKIE_NAME);

	if (!sessionId) {
		sessionId = createId();

		setCookie(c, SESSION_COOKIE_NAME, sessionId, {
			httpOnly: true,
			secure: true,
			sameSite: "Lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});
	}

	return sessionId;
};

export const clearSessionCookie = (c: Context<AuthServieEnv>) => {
	setCookie(c, SESSION_COOKIE_NAME, "", {
		httpOnly: true,
		secure: true,
		sameSite: "Lax",
		path: "/",
		maxAge: 0,
	});
};

export const createSessionManager = (cacheStore: ICacheStore) => {
	return (c: Context<AuthServieEnv>) => {
		const sessionId = getOrCreateSessionId(c);
		return new KVSessionManager(cacheStore, sessionId);
	};
};
