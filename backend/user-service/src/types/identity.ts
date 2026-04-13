export type UserIdentityProvider =
	| "cognito"
	| "google"
	| "github"
	| "linear"
	| "oidc"
	| "saml";

export type Identity = {
	id: string;
	userId: string;
	provider: UserIdentityProvider;
	providerUserId: string;
	email?: string | null;
	emailVerified: boolean;
	isPrimary: boolean;
	lastUsedAt?: Date | null;
	linkedAt?: Date;
	metadata: Record<string, unknown>;
	createdAt: Date;
	updatedAt: Date;
};
