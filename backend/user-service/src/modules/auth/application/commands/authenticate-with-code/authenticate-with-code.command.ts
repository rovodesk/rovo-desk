import type { IdentityProviderName } from "../ports/identity-provider.port";

export interface AuthenticateWithCodeCommandInput {
	provider: IdentityProviderName;
	code: string;
	redirectUri: string;
	codeVerifier?: string;
}

export interface AuthenticateWithCodeCommandOutput {
	userId: string;
	email: string;
	isNewUser: boolean;
	accessToken: string;
	refreshToken?: string;
	expiresIn: number;
}

export class AuthenticateWithCodeCommand {
	constructor(readonly input: AuthenticateWithCodeCommandInput) {}
}
