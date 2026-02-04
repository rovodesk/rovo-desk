import { implement } from "@orpc/server";
import { healthProcedure } from "procedures/health.procedure";
import { getProfileByUserId } from "procedures/profile.procedure";

export const routerContract = {
	health: healthProcedure,
	profile: {
		get: getProfileByUserId,
	},
};

const os = implement(routerContract); // fully replaces the os from @orpc/server

export type AppRouter = typeof routerContract;

export const router = os.router(routerContract);
