import { eq } from "drizzle-orm";
import type { Database } from "../../conn";
import { onboarding as onboardingSchema } from "../../drizzle/schemas/profile.schema";

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
