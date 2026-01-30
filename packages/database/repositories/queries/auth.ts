import { eq } from "drizzle-orm";
import { createDatabase } from "../../conn";
import {
	member as memberSchema,
	organization as organizationSchema,
	teamMember as teamMemberSchema,
	team as teamSchema,
} from "../../drizzle/schemas/auth.schema";

import { profile as profileSchema } from "../../drizzle/schemas/profile.schema";

export async function getUserOrganizations(userId: string) {
	const db = createDatabase();

	return await db
		.select({
			id: organizationSchema.id,
			name: organizationSchema.name,
			slug: organizationSchema.slug,
			logo: organizationSchema.logo,
			metadata: organizationSchema.metadata,
		})
		.from(organizationSchema)
		.innerJoin(
			memberSchema,
			eq(memberSchema.organizationId, organizationSchema.id)
		)
		.where(eq(memberSchema.userId, userId));
}

export async function getUserTeams(userId: string) {
	const db = createDatabase();

	return await db
		.select({
			id: teamSchema.id,
			name: teamSchema.name,
			organizationId: teamSchema.organizationId,
		})
		.from(teamSchema)
		.innerJoin(teamMemberSchema, eq(teamMemberSchema.teamId, teamSchema.id))
		.where(eq(teamMemberSchema.userId, userId));
}

export async function getOrganizationBySlug(slug: string) {
	const db = createDatabase();
	return await db
		.select({
			id: organizationSchema.id,
			name: organizationSchema.name,
			slug: organizationSchema.slug,
			logo: organizationSchema.logo,
			metadata: organizationSchema.metadata,
		})
		.from(organizationSchema)
		.where(eq(organizationSchema.slug, slug))
		.limit(1)
		.then((res) => res[0]);
}

export async function getProfileByUserId(userId: string) {
	const db = createDatabase();
	return await db
		.select({
			id: profileSchema.userId,
			currentOnboardingStep: profileSchema.currentOnboardingStep,
			onboardingStartedAt: profileSchema.onboardingStartedAt,
			onboardingCompletedAt: profileSchema.onboardingCompletedAt,
			organizationId: profileSchema.organizationId,
			teamId: profileSchema.teamId,
		})
		.from(profileSchema)
		.where(eq(profileSchema.userId, userId))
		.limit(1)
		.then((res) => res[0]);
}
