import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const billingEnvSchema = {
	STRIPE_ACCESS_TOKEN: z.string().min(1).startsWith("sk_").optional(),
	STRIPE_WEBHOOK_SECRET: z.string().min(1).startsWith("whsec_").optional(),
};

export function createBillingEnv(runtimeEnv: Record<string, string | boolean>) {
	return createEnv({
		server: billingEnvSchema,
		runtimeEnv,
	});
}

export type BillingEnv = ReturnType<typeof createBillingEnv>;
