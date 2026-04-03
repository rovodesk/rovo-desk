export type SaveUserInput = {
	user: import("../domain/user").User;
	provider: string;
};

export type UpdateUserInput = {
	userId: string;
	email?: string;
	firstName?: string | null;
	lastName?: string | null;
	externalId?: string;
	metadata?: Record<string, unknown> | null;
};
