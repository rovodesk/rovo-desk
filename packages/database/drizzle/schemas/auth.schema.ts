import { relations } from "drizzle-orm";
import {
	boolean,
	index,
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
	isAdmin: boolean("isAdmin").notNull().default(false),
	isAnonymous: boolean("isAnonymous"),
	createdAt: timestamp("createdAt", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updatedAt", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp("deletedAt", { withTimezone: true }),
});

export const userRelations = relations(user, ({ many }) => ({
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
}));

export const organization = authSchema.table("organization", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	name: text("name").notNull(),

	slug: text("slug").notNull().unique(),

	logo: text("logo"),
	metadata: jsonb("metadata"),

	createdAt: timestamp("createdAt", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updatedAt: timestamp("updatedAt", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date()),

	deletedAt: timestamp("deletedAt", { withTimezone: true }),
});

export const organizationRole = authSchema.table("organizationRole", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	organizationId: text("organizationId")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),

	role: text("role").notNull().default("member"),
	permissions: jsonb("permissions").$type<string[]>().notNull(),

	createdAt: timestamp("createdAt", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updatedAt: timestamp("updatedAt", { withTimezone: true })
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

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),

		deletedAt: timestamp("deletedAt", { withTimezone: true }),
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

	acceptedAt: timestamp("acceptedAt", { withTimezone: true }),

	expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),

	createdAt: timestamp("createdAt", { withTimezone: true })
		.defaultNow()
		.notNull(),
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

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),

		updatedAt: timestamp("updatedAt", { withTimezone: true })
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

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),
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
		relationName: "organizationMember",
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

		expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),

		isAnonymous: boolean("isAnonymous"),

		activeOrganizationId: text("activeOrganizationId").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),

		activeTeamId: text("activeTeamId").references(() => team.id, {
			onDelete: "cascade",
		}),

		ipAddress: text("ipAddress"),
		userAgent: text("userAgent"),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),

		updatedAt: timestamp("updatedAt", { withTimezone: true }).$onUpdate(
			() => new Date()
		),
	},
	(t) => [
		index("sessionUserIdx").on(t.userId),
		index("sessionExpiresIdx").on(t.expiresAt),
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

		accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
			withTimezone: true,
		}),

		refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
			withTimezone: true,
		}),

		scope: text("scope"),
		idToken: text("idToken"),

		password: text("password"),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),

		updatedAt: timestamp("updatedAt", { withTimezone: true }).$onUpdate(
			() => new Date()
		),
	},
	(t) => [
		unique("accountProviderAccountIdUnique").on(t.providerId, t.accountId),
		index("accountUserIdx").on(t.userId),
	]
);

export const verification = authSchema.table(
	"verification",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		identifier: text("identifier").notNull(),
		value: text("value").notNull(),

		expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),

		updatedAt: timestamp("updatedAt", { withTimezone: true }).$onUpdate(
			() => new Date()
		),
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
