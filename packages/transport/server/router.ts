import { implement } from "@orpc/server";
import { healthProcedure } from "../procedures/health.procedure";
import {
	clearOnboardingProgress,
	loadOnboardingProgress,
	persistOnboardingProgress,
} from "../procedures/profile.procedure";

export const routerContract = {
	health: healthProcedure,
	profile: {
		onboarding: {
			load: loadOnboardingProgress,
			persist: persistOnboardingProgress,
			clear: clearOnboardingProgress,
		},
	},
};

export const os = implement(routerContract);
export const router = os.router(routerContract);
