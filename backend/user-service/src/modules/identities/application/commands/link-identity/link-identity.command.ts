export interface LinkIdentityCommandInput {
	userId: string;
	provider: string;
	providerUserId: string;
	email?: string | null;
	isPrimary?: boolean;
}

export class LinkIdentityCommand {
	constructor(readonly input: LinkIdentityCommandInput) {}
}
