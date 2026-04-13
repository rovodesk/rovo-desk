import type { TrustedSocialProvider } from "@/modules/auth/config";

export type TokenResponse = {
	access_token: string;
	id_token: string;
	refresh_token?: string;
	expires_in: string;
	token_type: "id" | "access";
};

export interface LoginSession {
	accessToken: string; // your loginToken UUID
	email: string;
	cognitoSession: string;
	challengeName?: string | null;
	createdAt: string;
	expiresAt: string;
}

export interface OAuthStateData {
	codeVerifier: string;
	provider: TrustedSocialProvider;
	returnTo?: string;
	createdAt: string;
}
