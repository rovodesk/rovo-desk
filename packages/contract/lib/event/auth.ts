import z from "zod";

export enum KindeWebhookEvent {
	organizationCreated = "organization.created",
	organizationUpdated = "organization.updated",
	userCreated = "user.created",
	userUpdated = "user.updated",
	userDeleted = "user.deleted",
	userAuthenticationFailed = "user.authentication_failed",
	userAuthenticated = "user.authenticated",
	organizationDeleted = "organization.deleted",
	roleCreated = "role.created",
	roleUpdated = "role.updated",
	roleDeleted = "role.deleted",
	permissionCreated = "permission.created",
	permissionUpdated = "permission.updated",
	permissionDeleted = "permission.deleted",
	subscriberCreated = "subscriber.created",
	accessRequestCreated = "access_request.created",
}

export const AUTH_EVENT = z.object({
	id: z.string(),
	type: z.nativeEnum(KindeWebhookEvent),
	source: z.literal("kinde"),
	payload: z.record(z.string(), z.unknown()),
	metadata: z.record(z.string(), z.string()).default({}),
	timestamp: z.string(),
});

export type AuthEvent = z.infer<typeof AUTH_EVENT>;
