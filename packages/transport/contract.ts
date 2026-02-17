import {
	findChatbotWithSettings,
	updateChatbotSettings,
} from "./procedures/chatbot.procedure";
import { healthProcedure } from "./procedures/health.procedure";
import {
	clearOnboardingProgress,
	loadOnboardingProgress,
	persistOnboardingProgress,
} from "./procedures/profile.procedure";

export const RouterContract = {
	health: healthProcedure,
	profile: {
		onboarding: {
			load: loadOnboardingProgress,
			persist: persistOnboardingProgress,
			clear: clearOnboardingProgress,
		},
	},
	chatbot: {
		find: findChatbotWithSettings,
		updateSettings: updateChatbotSettings,
	},
};
