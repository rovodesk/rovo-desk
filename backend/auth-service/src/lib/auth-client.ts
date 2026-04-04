import { createAuthServerClient, GrantType } from "@zero-heads-lab/auth";
import type { AuthServiceBindings } from "@/types";
// import { createSessionManager } from "./session";

// const getBaseConfig = (c: Context<AuthServieEnv>) => ({
// 	authDomain: c.env.KINDE_DOMAIN,
// 	clientId: c.env.KINDE_CLIENT_ID,
// 	clientSecret: c.env.KINDE_CLIENT_SECRET,
// 	redirectURL: c.env.KINDE_REDIRECT_URL,
// 	logoutRedirectURL: c.env.KINDE_LOGOUT_REDIRECT_URL,
// });

// export const createAuthorizationCodeClient = (c: Context<AuthServieEnv>) => {
// 	const sessionManager = createSessionManager(c);

// 	return createAuthServerClient(GrantType.AUTHORIZATION_CODE, {
// 		...getBaseConfig(c),
// 		sessionManager,
// 	});
// };

// export const createPkceClient = (c: Context<AuthServieEnv>) => {
// 	const sessionManager = createSessionManager(c);
// 	return createAuthServerClient(GrantType.PKCE, {
// 		...getBaseConfig(c),
// 		sessionManager,
// 	});
// };

export const createKindeCredentialsClient = (env: AuthServiceBindings) => {
	return createAuthServerClient(GrantType.CLIENT_CREDENTIALS, {
		authDomain: env.KINDE_DOMAIN,
		clientId: env.KINDE_M2M_CLIENT_ID,
		clientSecret: env.KINDE_M2M_CLIENT_SECRET,
	});
};

export type KindeCredentialsClient = ReturnType<
	typeof createKindeCredentialsClient
>;

// export type AuthorizationCodeClient = ReturnType<
// 	typeof createAuthorizationCodeClient
// >;

// export type PkceClient = ReturnType<typeof createPkceClient>;
