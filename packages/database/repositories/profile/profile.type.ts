import type { InferSelectModel } from "drizzle-orm";
import type {
	onboarding as onboardingSchema,
	userProfile as userProfileSchema,
	workspaceProfile as workspaceProfileSchema,
} from "../../lib/schemas/profile.schema";

export type OnboardingProgress = InferSelectModel<typeof onboardingSchema>;
export type WorkspaceProfile = InferSelectModel<typeof workspaceProfileSchema>;
export type UserProfile = InferSelectModel<typeof userProfileSchema>;

export type IProfileQueryRepository = {
	getOnboardingProgressByUserId(params: {
		userId: string;
	}): Promise<OnboardingProgress | null>;

	getWorkspaceProfileByOrganizationId(params: {
		organizationId: string;
	}): Promise<WorkspaceProfile | null>;

	getUserProfileByUserId(params: {
		userId: string;
	}): Promise<UserProfile | null>;
};

export type IProfileMutationRepository = {
	updateOnboardingProgressByUserId(params: {
		userId: string;
		currentStepId: string;
		flowData: Record<string, unknown>;
	}): Promise<void>;

	clearOnboardingProgressByUserId(params: { userId: string }): Promise<void>;

	createWorkspaceProfile(params: {
		organizationId: string;
		subscriptionId?: string;
		settings: Record<string, unknown>;
	}): Promise<void>;

	updateWorkspaceSettingsByOrganizationId(params: {
		organizationId: string;
		settings: Record<string, unknown>;
	}): Promise<void>;

	toggleUserActiveField(params: {
		userId: string;
		isActive: boolean;
	}): Promise<void>;
};

export type IProfileRepository = {
	query: IProfileQueryRepository;
	mutation: IProfileMutationRepository;
};
