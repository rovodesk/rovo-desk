import { generateUUID, Placeholder } from "@zero-heads-lab/shared/utils";
import { eq } from "drizzle-orm";
import { createDatabase } from "../../conn";
import {
	member as orgMemSchema,
	organization as orgSchema,
	teamMember as teamMemSchema,
	team as teamSchema,
} from "../../drizzle/schemas/auth.schema";
import { profile as profileSchema } from "../../drizzle/schemas/profile.schema";

export async function createNewUserProfile(userId: string) {
	const orgName = "Default Workspace";
	let orgSlug = Placeholder.slug();

	const db = createDatabase();

	// Check slug once
	const existingOrg = await db
		.select()
		.from(orgSchema)
		.where(eq(orgSchema.slug, orgSlug))
		.limit(1);

	if (existingOrg.length > 0) {
		orgSlug = `${generateUUID(orgSlug).slice(0, 4)}`;
	}

	return await db.transaction(async (tx) => {
		// 1. Create Organization
		const [org] = await tx
			.insert(orgSchema)
			.values({
				name: orgName,
				slug: orgSlug,
				logo: Placeholder.logo(orgName),
			})
			.returning();

		if (!org) throw new Error("Org creation failed");

		// 2. Create Org Member
		await tx.insert(orgMemSchema).values({
			userId,
			organizationId: org.id,
			role: "owner",
		});

		// 3. Create Team
		const [team] = await tx
			.insert(teamSchema)
			.values({
				name: "Default Team",
				organizationId: org.id,
			})
			.returning();

		if (!team) throw new Error("Team creation failed");

		// 4. Create Team Member & Profile
		await Promise.all([
			tx.insert(teamMemSchema).values({ userId, teamId: team.id }),
			tx.insert(profileSchema).values({
				userId,
				currentOnboardingStep: "account_context",
				organizationId: org.id,
				teamId: team.id,
			}),
		]);

		return { orgId: org.id, teamId: team.id };
	});
}
