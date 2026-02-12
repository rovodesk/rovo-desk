import { and, asc, eq, isNull } from "drizzle-orm";
import { createDatabase } from "../../conn";
import {
	onboardingFlow,
	onboardingStep,
} from "../../drizzle/schemas/profile.schema";

export async function getOnboardingProgressByUserId(userId: string) {
	const db = createDatabase();

	// 1️⃣ Get flow-level data
	const flow = await db
		.select()
		.from(onboardingFlow)
		.where(eq(onboardingFlow.userId, userId))
		.limit(1)
		.then((res) => res[0]);

	// 2️⃣ Get first incomplete step
	const step = await db
		.select()
		.from(onboardingStep)
		.where(
			and(
				eq(onboardingStep.userId, userId),
				isNull(onboardingStep.completedAt),
				isNull(onboardingStep.skippedAt)
			)
		)
		.orderBy(asc(onboardingStep.startedAt))
		.limit(1)
		.then((res) => res[0]);

	return {
		currentStepId: step?.stepId ?? null,
		flowData: flow?.flowData ?? {},
		startedAt: flow?.startedAt ?? null,
	};
}
