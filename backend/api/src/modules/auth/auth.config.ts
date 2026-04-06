import { secret } from "encore.dev/config";

/**
 * Encore secrets
 */
export const awsRegion = secret("AWS_REGION");
export const cognitoClientId = secret("COGNITO_CLIENT_ID");
export const cognitoClientSecret = secret("COGNITO_CLIENT_SECRET");
export const cognitoUserPoolId = secret("COGNITO_USER_POOL_ID");
export const cognitoDomain = secret("COGNITO_DOMAIN");

/**
 * Safe getters
 */
export function getAWSRegion(): string {
	const region = awsRegion();
	if (!region) {
		throw new Error("Missing AWS_REGION secret");
	}
	return region;
}

export function getCognitoClientId(): string {
	const clientId = cognitoClientId();
	if (!clientId) {
		throw new Error("Missing COGNITO_CLIENT_ID secret");
	}
	return clientId;
}

export function getCognitoClientSecret(): string {
	const clientSecret = cognitoClientSecret();
	if (!clientSecret) {
		throw new Error("Missing COGNITO_CLIENT_SECRET secret");
	}
	return clientSecret;
}

export function getCognitoUserPoolId(): string {
	const userPoolId = cognitoUserPoolId();
	if (!userPoolId) {
		throw new Error("Missing COGNITO_USER_POOL_ID secret");
	}
	return userPoolId;
}

export function getCognitoDomain(): string {
	const domain = cognitoDomain();
	if (!domain) {
		throw new Error("Missing COGNITO_DOMAIN secret");
	}
	return domain;
}

/**
 * Trusted social providers
 */
export const TRUSTED_SOCIAL_PROVIDERS = ["google", "github", "linear"] as const;

export type TrustedSocialProvider = "google" | "github" | "linear";

export const OAUTH_SCOPES = ["openid", "email", "profile"];
export type OauthScopes = "openid" | "email" | "profile";

/**
 * App config
 */
export const AuthConfig = {
	get issuer() {
		return `https://cognito-idp.${getAWSRegion()}.amazonaws.com/${getCognitoUserPoolId()}`;
	},

	get cognitoDomain() {
		return getCognitoDomain();
	},

	get clientId() {
		return getCognitoClientId();
	},

	get clientSecret() {
		return getCognitoClientSecret();
	},

	get region() {
		return getAWSRegion();
	},

	callbackUrl: "http://localhost:4000/auth/callback",

	allowedRedirects: [
		"http://localhost:3002",
		"http://localhost:3000",
	] as string[],

	postLoginRedirect: "http://localhost:3002",
	postLogoutRedirect: "http://localhost:3000",
	errorRedirect: "http://localhost:3002",

	scopes: OAUTH_SCOPES,
	trustedProviders: TRUSTED_SOCIAL_PROVIDERS,
};
