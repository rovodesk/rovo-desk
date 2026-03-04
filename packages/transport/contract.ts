import { healthProcedure } from "./procedures/health.procedure";
import {
	clearOnboardingProgress,
	getUserProfile,
	getWorkspaceProfile,
	loadOnboardingProgress,
	persistOnboardingProgress,
	toogleUserAway,
	updateWorkspaceSettings,
} from "./procedures/profile.procedure";
import { getWidget, updateWidgetSettings } from "./procedures/widget.procedure";

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
		user: {
			get: getUserProfile,
			toggleAway: toogleUserAway,
		},
	},
	widget: {
		updateSettings: updateWidgetSettings,
		get: getWidget,
	},
};
