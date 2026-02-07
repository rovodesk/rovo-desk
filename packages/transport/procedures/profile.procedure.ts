import { ORPCError, os } from "@orpc/server";
import {
	getProfileByUserId as getProfileQuery,
	type Profile,
} from "@zero-heads-lab/database/repositories/profile/queries";
import {
	GET_PROFILE_BY_USER_ID_INPUT_DTO,
	GET_PROFILE_BY_USER_ID_OUTPUT_DTO,
} from "../dto/profile.dto";
import { authMiddleware } from "../middlewares/auth.middleware";

export const getProfileByUserId = os
	.input(GET_PROFILE_BY_USER_ID_INPUT_DTO)
	.output(GET_PROFILE_BY_USER_ID_OUTPUT_DTO)
	.use(authMiddleware)
	.handler(async ({ input, context }) => {
		const { user } = context;

		// 🔐 Enforce ownership
		if (input.userId !== user.id) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "You can only retrieve your own profile",
			});
		}

		let profile: Profile | null;

		try {
			profile = await getProfileQuery(input.userId);
		} catch (error) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Error getting profile",
				cause: error,
			});
		}

		if (!profile) {
			throw new ORPCError("NOT_FOUND", {
				message: "Profile not found",
			});
		}

		return {
			...profile,
			onboardingStartedAt: profile.onboardingStartedAt?.toISOString() ?? null,
			onboardingCompletedAt:
				profile.onboardingCompletedAt?.toISOString() ?? null,
		};
	})
	.callable();
