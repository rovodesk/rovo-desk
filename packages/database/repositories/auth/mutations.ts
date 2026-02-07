import { Placeholder } from "@zero-heads-lab/shared/utils";
import { eq } from "drizzle-orm";
import { createDatabase } from "../../conn";
import {
	member as orgMemSchema,
	organization as orgSchema,
	session as sessionSchema,
	teamMember as teamMemSchema,
	team as teamSchema,
	user as userSchema,
} from "../../drizzle/schemas/auth.schema";

import { profile as profileSchema } from "../../drizzle/schemas/profile.schema";

export async function markUserAsDeleted(userId: string) {
	const db = createDatabase();
	return await db
		.update(userSchema)
		.set({
			deletedAt: new Date(),
			role: "deleted",
		})
		.where(eq(userSchema.id, userId));
}

export async function deleteSession(sessionId: string) {
	const db = createDatabase();

	return await db.delete(sessionSchema).where(eq(sessionSchema.id, sessionId));
}

export async function markSessionAsRevoked(sessionId: string) {
	const db = createDatabase();

	return await db
		.update(sessionSchema)
		.set({
			revokedAt: new Date(),
		})
		.where(eq(sessionSchema.id, sessionId));
}

export async function createNewUserWithProfile(userId: string) {
	const orgName = "Default Workspace";
	const db = createDatabase();

	// 1. Check User exists
	const [existingUser] = await db
		.select()
		.from(userSchema)
		.where(eq(userSchema.id, userId))
		.limit(1);

	if (!existingUser) {
		throw new Error("User not found");
	}

	// 2. Generate a unique slug
	const MAX_ATTEMPTS = 5;
	let orgSlug = Placeholder.slug();

	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const [existingOrg] = await db
			.select()
			.from(orgSchema)
			.where(eq(orgSchema.slug, orgSlug))
			.limit(1);

		if (!existingOrg) break;

		orgSlug = `${Placeholder.slug()}-${crypto.randomUUID().slice(0, 6)}`;
	}

	if (!orgSlug) {
		throw new Error("Failed to generate unique organization slug");
	}

	// 3. Transaction
	return db.transaction(async (tx) => {
		// Create Organization
		const [org] = await tx
			.insert(orgSchema)
			.values({
				name: orgName,
				slug: orgSlug,
				logo: Placeholder.logo(orgName),
			})
			.returning();

		if (!org) {
			throw new Error("Org creation failed");
		}

		// Create Org Member

		await tx.insert(orgMemSchema).values({
			userId,
			organizationId: org.id,
			role: "owner",
		});

		// Update User Role
		await tx
			.update(userSchema)
			.set({ role: "organizationOwner" })
			.where(eq(userSchema.id, userId));

		// Create Team
		const [team] = await tx
			.insert(teamSchema)
			.values({
				name: "Default Team",
				organizationId: org.id,
			})
			.returning();

		if (!team) {
			throw new Error("Team creation failed");
		}

		// Create Team Member
		await tx.insert(teamMemSchema).values({
			userId,
			teamId: team.id,
		});

		// Create Profile
		await tx.insert(profileSchema).values({
			userId,
			currentOnboardingStep: "account_context",
			organizationId: org.id,
			teamId: team.id,
		});

		// Return something useful
		return {
			organizationId: org.id,
			teamId: team.id,
		};
	});
}

export async function markUserAsVerified(userId: string) {
	const db = createDatabase();
	return await db
		.update(userSchema)
		.set({
			role: "verified",
		})
		.where(eq(userSchema.id, userId));
}
