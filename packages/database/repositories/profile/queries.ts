import { eq } from "drizzle-orm";
import type { Database } from "../../conn";
import {
	onboarding as onboardingSchema,
	userProfile,
	workspaceProfile,
} from "../../drizzle/schemas/profile.schema";

export type OnboardingProgress = {
	currentStepId: string | null;
	flowData: Record<string, unknown>;
	startedAt: Date | null;
	completedAt: Date | null;
	skippedAt: Date | null;
};

export async function getOnboardingProgressByUserId(
	database: Database,
	params: {
		userId: string;
	}
): Promise<OnboardingProgress> {
	const flow = await database
		.select({
			currentStepId: onboardingSchema.currentStepId,
			flowData: onboardingSchema.flowData,
			startedAt: onboardingSchema.startedAt,
			completedAt: onboardingSchema.completedAt,
			skippedAt: onboardingSchema.skippedAt,
		})
		.from(onboardingSchema)
		.where(eq(onboardingSchema.userId, params.userId))
		.limit(1)
		.then((res) => res[0]);

	return {
		currentStepId: flow?.currentStepId ?? null,
		flowData: flow?.flowData ?? {},
		startedAt: flow?.startedAt ?? null,
		completedAt: flow?.completedAt ?? null,
		skippedAt: flow?.skippedAt ?? null,
	};
}

export async function getWorkspaceProfileByOrganizationId(
	database: Database,
	params: {
		organizationId: string;
	}
) {
	return await database
		.select({
			settings: workspaceProfile.settings,
		})
		.from(workspaceProfile)
		.where(eq(workspaceProfile.organizationId, params.organizationId))
		.limit(1)
		.then((res) => res[0])
		.catch(() => {
			throw new Error("Failed to get workspace profile");
		});
}

export async function getUserProfileByUserId(
	database: Database,
	params: {
		userId: string;
	}
) {
	return await database
		.select({
			settings: userProfile.settings,
			isAway: userProfile.isAway,
			workspaceProfileId: userProfile.workspaceProfileId,
		})
		.from(userProfile)
		.where(eq(userProfile.userId, params.userId))
		.limit(1)
		.then((res) => res[0])
		.catch(() => {
			throw new Error("Failed to get user profile");
		});
}
