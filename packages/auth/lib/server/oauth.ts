import { APIError } from "encore.dev/api";
import { exchangeCodeForTokens } from "./cognito";
import type { TrustedSocialProvider } from "./config";
import { parseJwt } from "./jwt";

export interface OAuthTokens {
	accessToken: string;
	idToken: string;
	refreshToken?: string;
	expiresIn?: number;
	tokenType?: string;
}

export interface OAuthStateData {
	codeVerifier: string;
	provider: TrustedSocialProvider;
	returnTo?: string;
	createdAt: string;
}

export interface OAuthClaims {
	sub: string;
	email: string;
	name?: string;
	email_verified?: boolean;
	[key: string]: unknown;
}

export interface LocalUserRef {
	id: string;
}

export interface HandleOAuthCallbackResult {
	localUser: LocalUserRef;
	claims: OAuthClaims;
	returnTo?: string;
	tokens: OAuthTokens;
	provider: TrustedSocialProvider;
}

export interface EnsureUserExistsInput {
	authProvider: string;
	authUserId: string;
	email: string;
	name?: string;
	emailVerified?: boolean;
}

export interface OAuthUserService {
	ensureUserExists(params: EnsureUserExistsInput): Promise<LocalUserRef>;
}

export interface OAuthStateStore {
	get(params: { state: string }): Promise<OAuthStateData | undefined>;
	delete(params: { state: string }): Promise<number>;
}

export interface HandleOAuthCallbackParams {
	code: string;
	state: string;
	provider?: TrustedSocialProvider;
}

export interface HandleOAuthCallbackDeps {
	userService: OAuthUserService;
	oauthStateStore: OAuthStateStore;
}

export async function handleOAuthCallback(
	params: HandleOAuthCallbackParams,
	deps: HandleOAuthCallbackDeps
): Promise<HandleOAuthCallbackResult> {
	const stateData = await deps.oauthStateStore.get({ state: params.state });

	if (!stateData) {
		throw APIError.unauthenticated("Invalid or expired OAuth state");
	}

	const tokens = await exchangeCodeForTokens({
		code: params.code,
		codeVerifier: stateData.codeVerifier,
	});

	if (!(tokens.idToken && tokens.accessToken)) {
		throw APIError.unauthenticated("Failed to exchange OAuth code");
	}

	const claims = parseJwt(tokens.idToken) as OAuthClaims;

	if (!(claims.sub && claims.email)) {
		throw APIError.unauthenticated("Invalid identity token claims");
	}

	const localUser = await deps.userService.ensureUserExists({
		authProvider: "cognito",
		authUserId: claims.sub,
		email: claims.email,
		name: claims.name,
		emailVerified: claims.email_verified ?? true,
	});

	await deps.oauthStateStore.delete({ state: params.state });

	return {
		localUser: {
			id: localUser.id,
		},
		claims,
		returnTo: stateData.returnTo,
		tokens: {
			accessToken: tokens.accessToken,
			idToken: tokens.idToken,
			refreshToken: tokens.refreshToken,
			expiresIn: tokens.expiresIn,
			tokenType: tokens.tokenType,
		},
		provider: params.provider ?? stateData.provider,
	};
}
