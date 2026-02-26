import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	jsonb,
	pgSchema,
	real,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";

export const sdkSchema = pgSchema("sdk");

export const sdk = sdkSchema.table(
	"sdk",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		description: text("description"),
		isActive: boolean("isActive").notNull().default(true),
		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp("deletedAt", { withTimezone: true }),
	},
	(t) => [index("sdks_org_idx").on(t.organizationId)]
);

export const sdkRelations = relations(sdk, ({ one, many }) => ({
	organization: one(organization, {
		fields: [sdk.organizationId],
		references: [organization.id],
	}),

	settings: one(sdkSettings, {
		fields: [sdk.id],
		references: [sdkSettings.sdkId],
	}),

	connections: many(sdkConnections),
}));

export const sdkSettings = sdkSchema.table(
	"sdk_settings",
	{
		sdkId: text("sdkId")
			.primaryKey()
			.references(() => sdk.id, { onDelete: "cascade" }),
		instruction: text("instruction"),
		welcomeMessage: text("welcomeMessage"),
		inputPlaceholder: text("inputPlaceholder"),

		primaryColor: text("primaryColor"),
		secondaryColor: text("secondaryColor"),

		model: text("model").notNull().default("gpt-4o-mini"),
		temperature: real("temperature").default(0.7),

		metadata: jsonb("metadata").$type<Record<string, unknown>>(),

		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [index("bot_settings_sdk_idx").on(t.sdkId)]
);

export const sdkSettingsRelations = relations(sdkSettings, ({ one }) => ({
	sdk: one(sdk, {
		fields: [sdkSettings.sdkId],
		references: [sdk.id],
	}),
}));

export const sdkConnections = sdkSchema.table(
	"sdk_connections",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		sdkId: text("sdkId")
			.notNull()
			.references(() => sdk.id, { onDelete: "cascade" }),

		connectionName: text("connectionName").notNull(),
		connectionSource: text("connectionSource").notNull(),
		connectionIcon: text("connectionIcon").notNull(),
		connectionType: text("connectionType")
			.notNull()
			.$type<"CLIENT" | "SERVER">(),

		authMode: text("authMode").notNull().$type<"hmac" | "asymmetric">(),

		isActive: boolean("isActive").notNull().default(true),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),

		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date()),

		deletedAt: timestamp("deletedAt", { withTimezone: true }),
	},
	(t) => [index("sdk_connections_sdk_idx").on(t.sdkId)]
);

export const sdkConnectionsRelations = relations(sdkConnections, ({ one }) => ({
	sdk: one(sdk, {
		fields: [sdkConnections.sdkId],
		references: [sdk.id],
	}),

	keys: one(sdkConnectionKeys, {
		fields: [sdkConnections.id],
		references: [sdkConnectionKeys.connectionId],
	}),

	secrets: one(sdkConnectionSecrets, {
		fields: [sdkConnections.id],
		references: [sdkConnectionSecrets.connectionId],
	}),
}));

export const sdkConnectionKeys = sdkSchema.table(
	"sdk_connection_keys",
	{
		connectionId: text("connectionId")
			.notNull()
			.references(() => sdkConnections.id, { onDelete: "cascade" }),

		publicKey: text("publicKey").notNull(),
		privateKey: text("privateKey").notNull(),

		status: text("status")
			.notNull()
			.$type<"active" | "rotating" | "expired">()
			.default("active"),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),

		expiryDate: timestamp("expiryDate", { withTimezone: true }),
	},
	(t) => [
		index("sdk_connection_keys_connection_idx").on(t.connectionId),
		uniqueIndex("sdk_connection_keys_public_key_idx").on(t.publicKey),
		uniqueIndex("sdk_connection_keys_private_key_idx").on(t.privateKey),
	]
);

export const sdkConnectionKeysRelations = relations(
	sdkConnectionKeys,
	({ one }) => ({
		connection: one(sdkConnections, {
			fields: [sdkConnectionKeys.connectionId],
			references: [sdkConnections.id],
		}),
	})
);

export const sdkConnectionSecrets = sdkSchema.table("sdk_connection_secrets", {
	connectionId: text("connectionId")
		.notNull()
		.references(() => sdkConnections.id, { onDelete: "cascade" }),

	secret: text("secret").notNull(),

	status: text("status")
		.notNull()
		.$type<"active" | "rotating" | "expired">()
		.default("active"),

	createdAt: timestamp("createdAt", { withTimezone: true })
		.defaultNow()
		.notNull(),

	expiryDate: timestamp("expiryDate", { withTimezone: true }),
});

export const sdkConnectionSecretsRelations = relations(
	sdkConnectionSecrets,
	({ one }) => ({
		connection: one(sdkConnections, {
			fields: [sdkConnectionSecrets.connectionId],
			references: [sdkConnections.id],
		}),
	})
);
