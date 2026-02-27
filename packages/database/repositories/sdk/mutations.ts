import { randomUUID } from "crypto";
import type { InferInsertModel } from "drizzle-orm";
import { and, eq } from "drizzle-orm";
import { createDatabase, type Database } from "../../conn";
import { organization } from "../../drizzle/schemas/auth.schema";
import {
	sdk,
	sdkConnectionKeys,
	sdkConnectionSecrets,
	sdkConnections,
	sdkSettings,
} from "../../drizzle/schemas/sdk.schema";

type CreateSDKInput = {
	organizationId: string;
	name: string;
	description?: string;
};

export type UpdateBotSettingsInput = Partial<
	Omit<InferInsertModel<typeof sdkSettings>, "sdkId" | "updatedAt">
>;

export async function createSDKWithDefaultsTransaction(
	input: CreateSDKInput
): Promise<void> {
	const db = createDatabase();

	return await db.transaction(async (tx) => {
		// Ensure organization exists (safety guard)
		const org = await tx.query.organization.findFirst({
			where: eq(organization.id, input.organizationId),
		});

		if (!org) {
			throw new Error("Organization not found");
		}

		// Create sdk
		const sdkId = randomUUID();

		await tx.insert(sdk).values({
			id: sdkId,
			organizationId: input.organizationId,
			name: input.name,
			description: input.description ?? null,
		});

		// Create default settings (1:1)
		await tx.insert(sdkSettings).values({
			sdkId,
			instruction: "You are a helpful AI assistant.",
			welcomeMessage: "Hi 👋 How can I help you today?",
			inputPlaceholder: "Type your message...",
			primaryColor: "#000000",
			secondaryColor: "#ffffff",
			model: "gpt-4o-mini",
			temperature: 0.7,
		});

		// Return fully hydrated sdk
		// const created = await tx
		// 	.select()
		// 	.from(sdk)
		// 	.where(eq(sdk.id, sdkId))
		// 	.limit(1);

		return;
	});
}

export async function updateSDKSettingsTransaction(
	database: Database,
	params: {
		organizationId: string;
		sdkId: string;
		name?: string;
		data: UpdateBotSettingsInput;
	}
) {
	const { organizationId, sdkId, data, name } = params;

	return await database.transaction(async (tx) => {
		const existingSDK = await tx.query.sdk.findFirst({
			where: and(eq(sdk.id, sdkId), eq(sdk.organizationId, organizationId)),
			columns: { id: true },
		});

		if (!existingSDK) {
			throw new Error("SDK not found or access denied");
		}

		if (name) {
			await tx
				.update(sdk)
				.set({ name, updatedAt: new Date() })
				.where(eq(sdk.id, sdkId));
		}

		await tx
			.insert(sdkSettings)
			.values({
				sdkId,
				...data,
			})
			.onConflictDoUpdate({
				target: sdkSettings.sdkId,
				set: {
					...data,
					updatedAt: new Date(),
				},
			})
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to update sdk settings");
			});
	});
}

export async function updateSDKConnectionTransaction(
	database: Database,
	params: {
		connectionId: string;
		connectionName?: string;
		connectionSource?: string;
		connectionActive?: boolean;
	}
) {
	const { connectionId, connectionName, connectionSource, connectionActive } =
		params;

	return await database.transaction(async (tx) => {
		const existingConnection = await tx.query.sdkConnections.findFirst({
			where: eq(sdkConnections.id, connectionId),
			columns: { id: true },
		});

		if (!existingConnection) {
			throw new Error("SDK connection not found or access denied");
		}

		await tx
			.update(sdkConnections)
			.set({
				connectionName,
				connectionSource,
				isActive: connectionActive,
				updatedAt: new Date(),
			})
			.where(eq(sdkConnections.id, connectionId))
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to update sdk connection");
			});
	});
}

export async function createWidgetConnectionTransaction(
	database: Database,
	params: {
		sdkId: string;
		connectionName: string;
		connectionSource: string;
		connectionIcon: string;
		connectionType: "CLIENT" | "SERVER";
		publicKey: string;
		privateKey: string;
	}
) {
	return await database.transaction(async (tx) => {
		// 1️⃣ Create connection
		const [connection] = await tx
			.insert(sdkConnections)
			.values({
				sdkId: params.sdkId,
				connectionName: params.connectionName,
				connectionIcon: params.connectionIcon,
				connectionSource: params.connectionSource,
				connectionType: params.connectionType,
				authMode: "asymmetric",
			})
			.returning({ id: sdkConnections.id });

		if (!connection) {
			throw new Error("Failed to create sdk connection");
		}

		// 2️⃣ Create initial active key
		await tx.insert(sdkConnectionKeys).values({
			connectionId: connection.id,
			publicKey: params.publicKey,
			privateKey: params.privateKey,
			status: "active",
		});

		return connection;
	});
}

export async function rotateWidgetConnectionKeysTransaction(
	database: Database,
	params: {
		connectionId: string;
		publicKey: string;
		privateKey: string;
	}
) {
	return await database.transaction(async (tx) => {
		// 1️⃣ Expire current active key
		await tx
			.update(sdkConnectionKeys)
			.set({
				status: "expired",
				expiryDate: new Date(),
			})
			.where(
				and(
					eq(sdkConnectionKeys.connectionId, params.connectionId),
					eq(sdkConnectionKeys.status, "active")
				)
			);

		// 2️⃣ Insert new active key
		await tx
			.insert(sdkConnectionKeys)
			.values({
				connectionId: params.connectionId,
				publicKey: params.publicKey,
				privateKey: params.privateKey,
				status: "active",
			})
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to rotate SDK connection keys");
			});

		return;
	});
}

export async function createWebhookConnectionTransaction(
	database: Database,
	params: {
		sdkId: string;
		connectionName: string;
		connectionSource: string;
		connectionIcon: string;
		connectionType: "CLIENT" | "SERVER";
		secret: string;
	}
) {
	return await database.transaction(async (tx) => {
		// 1️⃣ Create connection
		const [connection] = await tx
			.insert(sdkConnections)
			.values({
				sdkId: params.sdkId,
				connectionName: params.connectionName,
				connectionIcon: params.connectionIcon,
				connectionSource: params.connectionSource,
				connectionType: params.connectionType,
				authMode: "hmac",
			})
			.returning({ id: sdkConnections.id });

		if (!connection) {
			throw new Error("Failed to create sdk connection");
		}

		// Create initial active key
		await tx.insert(sdkConnectionSecrets).values({
			connectionId: connection.id,
			secret: params.secret,
			status: "active",
		});

		return connection;
	});
}

export async function rotateWebhookConnectionTransaction(
	database: Database,
	params: {
		connectionId: string;
		secretKey: string;
	}
) {
	return await database.transaction(async (tx) => {
		// 1️⃣ Expire current active key
		await tx
			.update(sdkConnectionSecrets)
			.set({
				status: "expired",
			})
			.where(
				and(
					eq(sdkConnectionSecrets.connectionId, params.connectionId),
					eq(sdkConnectionSecrets.status, "active")
				)
			);

		// 2️⃣ Insert new active key
		await tx
			.insert(sdkConnectionSecrets)
			.values({
				connectionId: params.connectionId,
				secret: params.secretKey,
				status: "active",
			})
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to rotate SDK connection keys");
			});

		return;
	});
}

export async function deleteSDKConnection(
	database: Database,
	params: { connectionId: string }
) {
	return await database
		.delete(sdkConnections)
		.where(eq(sdkConnections.id, params.connectionId))
		.catch((error) => {
			console.error(error);
			throw new Error("Failed to delete sdk connection");
		});
}

export async function deleteSDK(database: Database, params: { sdkId: string }) {
	return await database.transaction(async (tx) => {
		const existingSDK = await tx.query.sdk.findFirst({
			where: and(eq(sdk.id, params.sdkId)),
			columns: { id: true },
		});

		if (!existingSDK) {
			throw new Error("SDK not found or access denied");
		}

		await tx
			.update(sdk)
			.set({
				deletedAt: new Date(),
			})
			.where(eq(sdk.id, params.sdkId))
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to delete sdk");
			});
	});
}

export async function toggleConnectionTransaction(
	database: Database,
	params: {
		connectionId: string;
	}
) {
	return await database.transaction(async (tx) => {
		const existingConnection = await tx.query.sdkConnections.findFirst({
			where: eq(sdkConnections.id, params.connectionId),
			columns: { id: true, isActive: true },
		});

		if (!existingConnection) {
			throw new Error("SDK connection not found or access denied");
		}

		await tx
			.update(sdkConnections)
			.set({
				isActive: !existingConnection.isActive,
			})
			.where(eq(sdkConnections.id, params.connectionId))
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to deactivate sdk connection");
			});
	});
}
