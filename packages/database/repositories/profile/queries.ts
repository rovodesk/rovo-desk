import { eq } from "drizzle-orm";
import { createDatabase } from "../../conn";
import { onboarding as onboardingSchema } from "../../drizzle/schemas/profile.schema";

export type OnboardingProgress = {
	currentStepId: string | null;
	flowData: Record<string, unknown>;
	startedAt: Date | null;
	completedAt: Date | null;
	skippedAt: Date | null;
};

export async function getOnboardingProgressByUserId(
	userId: string
): Promise<OnboardingProgress> {
	const db = createDatabase();

	const flow = await db
		.select({
			currentStepId: onboardingSchema.currentStepId,
			flowData: onboardingSchema.flowData,
			startedAt: onboardingSchema.startedAt,
			completedAt: onboardingSchema.completedAt,
			skippedAt: onboardingSchema.skippedAt,
		})
		.from(onboardingSchema)
		.where(eq(onboardingSchema.userId, userId))
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
