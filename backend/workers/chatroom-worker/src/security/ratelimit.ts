import type { Connection } from "partyserver";
import { ACTOR_ROLE, type Env } from "../types";
import type { IRateLimiter } from "./adapter";
import { resolveRole } from "./auth";

type RateLimitOptions = {
	windowMs: number;
	limit: number | Partial<Record<ACTOR_ROLE, number>>;
	prefix?: string;
};

type RateLimitKeyFn = (connection: Connection) => string;

export class RateLimiter implements IRateLimiter {
	private env: Env;
	private options: RateLimitOptions;
	private keyFn: RateLimitKeyFn;

	constructor(env: Env, options: RateLimitOptions, keyFn?: RateLimitKeyFn) {
		this.env = env;
		this.options = options;
		this.keyFn = keyFn ?? ((conn) => conn.id);
	}

	private getLimit(connection: Connection): number {
		if (typeof this.options.limit === "number") {
			return this.options.limit;
		}

		const role = resolveRole(connection);
		return this.options.limit[role] ?? this.options.limit[ACTOR_ROLE.USER] ?? 5;
	}

	private buildKey(connection: Connection) {
		const base = this.keyFn(connection);
		const prefix = this.options.prefix ?? "rate";
		const role = resolveRole(connection);
		return `${prefix}:${role}:${base}`;
	}

	async allow(connection: Connection): Promise<boolean> {
		const key = this.buildKey(connection);
		const now = Date.now();

		const data = await this.env.Bindings.RATE_LIMIT_KV.get<{
			count: number;
			ts: number;
		}>(key, "json");

		// first request
		if (!data) {
			await this.env.Bindings.RATE_LIMIT_KV.put(
				key,
				JSON.stringify({ count: 1, ts: now }),
				{ expirationTtl: Math.ceil(this.options.windowMs / 1000) * 2 }
			);
			return true;
		}

		// window expired → reset
		if (now - data.ts > this.options.windowMs) {
			await this.env.Bindings.RATE_LIMIT_KV.put(
				key,
				JSON.stringify({ count: 1, ts: now }),
				{ expirationTtl: Math.ceil(this.options.windowMs / 1000) * 2 }
			);
			return true;
		}

		// limit reached
		const limit = this.getLimit(connection);
		if (data.count >= limit) {
			return false;
		}

		// increment
		await this.env.Bindings.RATE_LIMIT_KV.put(
			key,
			JSON.stringify({
				count: data.count + 1,
				ts: data.ts,
			}),
			{ expirationTtl: Math.ceil(this.options.windowMs / 1000) * 2 }
		);

		return true;
	}
}
