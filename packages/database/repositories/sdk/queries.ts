import { and, desc, eq, type InferSelectModel } from "drizzle-orm";
import type { Database } from "../../conn";
import {
	sdk,
	sdkConnectionKeys,
	sdkConnections,
	type sdkSettings,
} from "../../drizzle/schemas/sdk.schema";

export type SDK = InferSelectModel<typeof sdk>;

export type Settings = InferSelectModel<typeof sdkSettings>;

export type SDKWithSettings = SDK & {
	settings: Settings | null;
};

export async function getSDKByOrganizationId(
	database: Database,
	params: {
		organizationId: string;
	}
): Promise<SDK> {
	const res = await database.query.sdk.findFirst({
		where: eq(sdk.organizationId, params.organizationId),
	});
	if (!res) {
		throw new Error("SDK not found");
	}
	return res;
}

export async function getSDKWithSettingsByOrganizationId(
	database: Database,
	params: {
		organizationId: string;
	}
): Promise<SDKWithSettings> {
	const res = await database.query.sdk.findFirst({
		where: eq(sdk.organizationId, params.organizationId),
		with: {
			settings: true,
		},
	});

	if (!res) {
		throw new Error("SDK not found");
	}

	return res;
}

export async function getSDKConnectionById(
	database: Database,
	params: {
		connectionId: string;
	}
) {
	return await database.query.sdkConnections.findFirst({
		where: eq(sdkConnections.id, params.connectionId),
		with: {
			keys: true,
		},
	});
}

export async function listSDKConnections(
	database: Database,
	params: {
		sdkId: string;
	}
) {
	return await database
		.select()
		.from(sdkConnections)
		.where(eq(sdkConnections.sdkId, params.sdkId))
		.orderBy(desc(sdkConnections.createdAt));
}

export async function getActivePublicKeyByConnectionId(
	db: Database,
	params: { connectionId: string }
) {
	return await db.query.sdkConnectionKeys.findFirst({
		where: and(
			eq(sdkConnectionKeys.connectionId, params.connectionId),
			eq(sdkConnectionKeys.status, "active")
		),
		columns: {
			publicKey: true,
		},
	});
}
