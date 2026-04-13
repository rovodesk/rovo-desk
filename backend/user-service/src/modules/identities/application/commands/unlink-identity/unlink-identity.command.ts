export interface UnlinkIdentityCommandInput {
	userId: string;
	provider: string;
	providerUserId: string;
}

export class UnlinkIdentityCommand {
	constructor(readonly input: UnlinkIdentityCommandInput) {}
}
