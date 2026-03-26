import { ORPCError } from "@orpc/server";
import { USER_STATUS_CHANGED_EVENT } from "@zero-heads-lab/analytics/events";
import { determineAuthRoles } from "@zero-heads-lab/auth/helpers";
import { ProfileRepository } from "@zero-heads-lab/database/repositories/profile";
import { base } from "../context";
import {
	GET_ONBOARDING_PROGRESS_OUTPUT_DTO,
	TOGGLE_USER_ACTIVE_INPUT_DTO,
	UPDATE_ONBOARDING_PROGRESS_INPUT_DTO,
	UPDATE_WORKSPACE_SETTINGS_INPUT_DTO,
} from "../dto/profile.dto";
import { AuthGuard } from "../middlewares/auth.middleware";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { OrganizationGuard } from "../middlewares/organization.middleware";

export const loadOnboardingProgress = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.output(GET_ONBOARDING_PROGRESS_OUTPUT_DTO)
	.handler(async ({ context }) => {
		const { user, database } = context;
		const repo = new ProfileRepository(database, context.tracer!);

		const onboardingProgress = await repo.query.getOnboardingProgressByUserId({
			userId: user.id,
		});
		if (!onboardingProgress || onboardingProgress.deletedAt) {
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
		const { user, analytics, database } = context;
		const repo = new ProfileRepository(database, context.tracer!);

		try {
			await repo.mutation.updateOnboardingProgressByUserId({
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
		analytics.captureEvent(user.id, "onboarding_progress", {
			currentStepId: input.currentStepId,
			flowData: input.flowData,
		});
	})
	.callable();

export const clearOnboardingProgress = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.handler(async ({ context }) => {
		const { user, database } = context;
		const repo = new ProfileRepository(database, context.tracer!);
		try {
			await repo.mutation.clearOnboardingProgressByUserId({
				userId: user.id,
			});
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
		const { database, organizationId } = context;
		const repo = new ProfileRepository(database, context.tracer!);
		try {
			await repo.mutation.updateWorkspaceSettingsByOrganizationId({
				organizationId,
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
		const { database, organizationId } = context;
		const repo = new ProfileRepository(database, context.tracer!);
		try {
			const workspaceSettings =
				await repo.query.getWorkspaceProfileByOrganizationId({
					organizationId,
				});

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
		const { database, user } = context;
		const repo = new ProfileRepository(database, context.tracer!);

		try {
			const userProfile = await repo.query.getUserProfileByUserId({
				userId: user.id,
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
		const { database, analytics, logger, tracer, user, session } = context;
		const userId = user.id;
		const repo = new ProfileRepository(database, tracer!);

		// 🚀 Create a child span for the DB operation
		return await tracer?.withSpan("db.fetch_workspace_full", async (span) => {
			// Add custom attributes for the span
			span.setAttribute("user.id", user.id);
			span.setAttribute("session.id", session.id);
			span.setAttribute("user.role", determineAuthRoles(user.role));

			try {
				await repo.mutation.toggleUserActiveField({
					userId,
					isActive: input.active,
				});
			} catch (error) {
				span.setAttribute("error.type", "not_found");
				logger?.error("rpc.profile.toogleUserActive", error);
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to toggle user active field",
				});
			}

			try {
				analytics?.captureEvent(userId, USER_STATUS_CHANGED_EVENT, {
					previousStatus: input.active,
					newStatus: !input.active,
				});
			} catch {
				//Ignore
			}
		});
	})
	.callable();
