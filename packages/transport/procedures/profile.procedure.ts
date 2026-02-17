import { ORPCError } from "@orpc/server";
import {
	clearOnboardingProgressByUserId,
	updateOnboardingProgressByUserId,
} from "@zero-heads-lab/database/repositories/profile/mutations";
import { getOnboardingProgressByUserId } from "@zero-heads-lab/database/repositories/profile/queries";
import { BaseMiddleware } from "@/middlewares/base.middleware";
import { base } from "../context";
import {
	GET_ONBOARDING_PROGRESS_OUTPUT_DTO,
	UPDATE_ONBOARDING_PROGRESS_INPUT_DTO,
} from "../dto/profile.dto";
import { AuthGuard } from "../middlewares/auth.middleware";

export const loadOnboardingProgress = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.output(GET_ONBOARDING_PROGRESS_OUTPUT_DTO)
	.handler(async ({ context }) => {
		const user = context.user;

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

export const persistOnboardingProgress = base
	.input(UPDATE_ONBOARDING_PROGRESS_INPUT_DTO)
	.use(BaseMiddleware)
	.use(AuthGuard)
	.handler(async ({ context, input }) => {
		const user = context.user;
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

export const clearOnboardingProgress = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.handler(async ({ context }) => {
		const user = context.user;
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
