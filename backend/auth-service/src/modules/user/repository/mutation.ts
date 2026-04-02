/** biome-ignore-all lint/suspicious/useAwait: No awaited function */
import { type Database, eq } from "@zero-heads-lab/database";
import {
	providerIdentity,
	user as userSchema,
} from "@zero-heads-lab/database/schemas";
import type { ITracer } from "@zero-heads-lab/observability";
import type { SaveUserInput, UpdateUserInput } from "./types";

export interface IMutationRepository {
	saveUser(params: SaveUserInput): Promise<void>;
	updateUser(params: UpdateUserInput): Promise<void>;
	markUserAsDeleted(params: { userId: string }): Promise<void>;
}

export class MutationRepository implements IMutationRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async markUserAsDeleted(params: { userId: string }): Promise<void> {
		return this.tracer.withSpan(
			"auth.database.mutation.markUserAsDeleted",
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
	}

	async saveUser(params: SaveUserInput): Promise<void> {
		const { user, provider } = params;

		return this.tracer.withSpan(
			"auth.database.mutation.saveUser",
			async (span) => {
				span.setAttribute("auth.user_id", user.id);
				span.setAttribute("auth.provider", provider);

				await this.db.transaction(async (tx) => {
					await tx.insert(userSchema).values({
						id: user.id,
						email: user.email,
						externalId: user.externalId,
						firstName: user.firstName ?? null,
						lastName: user.lastName ?? null,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
						deletedAt: user.deletedAt ?? null,
						banned: user.banned,
						bannedAt: user.bannedAt ?? null,
						bannedExpiresAt: user.bannedExpiresAt ?? null,
						bannedReason: user.bannedReason ?? null,
					});

					await tx.insert(providerIdentity).values({
						userId: user.id,
						provider,
						providerUserId: user.externalId,
						email: user.email,
						subject: "user",
						metadata: {},
					});
				});
			},
			{
				"db.operation": "insert",
				"db.table": "user",
			}
		);
	}

	async updateUser(params: UpdateUserInput): Promise<void> {
		return this.tracer.withSpan(
			"auth.database.mutation.updateUser",
			async (span) => {
				span.setAttribute("auth.user_id", params.userId);

				const now = new Date();

				await this.db.transaction(async (tx) => {
					await tx
						.update(userSchema)
						.set({
							email: params.email,
							firstName: params.firstName,
							lastName: params.lastName,
							externalId: params.externalId,
							updatedAt: now,
						})
						.where(eq(userSchema.id, params.userId));

					await tx
						.update(providerIdentity)
						.set({
							email: params.email,
							providerUserId: params.externalId,
							updatedAt: now,
						})
						.where(eq(providerIdentity.userId, params.userId));
				});
			},
			{
				"db.operation": "update",
				"db.table": "user",
			}
		);
	}
}
