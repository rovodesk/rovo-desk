import { authUserCreatedEventSchema } from "./schemas";

export function createAuthUserCreatedEvent(input: {
	userId: string;
	email: string;
	name?: string | null;
	source: string;
	tenantId?: string | null;
	correlationId?: string | null;
}) {
	return authUserCreatedEventSchema.parse({
		id: crypto.randomUUID(),
		type: "auth.user.created",
		category: "auth",
		source: input.source,
		subject: `user:${input.userId}`,
		version: 1,
		occurredAt: new Date(),
		receivedAt: new Date(),
		tenantId: input.tenantId ?? null,
		metadata: {
			correlationId: input.correlationId ?? null,
		},
		payload: {
			userId: input.userId,
			email: input.email,
			name: input.name ?? null,
		},
	});
}
