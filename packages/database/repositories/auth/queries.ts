import { and, desc, eq, isNull } from "drizzle-orm";
import { createDatabase } from "../../conn";
import {
	member as memberSchema,
	organization as organizationSchema,
	session as sessionSchema,
	teamMember as teamMemberSchema,
	team as teamSchema,
	user as userSchema,
} from "../../drizzle/schemas/auth.schema";

export async function getUserEmailVerificationStatus(userId: string) {
	const db = createDatabase();
	return await db
		.select({
			emailVerified: userSchema.emailVerified,
		})
		.from(userSchema)
		.where(eq(userSchema.id, userId))
		.limit(1)
		.then((res) => res[0]);
}

export async function getUserSessionBootstrap(userId: string) {
	const db = createDatabase();

	return await db
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
		.where(eq(userSchema.id, userId));
}

export async function getUserSessions(userId: string) {
	const db = createDatabase();

	return await db
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
		.where(eq(sessionSchema.userId, userId))
		.orderBy(desc(sessionSchema.createdAt));
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
<<<<<<< HEAD

export async function findReusableSession({
	userId,
	userAgent,
	deviceId,
}: {
	userId: string;
	userAgent?: string;
	deviceId?: string;
}) {
	if (!(userAgent && deviceId)) return null;

	const db = createDatabase();

	const [session] = await db
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
				eq(sessionSchema.userId, userId),
				eq(sessionSchema.userAgent, userAgent),
				eq(sessionSchema.deviceId, deviceId),
				isNull(sessionSchema.revokedAt)
			)
		)
		.limit(1);

	return session ?? null;
}
=======
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
