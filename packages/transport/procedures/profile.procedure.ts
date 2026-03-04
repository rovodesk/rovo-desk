import { ORPCError } from "@orpc/server";
import {
	clearOnboardingProgressByUserId,
	updateOnboardingProgressByUserId,
	updateWorkspaceSettingsByOrganizationId,
} from "@zero-heads-lab/database/repositories/profile/mutations";
import {
	getOnboardingProgressByUserId,
	getWorkspaceProfileByOrganizationId,
} from "@zero-heads-lab/database/repositories/profile/queries";
import { BaseMiddleware } from "@/middlewares/base.middleware";
import { OrganizationGuard } from "@/middlewares/organization.middleware";
import { base } from "../context";
import {
	GET_ONBOARDING_PROGRESS_OUTPUT_DTO,
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

		// TODO: Add Analytics
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

		// TODO: Add Analytics
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
