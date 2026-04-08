export interface AuthenticateWithPasswordCommandInput {
	email: string;
	password: string;
}

export interface AuthenticateWithPasswordCommandOutput {
	userId: string;
	email: string;
	accessToken: string;
	refreshToken?: string;
	expiresIn: number;
}

export class AuthenticateWithPasswordCommand {
	constructor(readonly input: AuthenticateWithPasswordCommandInput) {}
}
