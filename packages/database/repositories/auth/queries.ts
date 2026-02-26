import { and, desc, eq, isNull, sql } from "drizzle-orm";
import type { Database } from "../../conn";
import {
	member as memberSchema,
	organization as organizationSchema,
	session as sessionSchema,
	teamMember as teamMemberSchema,
	team as teamSchema,
	user as userSchema,
} from "../../drizzle/schemas/auth.schema";

export async function getUserEmailVerificationStatus(
	database: Database,
	params: {
		userId: string;
	}
) {
	return await database
		.select({
			emailVerified: userSchema.emailVerified,
		})
		.from(userSchema)
		.where(eq(userSchema.id, params.userId))
		.limit(1)
		.then((res) => res[0]);
}

export async function getUserSessionBootstrap(
	database: Database,
	params: {
		userId: string;
	}
) {
	return await database
		.select({
			email: userSchema.email,

			organizationId: organizationSchema.id,
			organizationName: organizationSchema.name,
			organizationSlug: organizationSchema.slug,
			organizationLogo: organizationSchema.logo,
			organizationMetadata: organizationSchema.metadata,

			teamId: teamSchema.id,
			teamName: teamSchema.name,
			teamOrganizationId: teamSchema.organizationId,
		})
		.from(userSchema)
		.leftJoin(memberSchema, eq(memberSchema.userId, userSchema.id))
		.leftJoin(
			organizationSchema,
			eq(memberSchema.organizationId, organizationSchema.id)
		)
		.leftJoin(teamMemberSchema, eq(teamMemberSchema.userId, userSchema.id))
		.leftJoin(teamSchema, eq(teamMemberSchema.teamId, teamSchema.id))
		.where(eq(userSchema.id, params.userId));
}

export async function getUserSessions(
	database: Database,
	params: {
		userId: string;
	}
) {
	return await database
		.select({
			id: sessionSchema.id,
			userId: sessionSchema.userId,
			createdAt: sessionSchema.createdAt,
			lastActiveAt: sessionSchema.lastActiveAt,
			expiresAt: sessionSchema.expiresAt,
			ipAddress: sessionSchema.ipAddress,
			userAgent: sessionSchema.userAgent,
			deviceId: sessionSchema.deviceId,
			activeOrganizationId: sessionSchema.activeOrganizationId,
			activeTeamId: sessionSchema.activeTeamId,
		})
		.from(sessionSchema)
		.where(eq(sessionSchema.userId, params.userId))
		.orderBy(desc(sessionSchema.createdAt));
}

export async function getOrganizationBySlug(
	database: Database,
	params: {
		slug: string;
	}
) {
	return await database
		.select({
			id: organizationSchema.id,
			name: organizationSchema.name,
			slug: organizationSchema.slug,
			logo: organizationSchema.logo,
			metadata: organizationSchema.metadata,
		})
		.from(organizationSchema)
		.where(eq(organizationSchema.slug, params.slug))
		.limit(1)
		.then((res) => res[0]);
}

export async function getUserOrganizations(
	database: Database,
	params: { userId: string }
) {
	const [organizations] = await database
		.select({
			id: organizationSchema.id,
			name: organizationSchema.name,
			slug: organizationSchema.slug,
			logo: organizationSchema.logo,
			metadata: organizationSchema.metadata,
		})
		.from(userSchema)
		.leftJoin(memberSchema, eq(memberSchema.userId, userSchema.id))
		.leftJoin(
			organizationSchema,
			eq(memberSchema.organizationId, organizationSchema.id)
		)
		.where(eq(userSchema.id, params.userId))
		.orderBy(desc(organizationSchema.createdAt));

	return organizations;
}

export async function countUserOrganizations(
	database: Database,
	params: { userId: string }
) {
	return await database
		.select({
			count: sql<number>`count(*)`,
		})
		.from(userSchema)
		.leftJoin(memberSchema, eq(memberSchema.userId, userSchema.id))
		.leftJoin(
			organizationSchema,
			eq(memberSchema.organizationId, organizationSchema.id)
		)
		.where(eq(userSchema.id, params.userId))
		.limit(1)
		.then((res) => res[0]);
}

export async function findReusableSession(
	database: Database,
	params: {
		userId: string;
		userAgent?: string;
		deviceId?: string;
	}
) {
	if (!(params.userAgent && params.deviceId)) return null;

	const [session] = await database
		.select({
			id: sessionSchema.id,
			userId: sessionSchema.userId,
			createdAt: sessionSchema.createdAt,
			lastActiveAt: sessionSchema.lastActiveAt,
			expiresAt: sessionSchema.expiresAt,
			ipAddress: sessionSchema.ipAddress,
			userAgent: sessionSchema.userAgent,
			deviceId: sessionSchema.deviceId,
			activeOrganizationId: sessionSchema.activeOrganizationId,
			activeTeamId: sessionSchema.activeTeamId,
		})
		.from(sessionSchema)
		.where(
			and(
				eq(sessionSchema.userId, params.userId),
				eq(sessionSchema.userAgent, params.userAgent),
				eq(sessionSchema.deviceId, params.deviceId),
				isNull(sessionSchema.revokedAt)
			)
		)
		.limit(1);

	return session ?? null;
}
