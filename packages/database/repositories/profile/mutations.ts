import { createDatabase } from "conn";
import { onboardingStep } from "../../drizzle/schemas/profile.schema";

export async function persistOnboardingProgressByUserId(
	userId: string,
	stepId: string,
	startedAt: Date
) {
	const db = createDatabase();

	return await db
		.insert(onboardingStep)
		.values({
			userId,
			stepId,
			startedAt,
		})
		.returning();
}
