import type { User } from "@/domain/user";
import type { Session } from "@/domain/value-objects/session.vo";

export interface TokenPair {
	accessToken: string;
	refreshToken?: string;
	idToken?: string;
	expiresIn: number;
	tokenType: "Bearer";
}

export interface TokenClaims {
	sub: string;
	sessionId?: string;
	email?: string;
	scope?: string[];
	roles?: string[];
	workspaceId?: string;
	[key: string]: unknown;
}

export abstract class ITokenServicePort {
	abstract issueTokens(params: {
		user: User;
		session: Session;
		expiresInSeconds?: number;
	}): Promise<TokenPair>;

	abstract verifyAccessToken(token: string): Promise<TokenClaims>;

	abstract verifyRefreshToken(token: string): Promise<TokenClaims>;

	abstract hashOpaqueToken(token: string): Promise<string>;

	abstract generateOpaqueToken(): Promise<string>;
}
