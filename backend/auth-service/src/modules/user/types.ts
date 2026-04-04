import {
	identity as identitySchema,
	user as userSchema,
} from "@zero-heads-lab/database/schemas";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

/**
 * Path params
 */
export const userIdParamSchema = z.object({
	id: z.string().min(1, "User ID is required"),
});
export type UserIdParamType = z.infer<typeof userIdParamSchema>;

/**
 * Request body for user creation
 */
export const createUserRequestSchema = z.object({
	externalId: z.string().min(1, "External ID is required"),
});
export type CreateUserRequestType = z.infer<typeof createUserRequestSchema>;

/**
 * DB schemas
 */
export const selectUserSchema = createSelectSchema(userSchema);
export type SelectUserType = z.infer<typeof selectUserSchema>;
type UserFields = {
	[K in keyof SelectUserType]?: boolean;
};
export type SelectUserFields = Omit<
	UserFields,
	"id" | "externalId" | "createdAt" | "updatedAt" | "deletedAt"
>;

export const insertUserSchema = createInsertSchema(userSchema);
export type InsertUserType = z.infer<typeof insertUserSchema>;

export const updateUserSchema = createUpdateSchema(userSchema);
type UpdateUserRaw = z.infer<typeof updateUserSchema>;

type UpdateUserCleaned = Omit<
	UpdateUserRaw,
	"id" | "externalId" | "createdAt" | "updatedAt" | "deletedAt"
>;

export type UpdateUserType = UpdateUserCleaned & {
	userId: string;
};

/**
 * Request body for PATCH /:id/profile
 */
export const updateUserProfileRequestSchema = z
	.object({
		firstName: z.string().min(1).optional().nullable(),
		lastName: z.string().min(1).optional().nullable(),
		email: z.email().optional(),
		online: z.boolean().optional(),
		lastSeenAt: z.date().optional().nullable(),
		banned: z.boolean().optional(),
		bannedAt: z.date().optional().nullable(),
		bannedExpiresAt: z.date().optional().nullable(),
		bannedReason: z.string().optional().nullable(),
	})
	.strict();

export type UpdateUserProfileRequestType = z.infer<
	typeof updateUserProfileRequestSchema
>;

export const successResponseSchemaWithData = <T extends z.ZodTypeAny>(
	schema: T
) =>
	z.object({
		success: z.literal(true),
		data: schema,
	});

export const successResponseSchema = z.object({
	success: z.literal(true),
});

export const errorResponseSchema = z.object({
	success: z.literal(false),
	error: z.string(),
});

export const selectIdentitySchema = createSelectSchema(identitySchema);
export type SelectIdentityType = z.infer<typeof selectIdentitySchema>;
