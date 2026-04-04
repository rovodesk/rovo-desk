import type { ICacheStore } from "@zero-heads-lab/cache";
import { type Database, eq } from "@zero-heads-lab/database";
import { user as userSchema } from "@zero-heads-lab/database/schemas";
import type { ITracer } from "@zero-heads-lab/observability";
import type { InsertUserType, SelectUserType, UpdateUserType } from "../types";

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
