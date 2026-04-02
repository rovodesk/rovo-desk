import {
	boolean,
	index,
	jsonb,
	pgSchema,
	primaryKey,
	text,
	timestamp,
	unique,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");

export const membershipStatusEnum = authSchema.enum("membership_status", [
	"active",
	"invited",
	"suspended",
	"removed",
]);

export const invitationStatusEnum = authSchema.enum("invitation_status", [
	"pending",
	"accepted",
	"expired",
	"revoked",
]);

export const user = authSchema.table("user", {
	id: text("id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),

	externalId: text("external_id").unique().notNull(), // Kinde user.id

	email: text("email").notNull().unique(),
	username: text("username"),

	firstName: text("first_name"),
	lastName: text("last_name"),
	phone: text("phone"),

	avatarUrl: text("avatar_url"),

	banned: boolean("banned").notNull().default(false),
	bannedReason: text("banned_reason"),
	bannedAt: timestamp("banned_at", { withTimezone: true }),
	bannedExpiresAt: timestamp("banned_expires_at", { withTimezone: true }),

	metadata: jsonb("metadata").notNull().default({}),

	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
export const organization = authSchema.table("organization", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	externalId: text("external_id").unique(), // Kinde external_id if present
	slug: text("slug").notNull().unique(), // Kinde org handle

	name: text("name").notNull(),
	logoUrl: text("logo_url"),

	allowRegistrations: boolean("allow_registrations").notNull().default(false),

	stripeCustomerId: text("stripe_customer_id").unique(),

	metadata: jsonb("metadata").notNull().default({}),

	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const membership = authSchema.table(
	"membership",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),

		status: membershipStatusEnum("status").notNull().default("active"),

		invitedByUserId: text("invited_by_user_id").references(() => user.id, {
			onDelete: "set null",
		}),

		isDefault: boolean("is_default").notNull().default(false),
		joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
		lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),

		metadata: jsonb("metadata"),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp("deleted_at"),
	},
	(t) => [
		uniqueIndex("membership_default_org_unique").on(t.organizationId),
		unique("membership_user_org_unique").on(t.userId, t.organizationId),
		index("membership_org_idx").on(t.organizationId),
		index("membership_user_idx").on(t.userId),
		index("membership_status_idx").on(t.status),
	]
);

export const organizationPermission = authSchema.table(
	"organizationPermission",
	{
		id: text("id").primaryKey().notNull(),
		name: text("name").notNull(),

		externalId: text("externalId").unique(),

		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp("deletedAt"),
	}
);

export const team = authSchema.table(
	"team",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),

		name: text("name").notNull(),
		slug: text("slug").notNull(),

		description: text("description"),
		color: text("color"),

		metadata: jsonb("metadata").notNull().default({}),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp("deleted_at", { withTimezone: true }),
	},
	(t) => [
		index("team_org_idx").on(t.organizationId),
		unique("team_org_slug_unique").on(t.organizationId, t.slug),
	]
);

export const teamMembership = authSchema.table(
	"team_membership",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		teamId: text("team_id")
			.notNull()
			.references(() => team.id, { onDelete: "cascade" }),

		membershipId: text("membership_id")
			.notNull()
			.references(() => membership.id, { onDelete: "cascade" }),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(t) => [
		unique("team_membership_unique").on(t.teamId, t.membershipId),
		index("team_membership_team_idx").on(t.teamId),
		index("team_membership_membership_idx").on(t.membershipId),
	]
);

export const invitation = authSchema.table(
	"invitation",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),

		teamId: text("team_id").references(() => team.id, { onDelete: "set null" }),

		email: text("email").notNull(),

		invitedByUserId: text("invited_by_user_id").references(() => user.id, {
			onDelete: "set null",
		}),

		status: invitationStatusEnum("status").notNull().default("pending"), // pending, accepted, expired, revoked

		token: text("token").unique(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		acceptedAt: timestamp("accepted_at", { withTimezone: true }),

		metadata: jsonb("metadata").notNull().default({}),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [
		index("invitation_org_idx").on(t.organizationId),
		index("invitation_email_idx").on(t.email),
		index("invitation_status_idx").on(t.status),
	]
);

export const role = authSchema.table(
	"role",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		organizationId: text("organization_id").references(() => organization.id, {
			onDelete: "cascade",
		}), // nullable = global/system role

		externalId: text("external_id").unique(), // Kinde role.id
		key: text("key").notNull(),
		name: text("name").notNull(),
		description: text("description"),

		isDefault: boolean("is_default").notNull().default(false),
		isSystem: boolean("is_system").notNull().default(false),

		metadata: jsonb("metadata").notNull().default({}),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp("deleted_at", { withTimezone: true }),
	},
	(t) => [
		index("role_org_idx").on(t.organizationId),
		unique("role_org_key_unique").on(t.organizationId, t.key),
	]
);

export const permission = authSchema.table("permission", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	externalId: text("external_id").unique(), // Kinde permission.id
	key: text("key").notNull().unique(),
	name: text("name").notNull(),
	description: text("description"),

	metadata: jsonb("metadata").notNull().default({}),

	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const rolePermission = authSchema.table(
	"role_permission",
	{
		roleId: text("role_id")
			.notNull()
			.references(() => role.id, { onDelete: "cascade" }),

		permissionId: text("permission_id")
			.notNull()
			.references(() => permission.id, { onDelete: "cascade" }),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(t) => [
		primaryKey({ columns: [t.roleId, t.permissionId] }),
		index("role_permission_role_idx").on(t.roleId),
		index("role_permission_permission_idx").on(t.permissionId),
	]
);

export const membershipRole = authSchema.table(
	"membership_role",
	{
		membershipId: text("membership_id")
			.notNull()
			.references(() => membership.id, { onDelete: "cascade" }),

		roleId: text("role_id")
			.notNull()
			.references(() => role.id, { onDelete: "cascade" }),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(t) => [
		primaryKey({ columns: [t.membershipId, t.roleId] }),
		index("membership_role_membership_idx").on(t.membershipId),
		index("membership_role_role_idx").on(t.roleId),
	]
);

export const providerIdentity = authSchema.table(
	"provider_identity",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		provider: text("provider").notNull().default("kinde"), // Kinde is default
		providerUserId: text("provider_user_id").notNull(),

		email: text("email"),
		subject: text("subject"),

		metadata: jsonb("metadata"),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [
		unique("provider_identity_provider_user_unique").on(
			t.provider,
			t.providerUserId
		),
		index("provider_identity_user_idx").on(t.userId),
	]
);

export const accessRequest = authSchema.table("access_request", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	email: text("email").notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),

	externalUserId: text("external_user_id"), // Kinde user_id if present
	organizationId: text("organization_id").references(() => organization.id, {
		onDelete: "set null",
	}),

	status: text("status").notNull().default("pending"), // pending, approved, rejected

	metadata: jsonb("metadata").notNull().default({}),

	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const auditLog = authSchema.table(
	"audit_log",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		organizationId: text("organization_id").references(() => organization.id, {
			onDelete: "set null",
		}),
		userId: text("user_id").references(() => user.id, {
			onDelete: "set null",
		}),

		action: text("action").notNull(),
		targetType: text("target_type").notNull(),
		targetId: text("target_id").notNull(),

		actorType: text("actor_type"),
		actorId: text("actor_id"),

		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),

		metadata: jsonb("metadata").notNull().default({}),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(t) => [
		index("audit_log_org_idx").on(t.organizationId),
		index("audit_log_user_idx").on(t.userId),
		index("audit_log_action_idx").on(t.action),
	]
);
