/** biome-ignore-all lint/suspicious/useAwait: No awaited tasks */
import { type Database, eq } from "@zero-heads-lab/database";
import { user as userSchema } from "@zero-heads-lab/database/schemas";
import type { ITracer } from "@zero-heads-lab/observability";
import { User } from "../domain/user";

export interface IQueryRepository {
	findUserById(params: { userId: string }): Promise<User | null>;
	findUserByEmail(params: { email: string }): Promise<User | null>;
	findUserByExternalId(params: { externalId: string }): Promise<User | null>;
}

export class QueryRepository implements IQueryRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async findUserById(params: { userId: string }): Promise<User | null> {
		return this.tracer.withSpan(
			"auth.database.query.findUserById",
			async (span) => {
				span.setAttribute("auth.user_id", params.userId);

				const [row] = await this.db
					.select()
					.from(userSchema)
					.where(eq(userSchema.id, params.userId))
					.limit(1);

				if (!row) return null;

				return User.rehydrate({
					id: row.id,
					email: row.email,
					externalId: row.externalId,
					firstName: row.firstName,
					lastName: row.lastName,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					deletedAt: row.deletedAt,
					banned: row.banned,
					bannedAt: row.bannedAt,
					bannedExpiresAt: row.bannedExpiresAt,
					bannedReason: row.bannedReason,
				});
			},
			{
				"db.operation": "select",
				"db.table": "user",
			}
		);
	}

	async findUserByEmail(params: { email: string }): Promise<User | null> {
		const normalizedEmail = params.email.trim().toLowerCase();

		return this.tracer.withSpan(
			"auth.database.query.findUserByEmail",
			async (span) => {
				span.setAttribute("auth.email", normalizedEmail);

				const [row] = await this.db
					.select()
					.from(userSchema)
					.where(eq(userSchema.email, normalizedEmail))
					.limit(1);

				if (!row) return null;

				return User.rehydrate({
					id: row.id,
					email: row.email,
					externalId: row.externalId,
					firstName: row.firstName,
					lastName: row.lastName,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					deletedAt: row.deletedAt,
					banned: row.banned,
					bannedAt: row.bannedAt,
					bannedExpiresAt: row.bannedExpiresAt,
					bannedReason: row.bannedReason,
				});
			},
			{
				"db.operation": "select",
				"db.table": "user",
			}
		);
	}

	async findUserByExternalId(params: {
		externalId: string;
	}): Promise<User | null> {
		return this.tracer.withSpan(
			"auth.database.query.findUserByExternalId",
			async (span) => {
				span.setAttribute("auth.external_id", params.externalId);

				const [row] = await this.db
					.select()
					.from(userSchema)
					.where(eq(userSchema.externalId, params.externalId))
					.limit(1);

				if (!row) return null;

				return User.rehydrate({
					id: row.id,
					email: row.email,
					externalId: params.externalId,
					firstName: row.firstName,
					lastName: row.lastName,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					deletedAt: row.deletedAt,
					banned: row.banned,
					bannedAt: row.bannedAt,
					bannedExpiresAt: row.bannedExpiresAt,
					bannedReason: row.bannedReason,
				});
			},
			{
				"db.operation": "select",
				"db.table": "user",
			}
		);
	}
}
