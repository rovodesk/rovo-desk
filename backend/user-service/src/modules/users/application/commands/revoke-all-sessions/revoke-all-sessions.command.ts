export interface RevokeAllSessionsCommandInput {
	userId: string;
}

export interface RevokeAllSessionsCommandOutput {
	userId: string;
	revokedCount: number;
	revokedAt: Date;
}

export class RevokeAllSessionsCommand {
	constructor(readonly input: RevokeAllSessionsCommandInput) {}
}
