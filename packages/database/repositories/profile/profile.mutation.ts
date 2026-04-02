import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import { eq } from "drizzle-orm";
import {
	onboarding as onboardingSchema,
	userProfile,
	workspaceProfile,
} from "../../lib/schemas/profile.schema";
import type { IProfileMutationRepository } from "./profile.type";

export class ProfileMutationRepository implements IProfileMutationRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async updateOnboardingProgressByUserId(params: {
		userId: string;
		currentStepId: string;
		flowData: Record<string, unknown>;
	}): Promise<void> {
		return await this.tracer.withSpan(
			"profile.mutation.updateOnboardingProgressByUserId",
			async (span) => {
				span.setAttribute("profile.user_id", params.userId);

				await this.db
					.update(onboardingSchema)
					.set({
						currentStepId: params.currentStepId,
						flowData: params.flowData,
					})
					.where(eq(onboardingSchema.userId, params.userId));
			},
			{
				"db.operation": "update",
				"db.table": "onboarding",
			}
		);
	}

	async clearOnboardingProgressByUserId(params: {
		userId: string;
	}): Promise<void> {
		return await this.tracer.withSpan(
			"profile.mutation.clearOnboardingProgressByUserId",
			async (span) => {
				span.setAttribute("profile.user_id", params.userId);

				await this.db
					.update(onboardingSchema)
					.set({
						currentStepId: "welcome",
						flowData: {},
						completedAt: null,
						skippedAt: null,
						startedAt: null,
						deletedAt: new Date(),
					})
					.where(eq(onboardingSchema.userId, params.userId));
			},
			{
				"db.operation": "update",
				"db.table": "onboarding",
			}
		);
	}

	async createWorkspaceProfile(params: {
		organizationId: string;
		subscriptionId?: string;
		settings: Record<string, unknown>;
	}): Promise<void> {
		return await this.tracer.withSpan(
			"profile.mutation.createWorkspaceProfile",
			async (span) => {
				span.setAttribute("profile.organization_id", params.organizationId);

				await this.db.insert(workspaceProfile).values({
					organizationId: params.organizationId,
					subscriptionId: params.subscriptionId,
					settings: params.settings,
				});
			},
			{
				"db.operation": "insert",
				"db.table": "workspaceProfile",
			}
		);
	}

	async updateWorkspaceSettingsByOrganizationId(params: {
		organizationId: string;
		settings: Record<string, unknown>;
	}): Promise<void> {
		return await this.tracer.withSpan(
			"profile.mutation.updateWorkspaceSettingsByOrganizationId",
			async (span) => {
				span.setAttribute("profile.organization_id", params.organizationId);

				await this.db
					.update(workspaceProfile)
					.set({
						settings: params.settings,
					})
					.where(eq(workspaceProfile.organizationId, params.organizationId));
			},
			{
				"db.operation": "update",
				"db.table": "workspaceProfile",
			}
		);
	}

	async toggleUserActiveField(params: {
		userId: string;
		isActive: boolean;
	}): Promise<void> {
		return await this.tracer.withSpan(
			"profile.mutation.toggleUserActiveField",
			async (span) => {
				span.setAttribute("profile.user_id", params.userId);

				await this.db
					.update(userProfile)
					.set({
						isActive: params.isActive,
					})
					.where(eq(userProfile.userId, params.userId));
			},
			{
				"db.operation": "update",
				"db.table": "userProfile",
			}
		);
	}
}
