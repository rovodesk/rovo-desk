import { beforeEach } from "vitest";
import { getTestDb } from "./conn";

const profileTables = [
	`"profile"."userProfile"`,
	`"profile"."workspaceProfile"`,
	`"profile"."onboarding"`,
];

const authTables = [
	`"auth"."user"`,
	`"auth"."organization"`,
	`"auth"."organizationRole"`,
	`"auth"."member"`,
	`"auth"."invitation"`,
	`"auth"."team"`,
	`"auth"."teamMember"`,
	`"auth"."session"`,
	`"auth"."account"`,
	`"auth"."passkey"`,
	`"auth"."verification"`,
	`"auth"."apikey"`,
	`"auth"."jwks"`,
	`"auth"."ssoProvider"`,
];

const billingTables = [
	`"billing"."plan"`,
	`"billing"."subscription"`,
	`"billing"."usage"`,
];

const widgetTables = [`"widget"."widget"`];

const allTables = [
	...authTables,
	...profileTables,
	...billingTables,
	...widgetTables,
];

beforeEach(async () => {
	const { client } = await getTestDb();

	await client.unsafe(`
		TRUNCATE TABLE ${allTables.join(", ")}
		RESTART IDENTITY CASCADE
	`);
});
