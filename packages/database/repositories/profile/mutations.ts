import { createDatabase } from "conn";
import { eq } from "drizzle-orm";
import { onboarding as onboardingSchema } from "../../drizzle/schemas/profile.schema";

export async function updateOnboardingProgressByUserId(
	userId: string,
	currentStepId: string,
	flowData: Record<string, unknown>
): Promise<void> {
	const db = createDatabase();

	try {
		await db
			.update(onboardingSchema)
			.set({
				currentStepId,
				flowData,
			})
			.where(eq(onboardingSchema.userId, userId))
			.then((res) => res[0]);
		return;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export const clearOnboardingProgressByUserId = async (userId: string) => {
	const db = createDatabase();

	try {
		await db
			.update(onboardingSchema)
			.set({
				currentStepId: "welcome",
				flowData: {},
				completedAt: null,
				skippedAt: null,
				startedAt: null,
				deletedAt: new Date(),
			})
			.where(eq(onboardingSchema.userId, userId))
			.then((res) => res[0]);
		return;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
