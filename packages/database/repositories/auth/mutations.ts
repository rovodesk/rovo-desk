import { Placeholder } from "@zero-heads-lab/shared/utils";
import { eq } from "drizzle-orm";
import { createDatabase } from "../../conn";
import {
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

	// 1️⃣ Ensure user exists
	const [existingUser] = await db
		.select()
		.from(userSchema)
		.where(eq(userSchema.id, userId))
		.limit(1);

	if (!existingUser) {
		throw new Error("User not found");
	}

	// Prevent duplicate profile creation (important for migrations)
	const [existingProfile] = await db
		.select()
		.from(profileSchema)
		.where(eq(profileSchema.userId, userId))
		.limit(1);
	if (existingProfile) {
		throw new Error("Profile already exists");
	}

	// 2️⃣ Run everything inside ONE transaction
	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Its ok
	return db.transaction(async (tx) => {
		// 3️⃣ Create org with guaranteed unique slug
		const baseSlug = Placeholder.slug();
		// biome-ignore lint/suspicious/noExplicitAny:Add type
		let org: any;
		let attempt = 0;

		while (!org && attempt < 10) {
			const slug =
				attempt === 0
					? baseSlug
					: `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;

			try {
				[org] = await tx
					.insert(orgSchema)
					.values({
						name: orgName,
						slug,
						logo: Placeholder.logo(orgName),
					})
					.returning();
				// biome-ignore lint/suspicious/noExplicitAny: Database error
			} catch (err: any) {
				// If unique constraint fails, retry
				if (err.code === "23505") {
					attempt++;
					continue;
				}
				throw err;
			}
		}

		if (!org) {
			throw new Error("Failed to generate unique organization slug");
		}

		// 4️⃣ Update user role to owner if not already
		if (existingUser.role !== "owner") {
			await tx
				.update(userSchema)
				.set({ role: "owner" })
				.where(eq(userSchema.id, userId));
		}

		// 5️⃣ Create team
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

		// 6️⃣ Add team membership
		await tx.insert(teamMemSchema).values({
			userId,
			teamId: team.id,
		});

		// 7️⃣ Create profile
		await tx.insert(profileSchema).values({
			userId,
		});

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
