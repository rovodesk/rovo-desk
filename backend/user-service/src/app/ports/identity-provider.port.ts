// application/ports/identity-provider.port.ts

import type { UserId } from "../../domain/value-objects/user-id.vo";

export type IdentityProviderName =
	| "password"
	| "google"
	| "github"
	| "apple"
	| "oidc"
	| "saml"
	| "magic_link"
	| "cognito";

export interface ProviderIdentityProfile {
	provider: IdentityProviderName;
	providerUserId: string;
	email: string | null;
	emailVerified: boolean;
	displayName?: string | null;
	avatarUrl?: string | null;
	raw?: Record<string, unknown>;
}

export interface ExchangeAuthorizationCodeInput {
	provider: IdentityProviderName;
	code: string;
	redirectUri: string;
	codeVerifier?: string;
}

export interface AuthenticateWithPasswordInput {
	email: string;
	password: string;
}

export interface InitiateMagicLinkInput {
	email: string;
	redirectUri?: string;
}

export interface IdentityAuthenticationResult {
	subject: string;
	accessToken?: string;
	idToken?: string;
	refreshToken?: string;
	expiresIn?: number;
	profile: ProviderIdentityProfile;
}

export abstract class IIdentityProviderPort {
	abstract exchangeAuthorizationCode(
		input: ExchangeAuthorizationCodeInput
	): Promise<IdentityAuthenticationResult>;

	abstract authenticateWithPassword(
		input: AuthenticateWithPasswordInput
	): Promise<IdentityAuthenticationResult>;

	abstract initiateMagicLink(input: InitiateMagicLinkInput): Promise<void>;

	abstract getProfile(
		provider: IdentityProviderName,
		accessToken: string
	): Promise<ProviderIdentityProfile>;

	abstract linkIdentity(params: {
		userId: UserId;
		provider: IdentityProviderName;
		providerUserId: string;
	}): Promise<void>;

	abstract unlinkIdentity(params: {
		userId: UserId;
		provider: IdentityProviderName;
		providerUserId: string;
	}): Promise<void>;
}
