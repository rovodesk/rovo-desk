import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	jsonb,
	pgSchema,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");

export const user = authSchema.table("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull().default(false),
	image: text("image"),
	isAnonymous: boolean("isAnonymous"),
	lastLoginMethod: text("lastLoginMethod"),
	role: text("role").notNull().default("unverified"),
	banned: boolean("banned"),
	banReason: text("banReason"),
	banExpires: timestamp("banExpires"),
	stripeCustomerId: text("stripeCustomerId"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt")
		.defaultNow()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp("deletedAt"),
});

export const userRelations = relations(user, ({ many, one }) => ({
	sessions: many(session, {
		relationName: "userSessions",
	}),
	accounts: many(account, {
		relationName: "userAccounts",
	}),
	memberships: many(member, {
		relationName: "userMemberships",
	}),
	teamMemberships: many(teamMember, {
		relationName: "userTeamMemberships",
	}),
	invitationsSent: many(invitation, {
		relationName: "userInvitationsSent",
	}),
	passkey: one(passkey, {
		fields: [user.id],
		references: [passkey.userId],
		relationName: "userPasskey",
	}),
}));

export const organization = authSchema.table("organization", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	name: text("name").notNull(),

	slug: text("slug").notNull().unique(),

	logo: text("logo"),
	metadata: jsonb("metadata"),
	stripeCustomerId: text("stripeCustomerId"),

	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt")
		.defaultNow()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp("deletedAt"),
});

export const organizationRole = authSchema.table("organizationRole", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	organizationId: text("organizationId")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),

	role: text("role").notNull().default("member"),
	permission: text("permission").notNull(),

	createdAt: timestamp("createdAt").defaultNow().notNull(),

	updatedAt: timestamp("updatedAt")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const member = authSchema.table(
	"member",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),

		role: text("role").notNull().default("member"),

		createdAt: timestamp("createdAt").defaultNow().notNull(),

		deletedAt: timestamp("deletedAt"),
	},
	(t) => [
		unique("memberUserOrgUnique").on(t.userId, t.organizationId),
		index("memberOrgIdx").on(t.organizationId),
		index("memberUserIdx").on(t.userId),
	]
);

export const invitation = authSchema.table("invitation", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	email: text("email").notNull(),

	inviterId: text("inviterId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	organizationId: text("organizationId")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),

	teamId: text("teamId").references(() => team.id, { onDelete: "cascade" }),

	role: text("role").notNull().default("member"),

	status: text("status").notNull().default("pending"),

	acceptedAt: timestamp("acceptedAt"),

	expiresAt: timestamp("expiresAt").notNull(),

	createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const team = authSchema.table(
	"team",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		name: text("name").notNull(),

		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),

		createdAt: timestamp("createdAt").defaultNow().notNull(),

		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [index("teamOrgIdx").on(t.organizationId)]
);

export const teamMember = authSchema.table(
	"teamMember",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		teamId: text("teamId")
			.notNull()
			.references(() => team.id, { onDelete: "cascade" }),

		createdAt: timestamp("createdAt").defaultNow().notNull(),
	},
	(t) => [
		unique("teamMemberUserTeamUnique").on(t.userId, t.teamId),
		index("teamMemberTeamIdx").on(t.teamId),
	]
);

export const organizationRelations = relations(organization, ({ many }) => ({
	members: many(member, {
		relationName: "organizationMembers",
	}),
	teams: many(team, {
		relationName: "organizationTeams",
	}),
	invitations: many(invitation, {
		relationName: "organizationInvitations",
	}),
	roles: many(organizationRole, {
		relationName: "organizationRoles",
	}),
}));

export const memberRelations = relations(member, ({ one }) => ({
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
		relationName: "userMember",
	}),

	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id],
		relationName: "member",
	}),
}));

export const teamRelations = relations(team, ({ one, many }) => ({
	organization: one(organization, {
		fields: [team.organizationId],
		references: [organization.id],
		relationName: "teamOrganization",
	}),

	members: many(teamMember, {
		relationName: "teamMembers",
	}),

	invitations: many(invitation, {
		relationName: "teamInvitations",
	}),
}));

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
	user: one(user, {
		fields: [teamMember.userId],
		references: [user.id],
		relationName: "teamMemberUser",
	}),

	team: one(team, {
		fields: [teamMember.teamId],
		references: [team.id],
		relationName: "teamMemberTeam",
	}),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
	inviter: one(user, {
		fields: [invitation.inviterId],
		references: [user.id],
		relationName: "inviter",
	}),

	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id],
		relationName: "organizationInvitation",
	}),

	team: one(team, {
		fields: [invitation.teamId],
		references: [team.id],
		relationName: "teamInvitation",
	}),
}));

export const session = authSchema.table(
	"session",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		token: text("token").notNull().unique(),
		deviceId: text("deviceId"),

		expiresAt: timestamp("expiresAt").notNull(),

		isAnonymous: boolean("isAnonymous"),

		impersonatedBy: text("impersonatedBy").references(() => user.id, {
			onDelete: "cascade",
		}),

		activeOrganizationId: text("activeOrganizationId").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),

		activeTeamId: text("activeTeamId").references(() => team.id, {
			onDelete: "cascade",
		}),

		ipAddress: text("ipAddress"),
		userAgent: text("userAgent"),

		createdAt: timestamp("createdAt").defaultNow().notNull(),

		lastActiveAt: timestamp("lastActiveAt").defaultNow().notNull(),

		// 🔑 NEW: soft revocation
		revokedAt: timestamp("revokedAt"),
	},
	(t) => [
		index("sessionUserIdx").on(t.userId),
		index("sessionExpiresIdx").on(t.expiresAt),

		// 🔒 Critical: enforce one active session per device
		index("sessionActiveDeviceIdx").on(t.userId, t.deviceId),
	]
);

export const account = authSchema.table(
	"account",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		providerId: text("providerId").notNull(),
		accountId: text("accountId").notNull(),

		accessToken: text("accessToken"),
		refreshToken: text("refreshToken"),

		accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),

		refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),

		scope: text("scope"),
		idToken: text("idToken"),

		password: text("password"),

		createdAt: timestamp("createdAt").defaultNow().notNull(),

		updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
	},
	(t) => [
		unique("accountProviderAccountIdUnique").on(t.providerId, t.accountId),
		index("accountUserIdx").on(t.userId),
	]
);

export const passkey = authSchema.table(
	"passkey",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text("name"),
		publicKey: text("publicKey").notNull(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		credentialId: text("credentialId").notNull().unique(),
		counter: integer("counter").notNull(),
		deviceType: text("deviceType").notNull(),
		backedUp: boolean("backedUp").notNull(),
		transports: text("transports"),
		createdAt: timestamp("createdAt").defaultNow(),
		aaguid: text("aaguid"),
	},
	(t) => [index("passkeyUserIdx").on(t.userId)]
);

export const passkeyRelations = relations(passkey, ({ one }) => ({
	user: one(user, {
		fields: [passkey.userId],
		references: [user.id],
		relationName: "userPasskey",
	}),
}));

export const verification = authSchema.table(
	"verification",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		identifier: text("identifier").notNull(),
		value: text("value").notNull(),

		expiresAt: timestamp("expiresAt").notNull(),

		createdAt: timestamp("createdAt").defaultNow().notNull(),

		updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
	},
	(t) => [
		unique("verificationIdentifierValueUnique").on(t.identifier, t.value),
		index("verificationIdentifierIdx").on(t.identifier),
	]
);

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
		relationName: "userSession",
	}),

	activeOrganization: one(organization, {
		fields: [session.activeOrganizationId],
		references: [organization.id],
		relationName: "activeOrganizationSession",
	}),

	activeTeam: one(team, {
		fields: [session.activeTeamId],
		references: [team.id],
		relationName: "activeTeamSession",
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
		relationName: "userAccount",
	}),
}));

export const apiKey = authSchema.table(
	"apiKey",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		name: text("name"),
		start: text("start"),
		prefix: text("prefix"),
		key: text("key").notNull(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		refillInterval: integer("refillInterval"),
		refillAmount: integer("refillAmount"),
		lastRefillAt: timestamp("lastRefillAt"),
		enabled: boolean("enabled").notNull().default(true),
		rateLimitEnabled: boolean("rateLimitEnabled").notNull().default(true),
		rateLimitTimeWindow: integer("rateLimitTimeWindow"),
		rateLimitMax: integer("rateLimitMax"),
		requestCount: integer("requestCount").notNull().default(0),
		remaining: integer("remaining"),
		lastRequestAt: timestamp("lastRequestAt"),
		expiresAt: timestamp("expiresAt"),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
		permissions: text("permissions"),
		metadata: jsonb("metadata"),
	},
	(t) => [index("apiKeyUserIdx").on(t.userId)]
);

export const apiKeyRelations = relations(apiKey, ({ one }) => ({
	user: one(user, {
		fields: [apiKey.userId],
		references: [user.id],
		relationName: "userApiKey",
	}),
}));

export const jwksSchema = authSchema.table("jwks", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	publicKey: text("publicKey").notNull(),
	privateKey: text("privateKey").notNull(),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	expiresAt: timestamp("expiresAt"),
});
