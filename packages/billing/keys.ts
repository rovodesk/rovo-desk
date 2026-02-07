import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = createEnv({
	server: {
		STRIPE_ACCESS_TOKEN: z.string().min(1).startsWith("sk_"),
		STRIPE_WEBHOOK_SECRET: z.string().min(1).startsWith("whsec_"),
		PRO_PLAN_MONTHLY_PRICE_ID: z.string().min(1),
		PRO_PLAN_ANNUAL_PRICE_ID: z.string().min(1),
		STARTUP_PLAN_MONTHLY_PRICE_ID: z.string().min(1),
		STARTUP_PLAN_ANNUAL_PRICE_ID: z.string().min(1),
	},
	runtimeEnvStrict: {
		STRIPE_ACCESS_TOKEN: process.env.STRIPE_ACCESS_TOKEN,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		PRO_PLAN_MONTHLY_PRICE_ID: process.env.PRO_PLAN_MONTHLY_PRICE_ID,
		PRO_PLAN_ANNUAL_PRICE_ID: process.env.PRO_PLAN_ANNUAL_PRICE_ID,
		STARTUP_PLAN_MONTHLY_PRICE_ID: process.env.STARTUP_PLAN_MONTHLY_PRICE_ID,
		STARTUP_PLAN_ANNUAL_PRICE_ID: process.env.STARTUP_PLAN_ANNUAL_PRICE_ID,
	},
});
