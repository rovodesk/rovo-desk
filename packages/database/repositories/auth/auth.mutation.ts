import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import type {
	WidgetConfig,
	WorkspaceSettings,
} from "@zero-heads-lab/shared/types";
import { eq } from "drizzle-orm";
import {
	organization as orgSchema,
	user as userSchema,
} from "../../drizzle/schemas/auth.schema";
import {
	userProfile,
	workspaceProfile,
} from "../../drizzle/schemas/profile.schema";
import { widget } from "../../drizzle/schemas/widget.schema";
import type { IAuthMutationRepository } from "./auth.types";

export class AuthMutationRepository implements IAuthMutationRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async markUserAsDeleted(params: { userId: string }): Promise<void> {
		return await this.tracer.withSpan(
			"auth.repo.markUserAsDeleted",
			async (span) => {
				span.setAttribute("auth.user_id", params.userId);

				await this.db
					.update(userSchema)
					.set({
						deletedAt: new Date(),
					})
					.where(eq(userSchema.id, params.userId));
			},
			{
				"db.operation": "update",
				"db.table": "user",
			}
		);
	}

	async createNewUserWithProfileTX(params: { userId: string }): Promise<void> {
		return await this.tracer.withSpan(
			"auth.repo.createNewUserWithProfileTX",
			async (span) => {
				span.setAttribute("auth.user_id", params.userId);

				const [existingUser] = await this.tracer.withSpan(
					"db.select.user",
					async () => {
						return await this.db
							.select()
							.from(userSchema)
							.where(eq(userSchema.id, params.userId))
							.limit(1);
					},
					{
						"db.operation": "select",
						"db.table": "user",
					}
				);

				if (!existingUser) {
					throw new Error("User not found");
				}

				const [existingProfile] = await this.tracer.withSpan(
					"db.select.userProfile",
					async () => {
						return await this.db
							.select()
							.from(userProfile)
							.where(eq(userProfile.userId, params.userId))
							.limit(1);
					},
					{
						"db.operation": "select",
						"db.table": "user_profile",
					}
				);

				if (existingProfile) {
					throw new Error("Profile already exists");
				}

				await this.db.transaction(async (tx) => {
					await this.tracer.withSpan(
						"db.insert.userProfile",
						async () => {
							await tx.insert(userProfile).values({
								userId: params.userId,
							});
						},
						{
							"db.operation": "insert",
							"db.table": "user_profile",
						}
					);
				});
			},
			{
				"db.operation": "transaction",
				"auth.flow": "create_user_profile",
			}
		);
	}

	async markUserAsVerified(params: { userId: string }): Promise<void> {
		return await this.tracer.withSpan(
			"auth.repo.markUserAsVerified",
			async (span) => {
				span.setAttribute("auth.user_id", params.userId);

				await this.db
					.update(userSchema)
					.set({
						role: "verified",
					})
					.where(eq(userSchema.id, params.userId));
			},
			{
				"db.operation": "update",
				"db.table": "user",
			}
		);
	}

	async createOrganizationWithProfileAndWidgetTX(params: {
		organizationId: string;
		widgetConfig?: WidgetConfig;
		workspaceConfig?: WorkspaceSettings;
		subscriptionId?: string;
	}): Promise<void> {
		return await this.tracer.withSpan(
			"auth.repo.createOrganizationWithProfileAndWidgetTX",
			async (span) => {
				span.setAttribute("auth.organization_id", params.organizationId);
				span.setAttribute("auth.has_widget_config", !!params.widgetConfig);
				span.setAttribute(
					"auth.has_workspace_config",
					!!params.workspaceConfig
				);

				await this.db.transaction(async (tx) => {
					const [profile] = await this.tracer.withSpan(
						"db.insert.workspaceProfile",
						async () => {
							return await tx
								.insert(workspaceProfile)
								.values({
									organizationId: params.organizationId,
									subscriptionId: params.subscriptionId,
									settings: params.workspaceConfig,
								})
								.returning({
									workspaceId: workspaceProfile.organizationId,
								});
						},
						{
							"db.operation": "insert",
							"db.table": "workspace_profile",
						}
					);

					if (!profile) {
						throw new Error("Failed to create workspace profile");
					}

					await this.tracer.withSpan(
						"db.insert.widget",
						async () => {
							await tx
								.insert(widget)
								.values({
									organizationId: profile.workspaceId,
									config: params.widgetConfig,
								})
								.onConflictDoUpdate({
									target: [widget.organizationId],
									set: {
										config: params.widgetConfig,
									},
								});
						},
						{
							"db.operation": "insert",
							"db.table": "widget",
						}
					);

					await this.tracer.withSpan(
						"db.update.organization",
						async () => {
							await tx
								.update(orgSchema)
								.set({
									logo: params.workspaceConfig?.branding?.logo,
								})
								.where(eq(orgSchema.id, params.organizationId));
						},
						{
							"db.operation": "update",
							"db.table": "organization",
						}
					);
				});
			},
			{
				"db.operation": "transaction",
				"auth.flow": "organization_bootstrap",
			}
		);
	}
}
