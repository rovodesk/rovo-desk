import type { ITracer } from "@zero-heads-lab/analytics/lib/tracer";
import { eq } from "drizzle-orm";
import type { Database } from "../../conn";
import {
	onboarding as onboardingSchema,
	userProfile,
	workspaceProfile,
} from "../../drizzle/schemas/profile.schema";
import type {
	IProfileQueryRepository,
	OnboardingProgress,
	UserProfile,
	WorkspaceProfile,
} from "./profile.type";

export class ProfileQueryRepository implements IProfileQueryRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async getOnboardingProgressByUserId(params: {
		userId: string;
	}): Promise<OnboardingProgress | null> {
		return await this.tracer.withSpan(
			"profile.query.getOnboardingProgressByUserId",
			async (span) => {
				span.setAttribute("profile.user_id", params.userId);

				const [flow] = await this.db
					.select()
					.from(onboardingSchema)
					.where(eq(onboardingSchema.userId, params.userId))
					.limit(1);

				return flow ?? null;
			},
			{
				"db.operation": "select",
				"db.table": "onboarding",
			}
		);
	}

	async getWorkspaceProfileByOrganizationId(params: {
		organizationId: string;
	}): Promise<WorkspaceProfile | null> {
		return await this.tracer.withSpan(
			"profile.query.getWorkspaceProfileByOrganizationId",
			async (span) => {
				span.setAttribute("profile.organization_id", params.organizationId);

				const [profile] = await this.db
					.select()
					.from(workspaceProfile)
					.where(eq(workspaceProfile.organizationId, params.organizationId))
					.limit(1);

				return profile ?? null;
			},
			{
				"db.operation": "select",
				"db.table": "workspaceProfile",
			}
		);
	}

	async getUserProfileByUserId(params: {
		userId: string;
	}): Promise<UserProfile | null> {
		return await this.tracer.withSpan(
			"profile.query.getUserProfileByUserId",
			async (span) => {
				span.setAttribute("profile.user_id", params.userId);

				const [profile] = await this.db
					.select()
					.from(userProfile)
					.where(eq(userProfile.userId, params.userId))
					.limit(1);

				return profile ?? null;
			},
			{
				"db.operation": "select",
				"db.table": "userProfile",
			}
		);
	}
}
