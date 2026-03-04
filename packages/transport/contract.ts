import { healthProcedure } from "./procedures/health.procedure";
import {
	clearOnboardingProgress,
	getWorkspaceProfile,
	loadOnboardingProgress,
	persistOnboardingProgress,
	updateWorkspaceSettings,
} from "./procedures/profile.procedure";

export const RouterContract = {
	health: healthProcedure,
	profile: {
		onboarding: {
			load: loadOnboardingProgress,
			persist: persistOnboardingProgress,
			clear: clearOnboardingProgress,
		},
		workspace: {
			get: getWorkspaceProfile,
			update: updateWorkspaceSettings,
		},
	},
};
