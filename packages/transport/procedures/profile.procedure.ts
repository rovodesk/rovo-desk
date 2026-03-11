import { ORPCError } from "@orpc/server";
import {
	clearOnboardingProgressByUserId,
	toggleUserAwayField,
	updateOnboardingProgressByUserId,
	updateWorkspaceSettingsByOrganizationId,
} from "@zero-heads-lab/database/repositories/profile/mutations";
import {
	getOnboardingProgressByUserId,
	getUserProfileByUserId,
	getWorkspaceProfileByOrganizationId,
} from "@zero-heads-lab/database/repositories/profile/queries";
import { BaseMiddleware } from "@/middlewares/base.middleware";
import { OrganizationGuard } from "@/middlewares/organization.middleware";
import { base } from "../context";
import {
	GET_ONBOARDING_PROGRESS_OUTPUT_DTO,
	TOGGLE_USER_ACTIVE_INPUT_DTO,
	UPDATE_ONBOARDING_PROGRESS_INPUT_DTO,
	UPDATE_WORKSPACE_SETTINGS_INPUT_DTO,
} from "../dto/profile.dto";
import { AuthGuard } from "../middlewares/auth.middleware";

export const loadOnboardingProgress = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.output(GET_ONBOARDING_PROGRESS_OUTPUT_DTO)
	.handler(async ({ context }) => {
		const user = context.user;
		const database = context.database;

		const onboardingProgress = await getOnboardingProgressByUserId(database, {
			userId: user.id,
		});
		if (!onboardingProgress) {
			throw new ORPCError("NOT_FOUND", {
				message: "Onboarding progress not found",
			});
		}

		return onboardingProgress;
	})
	.callable();

export const persistOnboardingProgress = base
	.input(UPDATE_ONBOARDING_PROGRESS_INPUT_DTO)
	.use(BaseMiddleware)
	.use(AuthGuard)
	.handler(async ({ context, input }) => {
		const user = context.user;
		const analytics = await context.analytics;
		const database = context.database;

		try {
			await updateOnboardingProgressByUserId(database, {
				userId: user.id,
				currentStepId: input.currentStepId,
				flowData: input.flowData,
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to update onboarding progress",
			});
		}

		// Send Anlytics Event
		analytics.captureImmediate({
			distinctId: user.id,
			event: "onboarding_progress",
			properties: {
				currentStepId: input.currentStepId,
				flowData: input.flowData,
			},
		});
	})
	.callable();

export const clearOnboardingProgress = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.handler(async ({ context }) => {
		const user = context.user;
		const database = context.database;
		try {
			await clearOnboardingProgressByUserId(database, { userId: user.id });
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to clear onboarding progress",
			});
		}
	})
	.callable();

export const updateWorkspaceSettings = base
	.input(UPDATE_WORKSPACE_SETTINGS_INPUT_DTO)
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.handler(async ({ context, input }) => {
		const database = context.database;
		try {
			await updateWorkspaceSettingsByOrganizationId(database, {
				organizationId: context.organizationId,
				settings: input.settings,
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to update workspace settings",
			});
		}
	})
	.callable();

export const getWorkspaceProfile = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.handler(async ({ context }) => {
		const database = context.database;
		try {
			const workspaceSettings = await getWorkspaceProfileByOrganizationId(
				database,
				{
					organizationId: context.organizationId,
				}
			);
			return workspaceSettings;
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to get workspace settings",
			});
		}
	})
	.callable();

export const getUserProfile = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.handler(async ({ context }) => {
		const database = context.database;
		try {
			const userProfile = await getUserProfileByUserId(database, {
				userId: context.user.id,
			});
			return userProfile;
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to get user profile",
			});
		}
	})
	.callable();

export const toogleUserActive = base
	.input(TOGGLE_USER_ACTIVE_INPUT_DTO)
	.use(BaseMiddleware)
	.use(AuthGuard)
	.handler(async ({ context, input }) => {
		const database = context.database;
		const analytics = await context.analytics;

		const userId = context.user.id;

		try {
			await toggleUserAwayField(database, {
				userId,
				isAway: !input.active,
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to toggle user away field",
			});
		}

		await analytics?.capture({
			distinctId: userId,
			event: "user_status_changed",
			properties: {
				active: input.active,
			},
		});
	})
	.callable();
