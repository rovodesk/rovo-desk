import {
	createChatbotConnection,
	deleteChatbotConnection,
	findChatbotConnection,
	findChatbotWithSettings,
	listConnections,
	rotateChatbotConnectionKeys,
	toggleChatbotConnection,
	updateChatbotConnection,
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
		connection: {
			create: createChatbotConnection,
			update: updateChatbotConnection,
			delete: deleteChatbotConnection,
			toggle: toggleChatbotConnection,
			list: listConnections,
			find: findChatbotConnection,
			rotateKeys: rotateChatbotConnectionKeys,
		},
	},
};
