import { eq } from "drizzle-orm";
import { createDatabase } from "../../conn";
import { profile as profileSchema } from "../../schema";

// TODO: Auto generate this type from schema
export type Profile = {
	id: string;
	currentOnboardingStep: string | null;
	onboardingStartedAt: Date | null;
	onboardingCompletedAt: Date | null;
	organizationId: string | null;
	teamId: string | null;
};

export async function getProfileByUserId(
	userId: string
): Promise<Profile | null> {
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
		.then((res) => res[0] ?? null);
}
