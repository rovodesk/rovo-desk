import { createAuth } from "@zero-heads-lab/auth/server/better-auth";
import { createAuthEnv } from "@zero-heads-lab/auth/server/keys";
import type { AuthInstance } from "@zero-heads-lab/auth/types";
import type { Context } from "hono";

export async function createAuthInstance(c: Context): Promise<AuthInstance> {
	const authEnv = createAuthEnv({
		PROD: c.env.CLOUDFLARE_ENV === "production",
		BETTER_AUTH_SECRET: c.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: c.env.CLOUDFLARE_API_BASE_URL, // Workers URL
		BETTER_AUTH_BASE_PATH: c.env.BETTER_AUTH_BASE_PATH,

		GOOGLE_CLIENT_ID: c.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: c.env.GOOGLE_CLIENT_SECRET,

		GITHUB_CLIENT_ID: c.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: c.env.GITHUB_CLIENT_SECRET,

		ALLOWED_ORIGINS: c.env.ALLOWED_ORIGINS,
		END_USER_DASHBOARD_URL: c.env.END_USER_DASHBOARD_URL,

		AWS_COGNITO_CLIENT_ID: c.env.AWS_COGNITO_CLIENT_ID,
		AWS_COGNITO_CLIENT_SECRET: c.env.AWS_COGNITO_CLIENT_SECRET,
		AWS_COGNITO_DOMAIN: c.env.AWS_COGNITO_DOMAIN,
		AWS_REGION: c.env.AWS_REGION,
		AWS_COGNITO_USER_POOL_ID: c.env.AWS_COGNITO_USER_POOL_ID,
	});

	const { cache, database, queue, analytics, logger, tracer } = c.get("INFRA");

	return await createAuth(
		cache,
		database,
		queue,
		analytics,
		logger,
		tracer,
		authEnv
	);
}
