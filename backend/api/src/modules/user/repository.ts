import type { ICacheStore } from "@zero-heads-lab/cache";
import { type Database, eq } from "@zero-heads-lab/database";
import { user as userSchema } from "@zero-heads-lab/database/schemas";
import type { ITracer } from "@zero-heads-lab/observability";
import type {
	InsertUserType,
	SelectUserFields,
	SelectUserType,
	UpdateUserType,
} from "./types";

export interface IMutationRepository {
	saveUser(params: InsertUserType, provider?: string): Promise<void>;
	updateUser(params: UpdateUserType): Promise<void>;
	markUserAsDeleted(params: { userId: string }): Promise<void>;
}

export class MutationRepository implements IMutationRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;
	private readonly cache: ICacheStore;

	constructor(db: Database, tracer: ITracer, cache: ICacheStore) {
		this.db = db;
		this.tracer = tracer;
		this.cache = cache;
	}

	async markUserAsDeleted(params: { userId: string }): Promise<void> {
		await this.tracer.withSpan(
			"auth.database.mutation.database.markUserAsDeleted",
			async (span) => {
				span.setAttribute("auth.user_id", params.userId);

				await this.db
					.update(userSchema)
					.set({
						deletedAt: new Date(),
						updatedAt: new Date(),
					})
					.where(eq(userSchema.id, params.userId));
			},
			{
				"db.operation": "update",
				"db.table": "user",
			}
		);

		await this.tracer.withSpan(
			"auth.database.mutation.cache.delete",
			async (span) => {
				span.setAttribute("auth.user_id", params.userId);
				await this.cache.delete(params.userId);
			},
			{
				"cache.operation": "delete",
				"cache.key": `${this.cache.getPrefix()}:${params.userId}`,
			}
		);
	}

	async saveUser(params: SelectUserType): Promise<void> {
		await this.tracer.withSpan(
			"auth.database.mutation.saveUser",
			async (span) => {
				span.setAttribute("auth.user_id", params.id);
				await this.db.transaction(async (tx) => {
					await tx.insert(userSchema).values({
						id: params.id,
						externalId: params.externalId,
						firstName: params.firstName,
						lastName: params.lastName,
						metadata: params.metadata,
						createdAt: params.createdAt,
						updatedAt: params.updatedAt,
						deletedAt: params.deletedAt,
						banned: params.banned,
						bannedAt: params.bannedAt,
						bannedExpiresAt: params.bannedExpiresAt,
						bannedReason: params.bannedReason,
					});
				});
			},
			{
				"db.operation": "insert",
				"db.table": "user",
			}
		);

		await this.tracer.withSpan(
			"auth.database.mutation.cache.set",
			async (span) => {
				span.setAttribute("auth.user_id", params.id);
				await this.cache.set(params.id, params);
			},
			{
				"cache.operation": "set",
				"cache.key": `${this.cache.getPrefix()}:${params.id}`,
			}
		);
	}

	async updateUser(params: UpdateUserType): Promise<void> {
		const { userId, ...updateData } = params;
		const now = new Date();

		// 1. Database Update (Source of Truth)
		await this.tracer.withSpan(
			"auth.database.mutation.updateUser",
			async (span) => {
				span.setAttribute("auth.user_id", userId);

				await this.db.transaction(async (tx) => {
					await tx
						.update(userSchema)
						.set({
							...updateData,
							updatedAt: now,
						})
						.where(eq(userSchema.id, userId));
				});
			},
			{
				"db.operation": "update",
				"db.table": "user",
			}
		);

		/**
		 * 2. Cache Invalidation Strategy
		 * Instead of 'Get -> Merge -> Set', we delete the cache key.
		 * The next 'findUserById' (Read-Through) will fetch the fresh data from DB.
		 * This prevents stale data if the 'Get' happened during a different transaction.
		 */
		await this.tracer.withSpan(
			"auth.database.mutation.cache.invalidate",
			async (span) => {
				span.setAttribute("auth.user_id", userId);
				const cacheKey = `user:id:${userId}`;
				await this.cache.delete(cacheKey);
			},
			{
				"cache.operation": "delete",
				"cache.key": `${this.cache.getPrefix()}:user:id:${userId}`,
			}
		);
	}
}

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

		return await this.readThrough(
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

		return await this.readThrough(
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

export interface IUserRepository {
	query: QueryRepository;
	mutation: MutationRepository;
}

export class UserRepository implements IUserRepository {
	readonly cacheStore: ICacheStore;
	readonly query: QueryRepository;
	readonly mutation: MutationRepository;

	constructor(db: Database, cacheStore: ICacheStore, tracer: ITracer) {
		this.cacheStore = cacheStore.withPrefix("user");
		this.query = new QueryRepository(db, tracer, this.cacheStore);
		this.mutation = new MutationRepository(db, tracer, this.cacheStore);
	}
}
