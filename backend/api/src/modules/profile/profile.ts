import { implement, ORPCError } from "@orpc/server";
import { USER_STATUS_CHANGED_EVENT } from "@zero-heads-lab/analytics/events";
import { determineAuthRoles } from "@zero-heads-lab/auth/helpers";
import { ProfileContract } from "@zero-heads-lab/contract/orpc/profile.contract";
import { ProfileRepository } from "@zero-heads-lab/database/repositories/profile";
import { AuthGuard } from "@/lib/guards/auth.guard";
import { BaseGuard } from "@/lib/guards/base.guard";
import { OrganizationGuard } from "@/lib/guards/organization.guard";

const os = implement(ProfileContract);

export const loadProgress = os.onboarding.loadProgress
	.use(BaseGuard)
	.use(AuthGuard)
	.handler(async ({ context }) => {
		const { user, database, tracer } = context;
		const repo = new ProfileRepository(database, tracer);

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

export const persistProgress = os.onboarding.persistProgress
	.use(BaseGuard)
	.use(AuthGuard)
	.handler(async ({ context, input }) => {
		const { user, analytics, database } = context;
		const repo = new ProfileRepository(database!, context.tracer!);

		try {
			await repo.mutation.updateOnboardingProgressByUserId({
				userId: user!.id,
				currentStepId: input.currentStepId,
				flowData: input.flowData,
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to update onboarding progress",
			});
		}

		analytics!.captureEvent(user!.id, "onboarding_progress", {
			currentStepId: input.currentStepId,
			flowData: input.flowData,
		});
	})
	.callable();

export const clearProgress = os.onboarding.clearProgress
	.use(BaseGuard)
	.use(AuthGuard)
	.handler(async ({ context }) => {
		const { user, database } = context;
		const repo = new ProfileRepository(database!, context.tracer);

		try {
			await repo.mutation.clearOnboardingProgressByUserId({
				userId: user!.id,
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to clear onboarding progress",
			});
		}
	})
	.callable();

export const updateWorkspaceSettings = os.workspace.updateWorkspaceSettings
	.use(BaseGuard)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.handler(async ({ context, input }) => {
		const { database, organizationId } = context;
		const repo = new ProfileRepository(database!, context.tracer!);

		try {
			await repo.mutation.updateWorkspaceSettingsByOrganizationId({
				organizationId: organizationId!,
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

export const getWorkspaceProfile = os.workspace.getWorkspaceProfile
	.use(BaseGuard)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.handler(async ({ context }) => {
		const { database, organizationId } = context;
		const repo = new ProfileRepository(database!, context.tracer!);

		try {
			const workspaceProfile =
				await repo.query.getWorkspaceProfileByOrganizationId({
					organizationId: organizationId!,
				});
			if (!workspaceProfile) {
				throw new ORPCError("NOT_FOUND", {
					message: "Workspace profile not found for this organization",
				});
			}

			return workspaceProfile;
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to get workspace settings",
			});
		}
	})
	.callable();

export const getUserProfile = os.user.getUserProfile
	.use(BaseGuard)
	.use(AuthGuard)
	.handler(async ({ context }) => {
		const { database, user } = context;
		const repo = new ProfileRepository(database!, context.tracer!);

		try {
			const userProfile = await repo.query.getUserProfileByUserId({
				userId: user!.id,
			});
			if (!userProfile) {
				throw new ORPCError("NOT_FOUND", {
					message: "User profile not found for this user",
				});
			}

			return userProfile;
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to get user profile",
			});
		}
	})
	.callable();

export const toggleUserActive = os.user.toggleUserActive
	.use(BaseGuard)
	.use(AuthGuard)
	.handler(async ({ context, input }) => {
		const { database, analytics, logger, tracer, user, session } = context;
		const userId = user!.id;
		const repo = new ProfileRepository(database!, tracer!);

		return await tracer?.withSpan("db.fetch_workspace_full", async (span) => {
			span.setAttribute("user.id", user!.id);
			span.setAttribute("session.id", session!.id);
			span.setAttribute("user.role", determineAuthRoles(user!.role));

			try {
				await repo.mutation.toggleUserActiveField({
					userId,
					isActive: input.active,
				});
			} catch (error) {
				span.setAttribute("error.type", "not_found");
				logger?.error("rpc.profile.toggleUserActive", error);
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
				// ignore analytics failures
			}
		});
	})
	.callable();
