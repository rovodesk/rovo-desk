import {
	createKindeServerClient,
	GrantType,
	type SessionManager,
} from "@kinde-oss/kinde-typescript-sdk";

type BaseConfig = {
	authDomain: string;
	clientId: string;
	clientSecret: string;
	redirectURL?: string;
	logoutRedirectURL?: string;
};

/**
 * AUTHORIZATION_CODE
 */

// biome-ignore lint/style/useUnifiedTypeSignatures:No unified type signature available
export function createAuthServerClient(
	grantType: GrantType.AUTHORIZATION_CODE,
	config: BaseConfig & { sessionManager: SessionManager }
): ReturnType<typeof createKindeServerClient>;

/**
 * PKCE
 */
export function createAuthServerClient(
	grantType: GrantType.PKCE,
	config: BaseConfig & { sessionManager: SessionManager }
): ReturnType<typeof createKindeServerClient>;

/**
 * CLIENT_CREDENTIALS
 */
export function createAuthServerClient(
	grantType: GrantType.CLIENT_CREDENTIALS,
	config: BaseConfig
): ReturnType<typeof createKindeServerClient>;

/**
 * Implementation
 */
export function createAuthServerClient(
	grantType: GrantType,
	config: BaseConfig & { sessionManager?: SessionManager }
) {
	if (grantType === GrantType.CLIENT_CREDENTIALS) {
		return createKindeServerClient(grantType, {
			authDomain: config.authDomain,
			clientId: config.clientId,
			clientSecret: config.clientSecret,
		});
	}

	return createKindeServerClient(grantType, {
		authDomain: config.authDomain,
		clientId: config.clientId,
		clientSecret: config.clientSecret,
		redirectURL: config.redirectURL!,
		logoutRedirectURL: config.logoutRedirectURL,
		...(config.sessionManager ? { sessionManager: config.sessionManager } : {}),
		// biome-ignore lint/suspicious/noExplicitAny: No explicit any type available
	} as any);
}
