import { z } from "zod";
import {
	authAccessRequestCreatedEventSchema,
	authLoginFailedEventSchema,
	authLoginSucceededEventSchema,
	authOrganizationCreatedEventSchema,
	authOrganizationDeletedEventSchema,
	authOrganizationUpdatedEventSchema,
	authPermissionCreatedEventSchema,
	authPermissionDeletedEventSchema,
	authPermissionUpdatedEventSchema,
	authRoleCreatedEventSchema,
	authRoleDeletedEventSchema,
	authRoleUpdatedEventSchema,
	authUserCreatedEventSchema,
	authUserDeletedEventSchema,
	authUserUpdatedEventSchema,
} from "./events";

export type AuthUserCreatedEvent = z.infer<typeof authUserCreatedEventSchema>;
export type AuthUserUpdatedEvent = z.infer<typeof authUserUpdatedEventSchema>;
export type AuthUserDeletedEvent = z.infer<typeof authUserDeletedEventSchema>;
export type AuthLoginSucceededEvent = z.infer<
	typeof authLoginSucceededEventSchema
>;
export type AuthLoginFailedEvent = z.infer<typeof authLoginFailedEventSchema>;
export type AuthOrganizationCreatedEvent = z.infer<
	typeof authOrganizationCreatedEventSchema
>;
export type AuthOrganizationUpdatedEvent = z.infer<
	typeof authOrganizationUpdatedEventSchema
>;
export type AuthOrganizationDeletedEvent = z.infer<
	typeof authOrganizationDeletedEventSchema
>;
export type AuthRoleCreatedEvent = z.infer<typeof authRoleCreatedEventSchema>;
export type AuthRoleUpdatedEvent = z.infer<typeof authRoleUpdatedEventSchema>;
export type AuthRoleDeletedEvent = z.infer<typeof authRoleDeletedEventSchema>;
export type AuthPermissionCreatedEvent = z.infer<
	typeof authPermissionCreatedEventSchema
>;
export type AuthPermissionUpdatedEvent = z.infer<
	typeof authPermissionUpdatedEventSchema
>;
export type AuthPermissionDeletedEvent = z.infer<
	typeof authPermissionDeletedEventSchema
>;
export type AuthAccessRequestCreatedEvent = z.infer<
	typeof authAccessRequestCreatedEventSchema
>;

export const authEventSchema = z.discriminatedUnion("type", [
	authUserCreatedEventSchema,
	authUserUpdatedEventSchema,
	authUserDeletedEventSchema,
	authLoginSucceededEventSchema,
	authLoginFailedEventSchema,
	authOrganizationCreatedEventSchema,
	authOrganizationUpdatedEventSchema,
	authOrganizationDeletedEventSchema,
	authRoleCreatedEventSchema,
	authRoleUpdatedEventSchema,
	authRoleDeletedEventSchema,
	authPermissionCreatedEventSchema,
	authPermissionUpdatedEventSchema,
	authPermissionDeletedEventSchema,
	authAccessRequestCreatedEventSchema,
]);

export type AuthEvent = z.infer<typeof authEventSchema>;
