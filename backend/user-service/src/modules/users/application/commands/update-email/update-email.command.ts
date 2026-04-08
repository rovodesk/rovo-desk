export interface UpdateEmailCommandInput {
	userId: string;
	email: string;
}

export class UpdateEmailCommand {
	constructor(readonly input: UpdateEmailCommandInput) {}
}
