import { z } from "zod";
import { baseEventSchema } from "../../base";

/* ---------------------------------- */
/* USER                               */
/* ---------------------------------- */

export const authUserCreatedPayloadSchema = z.object({
	userId: z.string(),
	externalId: z.string().optional(),
	email: z.string().email(),
	username: z.string().nullable().optional(),
	firstName: z.string().nullable().optional(),
	lastName: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	avatarUrl: z.string().url().nullable().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

export const authUserUpdatedPayloadSchema = authUserCreatedPayloadSchema
	.partial()
	.extend({
		userId: z.string(),
	});

export const authUserDeletedPayloadSchema = z.object({
	userId: z.string(),
	deletedAt: z.coerce.date().optional(),
});

export const authLoginSucceededPayloadSchema = z.object({
	userId: z.string(),
	email: z.string().email().optional(),
	provider: z.string().optional(),
	organizationId: z.string().optional(),
});

export const authLoginFailedPayloadSchema = z.object({
	email: z.string().email().optional(),
	provider: z.string().optional(),
	reason: z.string().optional(),
});

/* ---------------------------------- */
/* ORGANIZATION                       */
/* ---------------------------------- */

export const authOrganizationCreatedPayloadSchema = z.object({
	organizationId: z.string(),
	externalId: z.string().optional(),
	slug: z.string(),
	name: z.string(),
	logoUrl: z.string().url().nullable().optional(),
	allowRegistrations: z.boolean().optional(),
});

export const authOrganizationUpdatedPayloadSchema =
	authOrganizationCreatedPayloadSchema.partial().extend({
		organizationId: z.string(),
	});

export const authOrganizationDeletedPayloadSchema = z.object({
	organizationId: z.string(),
	deletedAt: z.coerce.date().optional(),
});

/* ---------------------------------- */
/* ROLE                               */
/* ---------------------------------- */

export const authRoleCreatedPayloadSchema = z.object({
	roleId: z.string(),
	organizationId: z.string().nullable().optional(),
	externalId: z.string().optional(),
	key: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	isDefault: z.boolean().optional(),
	isSystem: z.boolean().optional(),
});

export const authRoleUpdatedPayloadSchema = authRoleCreatedPayloadSchema
	.partial()
	.extend({
		roleId: z.string(),
	});

export const authRoleDeletedPayloadSchema = z.object({
	roleId: z.string(),
	organizationId: z.string().nullable().optional(),
});

/* ---------------------------------- */
/* PERMISSION                         */
/* ---------------------------------- */

export const authPermissionCreatedPayloadSchema = z.object({
	permissionId: z.string(),
	externalId: z.string().optional(),
	key: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
});

export const authPermissionUpdatedPayloadSchema =
	authPermissionCreatedPayloadSchema.partial().extend({
		permissionId: z.string(),
	});

export const authPermissionDeletedPayloadSchema = z.object({
	permissionId: z.string(),
});

/* ---------------------------------- */
/* ACCESS REQUEST                     */
/* ---------------------------------- */

export const authAccessRequestCreatedPayloadSchema = z.object({
	accessRequestId: z.string(),
	email: z.string().email(),
	firstName: z.string().nullable().optional(),
	lastName: z.string().nullable().optional(),
	externalUserId: z.string().nullable().optional(),
	organizationId: z.string().nullable().optional(),
	status: z.enum(["pending", "approved", "rejected"]).optional(),
});

/* ---------------------------------- */
/* EVENT WRAPPERS                     */
/* ---------------------------------- */

export const authUserCreatedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.user.created"),
	category: z.literal("auth"),
	subject: z.string().regex(/^user:/),
	payload: authUserCreatedPayloadSchema,
});

export const authUserUpdatedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.user.updated"),
	category: z.literal("auth"),
	subject: z.string().regex(/^user:/),
	payload: authUserUpdatedPayloadSchema,
});

export const authUserDeletedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.user.deleted"),
	category: z.literal("auth"),
	subject: z.string().regex(/^user:/),
	payload: authUserDeletedPayloadSchema,
});

export const authLoginSucceededEventSchema = baseEventSchema.extend({
	type: z.literal("auth.login.succeeded"),
	category: z.literal("auth"),
	subject: z.string().regex(/^user:/),
	payload: authLoginSucceededPayloadSchema,
});

export const authLoginFailedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.login.failed"),
	category: z.literal("auth"),
	subject: z.string().regex(/^login:/),
	payload: authLoginFailedPayloadSchema,
});

export const authOrganizationCreatedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.organization.created"),
	category: z.literal("auth"),
	subject: z.string().regex(/^organization:/),
	payload: authOrganizationCreatedPayloadSchema,
});

export const authOrganizationUpdatedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.organization.updated"),
	category: z.literal("auth"),
	subject: z.string().regex(/^organization:/),
	payload: authOrganizationUpdatedPayloadSchema,
});

export const authOrganizationDeletedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.organization.deleted"),
	category: z.literal("auth"),
	subject: z.string().regex(/^organization:/),
	payload: authOrganizationDeletedPayloadSchema,
});

export const authRoleCreatedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.role.created"),
	category: z.literal("auth"),
	subject: z.string().regex(/^role:/),
	payload: authRoleCreatedPayloadSchema,
});

export const authRoleUpdatedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.role.updated"),
	category: z.literal("auth"),
	subject: z.string().regex(/^role:/),
	payload: authRoleUpdatedPayloadSchema,
});

export const authRoleDeletedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.role.deleted"),
	category: z.literal("auth"),
	subject: z.string().regex(/^role:/),
	payload: authRoleDeletedPayloadSchema,
});

export const authPermissionCreatedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.permission.created"),
	category: z.literal("auth"),
	subject: z.string().regex(/^permission:/),
	payload: authPermissionCreatedPayloadSchema,
});

export const authPermissionUpdatedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.permission.updated"),
	category: z.literal("auth"),
	subject: z.string().regex(/^permission:/),
	payload: authPermissionUpdatedPayloadSchema,
});

export const authPermissionDeletedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.permission.deleted"),
	category: z.literal("auth"),
	subject: z.string().regex(/^permission:/),
	payload: authPermissionDeletedPayloadSchema,
});

export const authAccessRequestCreatedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.access_request.created"),
	category: z.literal("auth"),
	subject: z.string().regex(/^access_request:/),
	payload: authAccessRequestCreatedPayloadSchema,
});
