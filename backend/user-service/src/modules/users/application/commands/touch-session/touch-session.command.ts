export interface TouchSessionCommandInput {
	userId: string;
	sessionId: string;
}

export interface TouchSessionCommandOutput {
	userId: string;
	sessionId: string;
	lastSeenAt: Date;
}

export class TouchSessionCommand {
	constructor(readonly input: TouchSessionCommandInput) {}
}
