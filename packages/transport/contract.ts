import { getAllOrganizations } from "./procedures/admin.procedure";
import { healthProcedure } from "./procedures/health.procedure";
import {
	clearOnboardingProgress,
	getUserProfile,
	getWorkspaceProfile,
	loadOnboardingProgress,
	persistOnboardingProgress,
	toogleUserActive,
	updateWorkspaceSettings,
} from "./procedures/profile.procedure";
import { getWidget, updateWidgetSettings } from "./procedures/widget.procedure";

export const RouterContract: {
	health: typeof healthProcedure;
	profile: {
		onboarding: {
			load: typeof loadOnboardingProgress;
			persist: typeof persistOnboardingProgress;
			clear: typeof clearOnboardingProgress;
		};
		workspace: {
			get: typeof getWorkspaceProfile;
			update: typeof updateWorkspaceSettings;
		};
		user: {
			get: typeof getUserProfile;
			toggleActive: typeof toogleUserActive;
		};
	};
	widget: {
		updateSettings: typeof updateWidgetSettings;
		get: typeof getWidget;
	};
	admin: {
		listOrganizations: typeof getAllOrganizations;
	};
} = {
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
			toggleActive: toogleUserActive,
		},
	},
	widget: {
		updateSettings: updateWidgetSettings,
		get: getWidget,
	},
	admin: {
		listOrganizations: getAllOrganizations,
	},
};
