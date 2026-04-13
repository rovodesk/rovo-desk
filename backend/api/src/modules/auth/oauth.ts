import { APIError } from "encore.dev/api";
import type { TrustedSocialProvider } from "@/modules/auth/config";
import { user } from "~encore/clients";
import { oauthStates } from "./cache";
import { exchangeCodeForTokens } from "./cognito";
import { parseJwt } from "./utils";

interface OAuthTokens {
	accessToken: string;
	idToken: string;
	refreshToken?: string;
	expiresIn?: number;
	tokenType?: string;
}

interface OAuthClaims {
	sub: string;
	email: string;
	name?: string;
	email_verified?: boolean;
	[key: string]: unknown;
}

interface LocalUserRef {
	id: string;
}

export interface HandleOAuthCallbackResult {
	localUser: LocalUserRef;
	claims: OAuthClaims;
	returnTo?: string;
	tokens: OAuthTokens;
	provider?: TrustedSocialProvider;
}

export async function handleOAuthCallback(params: {
	code: string;
	state: string;
	provider?: TrustedSocialProvider;
}): Promise<HandleOAuthCallbackResult> {
	const stateData = await oauthStates.get({ state: params.state });
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

	const claims = parseJwt(tokens.idToken);

	const localUser = await user.ensureUserExists({
		authProvider: "cognito",
		authUserId: claims.sub,
		email: claims.email,
		name: claims.name,
		emailVerified: claims.email_verified ?? true,
	});

	await oauthStates.delete({ state: params.state });

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
