import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { user } from "@/infra/database/schemas";

/**
 * ----------------------------------------------------------------------------
 * Path params
 * ----------------------------------------------------------------------------
 */

export const userIdParamSchema = z.object({
	id: z.string().min(1, "User ID is required"),
});

export interface UserIdParamType {
	id: string;
}

/**
 * ----------------------------------------------------------------------------
 * API request DTOs
 * ----------------------------------------------------------------------------
 */

export const createUserRequestSchema = z.object({
	externalId: z.string().min(1, "External ID is required"),
	email: z.email(),
	firstName: z.string().optional().nullable(),
	lastName: z.string().optional().nullable(),
	avatarUrl: z.string().url().optional().nullable(),
});

export interface CreateUserRequestType {
	externalId: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	avatarUrl?: string | null;
}

export const updateUserProfileRequestSchema = z
	.object({
		firstName: z.string().min(1).optional().nullable(),
		lastName: z.string().min(1).optional().nullable(),
		email: z.email().optional(),
		online: z.boolean().optional(),
		lastSeenAt: z.iso.datetime().optional().nullable(),
		avatarUrl: z.string().url().optional().nullable(),
		banned: z.boolean().optional(),
		bannedAt: z.iso.datetime().optional().nullable(),
		bannedExpiresAt: z.iso.datetime().optional().nullable(),
		bannedReason: z.string().optional().nullable(),
	})
	.strict();

export interface UpdateUserProfileRequestType {
	firstName?: string | null;
	lastName?: string | null;
	email?: string;
	online?: boolean;
	lastSeenAt?: string | null;
	avatarUrl?: string | null;
	banned?: boolean;
	bannedAt?: string | null;
	bannedExpiresAt?: string | null;
	bannedReason?: string | null;
}

/**
 * ----------------------------------------------------------------------------
 * DB entity DTOs
 * ----------------------------------------------------------------------------
 */

export interface SelectUserType {
	id: string;
	externalId: string;
	firstName: string | null;
	lastName: string | null;
	email: string;
	online: boolean;
	lastSeenAt: string | null;
	avatarUrl: string | null;
	banned: boolean;
	bannedReason: string | null;
	bannedAt: string | null;
	bannedExpiresAt: string | null;
	metadata: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface InsertUserType {
	id: string;
	externalId: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	online?: boolean;
	lastSeenAt?: string | null;
	avatarUrl?: string | null;
	banned?: boolean;
	bannedReason?: string | null;
	bannedAt?: string | null;
	bannedExpiresAt?: string | null;
	metadata?: Record<string, unknown>;
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string | null;
}

export interface UpdateUserType {
	userId: string;
	firstName?: string | null;
	lastName?: string | null;
	email?: string;
	online?: boolean;
	lastSeenAt?: string | null;
	avatarUrl?: string | null;
	banned?: boolean;
	bannedReason?: string | null;
	bannedAt?: string | null;
	bannedExpiresAt?: string | null;
	metadata?: Record<string, unknown>;
	deletedAt?: string | null;
}

/**
 * Optional field selector support
 */
export type SelectUserFields = {
	firstName?: boolean;
	lastName?: boolean;
	email?: boolean;
	online?: boolean;
	lastSeenAt?: boolean;
	avatarUrl?: boolean;
	banned?: boolean;
	bannedReason?: boolean;
	bannedAt?: boolean;
	bannedExpiresAt?: boolean;
	metadata?: boolean;
};

/**
 * Optional validators
 */
export const selectUserSchema = createSelectSchema(user);
export const insertUserSchema = createInsertSchema(user);
export const updateUserSchema = createUpdateSchema(user);

/**
 * Generic API responses
 */
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
