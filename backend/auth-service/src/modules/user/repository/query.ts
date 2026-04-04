/** biome-ignore-all lint/suspicious/useAwait: no await */

import type { ICacheStore } from "@zero-heads-lab/cache";
import { type Database, eq } from "@zero-heads-lab/database";
import { user as userSchema } from "@zero-heads-lab/database/schemas";
import type { ITracer } from "@zero-heads-lab/observability";
import type { SelectUserFields, SelectUserType } from "../types";

export interface IQueryRepository {
	findUserById(params: {
		id: string;
		fields?: SelectUserFields;
	}): Promise<SelectUserType | null>;
	findUserByExternalId(params: {
		externalId: string;
		fields?: SelectUserFields;
	}): Promise<SelectUserType | null>;
}

export class QueryRepository implements IQueryRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;
	private readonly cache: ICacheStore;
	private readonly CACHE_TTL = 3600; // 1 hour

	constructor(db: Database, tracer: ITracer, cache: ICacheStore) {
		this.db = db;
		this.tracer = tracer;
		this.cache = cache;
	}

	/**
	 * Helper to handle the Read-Through logic:
	 * 1. Check Cache -> 2. If Miss, Query DB -> 3. Populate Cache -> 4. Return
	 */
	private async readThrough<T>(
		cacheKey: string,
		spanName: string,
		dbQuery: () => Promise<T | null>
	): Promise<T | null> {
		return await this.tracer.withSpan(spanName, async (span) => {
			// 1. Attempt to get from cache
			const cached = await this.cache.get<T>(cacheKey);
			if (cached) {
				span.setAttribute("cache.hit", true);
				return cached;
			}

			span.setAttribute("cache.hit", false);

			// 2. Query Database
			const result = await dbQuery();

			// 3. If exists, populate cache for next time
			if (result) {
				await this.cache.set(cacheKey, result, this.CACHE_TTL);
			}

			return result;
		});
	}

	async findUserById(params: {
		id: string;
		fields?: SelectUserFields;
	}): Promise<SelectUserType | null> {
		const cacheKey = `user:id:${params.id}`;

		return this.readThrough(
			cacheKey,
			"auth.repository.findUserById",
			async () => {
				const [row] = await this.db
					.select()
					.from(userSchema)
					.where(eq(userSchema.id, params.id))
					.limit(1);

				return (row as SelectUserType) || null;
			}
		);
	}

	async findUserByExternalId(params: {
		externalId: string;
		fields?: SelectUserFields;
	}): Promise<SelectUserType | null> {
		const cacheKey = `user:ext:${params.externalId}`;

		return this.readThrough(
			cacheKey,
			"auth.repository.findUserByExternalId",
			async () => {
				const [row] = await this.db
					.select()
					.from(userSchema)
					.where(eq(userSchema.externalId, params.externalId))
					.limit(1);

				return (row as SelectUserType) || null;
			}
		);
	}
}
