import type {
	WidgetConfig,
	WorkspaceSettings,
} from "@zero-heads-lab/shared/types";
import { widget } from "drizzle/schemas/widget.schema";
import { eq } from "drizzle-orm";
import type { Database } from "../../conn";
import {
	organization as orgSchema,
	session as sessionSchema,
	user as userSchema,
} from "../../drizzle/schemas/auth.schema";
import {
	userProfile,
	workspaceProfile,
} from "../../drizzle/schemas/profile.schema";

export async function markUserAsDeleted(
	database: Database,
	params: { userId: string }
) {
	return await database
		.update(userSchema)
		.set({
			deletedAt: new Date(),
			role: "deleted",
		})
		.where(eq(userSchema.id, params.userId));
}

export async function deleteSession(
	database: Database,
	params: { sessionId: string }
) {
	return await database
		.delete(sessionSchema)
		.where(eq(sessionSchema.id, params.sessionId));
}

export async function markSessionAsRevoked(
	database: Database,
	params: { sessionId: string }
) {
	return await database
		.update(sessionSchema)
		.set({
			revokedAt: new Date(),
		})
		.where(eq(sessionSchema.id, params.sessionId));
}

export async function createNewUserWithProfileTX(
	database: Database,
	params: { userId: string }
) {
	// Ensure user exists
	const [existingUser] = await database
		.select()
		.from(userSchema)
		.where(eq(userSchema.id, params.userId))
		.limit(1);

	if (!existingUser) {
		throw new Error("User not found");
	}

	// Prevent duplicate profile creation (important for migrations)
	const [existingProfile] = await database
		.select()
		.from(userProfile)
		.where(eq(userProfile.userId, params.userId))
		.limit(1);
	if (existingProfile) {
		throw new Error("Profile already exists");
	}

	return database.transaction(async (tx) => {
		await tx.insert(userProfile).values({
			userId: params.userId,
		});
	});
}

export async function markUserAsVerified(
	database: Database,
	params: { userId: string }
) {
	return await database
		.update(userSchema)
		.set({
			role: "verified",
		})
		.where(eq(userSchema.id, params.userId));
}

export async function createOrganizationWithProfileAndWidgetTX(
	database: Database,
	params: {
		organizationId: string;
		widgetConfig?: WidgetConfig;
		workspaceConfig?: WorkspaceSettings;
		subscriptionId?: string;
	}
) {
	return await database.transaction(async (tx) => {
		const [profile] = await tx
			.insert(workspaceProfile)
			.values({
				organizationId: params.organizationId,
				subscriptionId: params.subscriptionId,
				settings: params.workspaceConfig,
			})
			.returning({
				workspaceId: workspaceProfile.organizationId,
			});
		if (!profile) {
			throw new Error("Failed to create workspace profile");
		}

		await tx
			.insert(widget)
			.values({
				organizationId: profile.workspaceId,
				config: params.widgetConfig,
			})
			.onConflictDoNothing()
			.catch((err) => {
				console.error("Failed to create widget", err);
				throw err;
			});

		await tx
			.update(orgSchema)
			.set({
				logo: params.workspaceConfig?.branding?.logo,
			})
			.where(eq(orgSchema.id, params.organizationId))
			.catch((err) => {
				console.error("Failed to update organization logo", err);
				throw err;
			});
	});
}
