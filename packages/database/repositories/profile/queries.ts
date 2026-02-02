import { eq } from "drizzle-orm";
import { createDatabase } from "../../conn";
import { profile as profileSchema } from "../../schema";

export async function getProfileByUserId(userId: string) {
	const db = createDatabase();
	return await db
		.select({
			id: profileSchema.userId,
			currentOnboardingStep: profileSchema.currentOnboardingStep,
			onboardingStartedAt: profileSchema.onboardingStartedAt,
			onboardingCompletedAt: profileSchema.onboardingCompletedAt,
			organizationId: profileSchema.organizationId,
			teamId: profileSchema.teamId,
		})
		.from(profileSchema)
		.where(eq(profileSchema.userId, userId))
		.limit(1)
		.then((res) => res[0]);
}
