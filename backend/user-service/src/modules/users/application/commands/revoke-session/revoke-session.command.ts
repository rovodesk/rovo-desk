export interface RevokeSessionCommandInput {
	userId: string;
	sessionId: string;
}

export interface RevokeSessionCommandOutput {
	userId: string;
	sessionId: string;
	revokedAt: Date;
}

export class RevokeSessionCommand {
	constructor(readonly input: RevokeSessionCommandInput) {}
}
