import { ORPCError, os } from "@orpc/server";
import {
	clearOnboardingProgressByUserId,
	updateOnboardingProgressByUserId,
} from "@zero-heads-lab/database/repositories/profile/mutations";
import { getOnboardingProgressByUserId } from "@zero-heads-lab/database/repositories/profile/queries";

import {
	GET_ONBOARDING_PROGRESS_OUTPUT_DTO,
	UPDATE_ONBOARDING_PROGRESS_INPUT_DTO,
} from "../dto/profile.dto";
import { authMiddleware } from "../middlewares/auth.middleware";

export const loadOnboardingProgress = os
	.output(GET_ONBOARDING_PROGRESS_OUTPUT_DTO)
	.use(authMiddleware)
	.handler(async ({ context }) => {
		const { user } = context;

		if (!user?.id) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "You are not logged in",
			});
		}

		const onboardingProgress = await getOnboardingProgressByUserId(user.id);
		if (!onboardingProgress) {
			throw new ORPCError("NOT_FOUND", {
				message: "Onboarding progress not found",
			});
		}

		// TODO: Add Analytics

		return onboardingProgress;
	})
	.callable();

export const persistOnboardingProgress = os
	.input(UPDATE_ONBOARDING_PROGRESS_INPUT_DTO)
	.use(authMiddleware)
	.handler(async ({ context, input }) => {
		const { user } = context;

		if (!user?.id) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "You are not logged in",
			});
		}

		try {
			await updateOnboardingProgressByUserId(
				user.id,
				input.currentStepId,
				input.flowData
			);
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to update onboarding progress",
			});
		}

		// TODO: Add Analytics
	})
	.callable();

export const clearOnboardingProgress = os
	.use(authMiddleware)
	.handler(async ({ context }) => {
		const { user } = context;

		if (!user?.id) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "You are not logged in",
			});
		}

		try {
			await clearOnboardingProgressByUserId(user.id);
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to clear onboarding progress",
			});
		}

		// TODO: Add Analytics
	})
	.callable();
