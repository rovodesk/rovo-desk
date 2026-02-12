import { implement } from "@orpc/server";
import { healthProcedure } from "../procedures/health.procedure";
import {
	loadOnboardingProgress,
	persistOnboardingProgress,
} from "../procedures/onboarding.procedure";

export const routerContract = {
	health: healthProcedure,
	onboarding: {
		load: loadOnboardingProgress,
		persist: persistOnboardingProgress,
	},
};

export const os = implement(routerContract);
export const router = os.router(routerContract);
