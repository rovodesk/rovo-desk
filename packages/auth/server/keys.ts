import { createEnv } from "@t3-oss/env-core";
import { createBillingEnv } from "@zero-heads-lab/billing/keys";
import z from "zod";

export const authEnvSchema = {
	PROD: z.boolean(),

	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.url(),
	BETTER_AUTH_BASE_PATH: z.string(),

	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),

	GITHUB_CLIENT_ID: z.string(),
	GITHUB_CLIENT_SECRET: z.string(),

	ALLOWED_ORIGINS: z.string(),

	END_USER_DASHBOARD_URL: z.string(),

	AWS_COGNITO_CLIENT_ID: z.string(),
	AWS_COGNITO_CLIENT_SECRET: z.string(),
	AWS_COGNITO_DOMAIN: z.string(),
	AWS_REGION: z.string(),
	AWS_COGNITO_USER_POOL_ID: z.string(),
};

export function createAuthEnv(runtimeEnv: Record<string, string | boolean>) {
	const billingEnv = createBillingEnv(runtimeEnv);
	return createEnv({
		extends: [billingEnv],
		server: authEnvSchema,
		runtimeEnv,
	});
}

export type AuthEnv = ReturnType<typeof createAuthEnv>;
