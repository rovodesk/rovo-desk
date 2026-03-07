import { eq } from "drizzle-orm";
import type { Database } from "../../conn";
import {
	onboarding as onboardingSchema,
	userProfile,
	workspaceProfile,
} from "../../drizzle/schemas/profile.schema";

export async function updateOnboardingProgressByUserId(
	database: Database,
	params: {
		userId: string;
		currentStepId: string;
		flowData: Record<string, unknown>;
	}
): Promise<void> {
	try {
		await database
			.update(onboardingSchema)
			.set({
				currentStepId: params.currentStepId,
				flowData: params.flowData,
			})
			.where(eq(onboardingSchema.userId, params.userId))
			.then((res) => res[0]);
		return;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export const clearOnboardingProgressByUserId = async (
	database: Database,
	params: { userId: string }
) => {
	try {
		await database
			.update(onboardingSchema)
			.set({
				currentStepId: "welcome",
				flowData: {},
				completedAt: null,
				skippedAt: null,
				startedAt: null,
				deletedAt: new Date(),
			})
			.where(eq(onboardingSchema.userId, params.userId))
			.then((res) => res[0]);
		return;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export async function createWorkspaceProfile(
	database: Database,
	params: {
		organizationId: string;
		subscriptionId?: string;
		settings: Record<string, unknown>;
	}
) {
	return await database
		.insert(workspaceProfile)
		.values({
			organizationId: params.organizationId,
			subscriptionId: params.subscriptionId,
			settings: params.settings,
		})
		.catch(() => {
			throw new Error("Failed to create workspace profile");
		});
}

export async function updateWorkspaceSettingsByOrganizationId(
	database: Database,
	params: {
		organizationId: string;
		settings: Record<string, unknown>;
	}
) {
	return await database
		.update(workspaceProfile)
		.set({
			settings: params.settings,
		})
		.where(eq(workspaceProfile.organizationId, params.organizationId))
		.catch(() => {
			throw new Error("Failed to update workspace settings");
		});
}

export async function toggleUserAwayField(
	database: Database,
	params: {
		userId: string;
		isAway: boolean;
	}
) {
	return await database
		.update(userProfile)
		.set({
			isAway: params.isAway,
		})
		.where(eq(userProfile.userId, params.userId))
		.catch(() => {
			throw new Error("Failed to toggle user away field");
		});
}
