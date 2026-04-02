import { createAuthServerClient, GrantType } from "@zero-heads-lab/auth";
import type { Context } from "hono";
import type { AuthServieEnv } from "@/types";
import { createSessionManager } from "./session";

const getBaseConfig = (c: Context<AuthServieEnv>) => ({
	authDomain: c.env.KINDE_DOMAIN,
	clientId: c.env.KINDE_CLIENT_ID,
	clientSecret: c.env.KINDE_CLIENT_SECRET,
	redirectURL: c.env.KINDE_REDIRECT_URL,
	logoutRedirectURL: c.env.KINDE_LOGOUT_REDIRECT_URL,
});

export const createAuthorizationCodeClient = (c: Context<AuthServieEnv>) => {
	const sessionManager = createSessionManager(c);

	return createAuthServerClient(GrantType.AUTHORIZATION_CODE, {
		...getBaseConfig(c),
		sessionManager,
	});
};

export const createPkceClient = (c: Context<AuthServieEnv>) => {
	const sessionManager = createSessionManager(c);
	return createAuthServerClient(GrantType.PKCE, {
		...getBaseConfig(c),
		sessionManager,
	});
};

export const createClientCredentialsClient = (c: Context<AuthServieEnv>) => {
	return createAuthServerClient(GrantType.CLIENT_CREDENTIALS, {
		authDomain: c.env.KINDE_DOMAIN,
		clientId: c.env.KINDE_CLIENT_ID,
		clientSecret: c.env.KINDE_CLIENT_SECRET,
	});
};

export type CredentialsClient = ReturnType<
	typeof createClientCredentialsClient
>;

export type AuthorizationCodeClient = ReturnType<
	typeof createAuthorizationCodeClient
>;

export type PkceClient = ReturnType<typeof createPkceClient>;
