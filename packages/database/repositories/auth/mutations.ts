import { generateUUID, Placeholder } from "@zero-heads-lab/shared/utils";
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
import { subscription as billingSubscriptionSchema } from "../../drizzle/schemas/billing.schema";

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

	// Check User
	const existingUser = await db
		.select()
		.from(userSchema)
		.where(eq(userSchema.id, userId))
		.limit(1);

	if (existingUser.length === 0) {
		throw new Error("User not found");
	}

	// Generate a unique slug (loop until available)
	let orgSlug = Placeholder.slug();
	const MAX_ATTEMPTS = 5;
	let attempt = 0;

	while (attempt < MAX_ATTEMPTS) {
		const existingOrg = await db
			.select()
			.from(orgSchema)
			.where(eq(orgSchema.slug, orgSlug))
			.limit(1);

		if (existingOrg.length === 0) {
			break;
		}

		orgSlug = `${Placeholder.slug()}-${generateUUID(orgSlug).slice(0, 4)}`;
		attempt++;
	}

	if (attempt === MAX_ATTEMPTS) {
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

		// 2. Create Org Member
		try {
			await tx.insert(orgMemSchema).values({
				userId,
				organizationId: org.id,
				role: "owner",
			});
		} catch {
			tx.rollback();
			throw new Error("Org member creation failed");
		}
		// Create Org Member
		await tx.insert(orgMemSchema).values({
			userId,
			organizationId: org.id,
			role: "owner",
		});

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

		// 4. Create Team Member & Profile
		try {
			await Promise.all([
				tx.insert(teamMemSchema).values({ userId, teamId: team.id }),
				tx.insert(profileSchema).values({
					userId,
					currentOnboardingStep: "account_context",
					organizationId: org.id,
					teamId: team.id,
				}),
			]);
		} catch {
			tx.rollback();
			throw new Error("Team member creation failed");
		}

		// Create Team Member
		await tx.insert(teamMemSchema).values({
			userId,
			teamId: team.id,
		});

		// Update User Role
		await tx
			.update(userSchema)
			.set({ role: "organizationOwner" })
			.where(eq(userSchema.id, userId));

		// Create Billing Subscription
		const [subscription] = await tx
			.insert(billingSubscriptionSchema)
			.values({
				plan: "basic",
				referenceId: org.id,
				status: "active",
				seats: 1,
				createdAt: new Date(),
			})
			.returning();

		if (!subscription) {
			throw new Error("Subscription creation failed");
		}

		// Create Profile
		await tx.insert(profileSchema).values({
			userId,
			currentOnboardingStep: "account_context",
			organizationId: org.id,
			teamId: team.id,
			subscriptionId: subscription.id,
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
