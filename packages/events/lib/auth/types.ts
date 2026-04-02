import type z from "zod";
import type { createAuthUserCreatedEvent } from "./factory";

export type AuthUserCreatedEvent = z.infer<typeof createAuthUserCreatedEvent>;

export type AuthEventType =
	| "auth.user.created"
	| "auth.user.updated"
	| "auth.user.deleted"
	| "auth.login.succeeded"
	| "auth.login.failed"
	| "auth.organization.created"
	| "auth.organization.updated"
	| "auth.organization.deleted"
	| "auth.role.created"
	| "auth.role.updated"
	| "auth.role.deleted"
	| "auth.permission.created"
	| "auth.permission.updated"
	| "auth.permission.deleted"
	| "auth.subscriber.created"
	| "auth.access_request.created";
