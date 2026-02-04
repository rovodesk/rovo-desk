import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = createEnv({
	server: {
		POLAR_ACCESS_TOKEN: z.string().min(1).startsWith("polar_oat_"),
		POALR_WEBHOOK_SECRET: z.string().min(1).startsWith("polar_whs_"),
	},
	runtimeEnvStrict: {
		POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
		POALR_WEBHOOK_SECRET: process.env.POALR_WEBHOOK_SECRET,
	},
});
