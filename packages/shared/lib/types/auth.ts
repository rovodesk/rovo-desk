export type CognitoTokenResponse = {
	access_token: string;
	id_token: string;
	refresh_token?: string;
	expires_in: string;
	token_type: "id" | "access";
};

export interface CognitoLoginSession {
	accessToken: string; // your loginToken UUID
	email: string;
	cognitoSession: string;
	challengeName?: string | null;
	createdAt: string;
	expiresAt: string;
}
