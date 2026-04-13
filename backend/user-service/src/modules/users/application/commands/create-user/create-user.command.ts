export interface CreateUserCommandInput {
	email: string;
	provider: string;
	providerUserId: string;
	isPrimary?: boolean;
}

export class CreateUserCommand {
	constructor(readonly input: CreateUserCommandInput) {}
}
