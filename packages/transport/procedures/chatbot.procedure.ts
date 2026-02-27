import { ORPCError } from "@orpc/client";
import { AsymmetricCrypto } from "@zero-heads-lab/crypto";
import {
	createWidgetConnectionTransaction,
	deleteSDKConnection,
	rotateWidgetConnectionKeysTransaction,
	toggleConnectionTransaction,
	updateSDKConnectionTransaction,
	updateSDKSettingsTransaction,
} from "@zero-heads-lab/database/repositories/sdk/mutations";
import {
	getSDKConnectionById,
	getSDKWithSettingsByOrganizationId,
	listSDKConnections,
} from "@zero-heads-lab/database/repositories/sdk/queries";
import { base } from "../context";
import {
	CHATBOT_CONNECTION_DTO,
	CHATBOT_CONNECTIONS_DTO,
	CHATBOT_WITH_SETTINGS_DTO,
	CREATE_CHATBOT_CONNECTION_INPUT_DTO,
	CREATE_CHATBOT_CONNECTION_OUTPUT_DTO,
	DELETE_CHATBOT_CONNECTION_INPUT_DTO,
	FIND_CHATBOT_CONNECTION_INPUT_DTO,
	ROTATE_CHATBOT_CONNECTION_KEYS_INPUT_DTO,
	ROTATE_CHATBOT_CONNECTION_KEYS_OUTPUT_DTO,
	TOGGLE_CHATBOT_CONNECTION_INPUT_DTO,
	UPDATE_CHATBOT_CONNECTION_INPUT_DTO,
	UPDATE_CHATBOT_SETTINGS_INPUT_DTO,
} from "../dto/chatbot.dto";
import { AuthGuard } from "../middlewares/auth.middleware";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { ChatbotGuard } from "../middlewares/chatbot.middleware";
import { OrganizationGuard } from "../middlewares/organization.middleware";

// biome-ignore lint/suspicious/noExplicitAny: connection is any
function mapConnectionToDTO(connection: any) {
	return {
		id: connection.id,
		connectionName: connection.connectionName,
		connectionIcon: connection.connectionIcon,
		connectionSource: connection.connectionSource,
		connectionType: connection.connectionType,
		isActive: connection.isActive,
		createdAt: connection.createdAt,
		updatedAt: connection.updatedAt,
		keys: connection.keys
			? {
					publicKey: connection.keys.publicKey ?? null,
					privateKey: connection.keys.privateKey ?? null,
					status: connection.keys.status,
					expiryDate: connection.keys.expiryDate ?? undefined,
				}
			: undefined,
	};
}

// biome-ignore lint/suspicious/noExplicitAny: Can be any
function mapChatbotWithSettingsToDTO(chatbot: any) {
	return {
		id: chatbot.id,
		organizationId: chatbot.organizationId,
		name: chatbot.name,
		isActive: chatbot.isActive,
		createdAt: chatbot.createdAt,
		updatedAt: chatbot.updatedAt,
		description: chatbot.description,
		deletedAt: chatbot.deletedAt,
		settings: chatbot.settings
			? {
					chatbotId: chatbot.settings.sdkId, // ✅ map correctly
					model: chatbot.settings.model,
					instruction: chatbot.settings.instruction,
					welcomeMessage: chatbot.settings.welcomeMessage,
					inputPlaceholder: chatbot.settings.inputPlaceholder,
					primaryColor: chatbot.settings.primaryColor,
					secondaryColor: chatbot.settings.secondaryColor,
					temperature: chatbot.settings.temperature,
					metadata: chatbot.settings.metadata,
				}
			: null,
	};
}
export const findChatbotWithSettings = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.output(CHATBOT_WITH_SETTINGS_DTO)
	.handler(async ({ context }) => {
		const organizationId = context.organizationId;
		const database = context.database;

		const chatbot = await getSDKWithSettingsByOrganizationId(database, {
			organizationId,
		});
		if (!chatbot) {
			throw new ORPCError("NOT_FOUND", {
				message: "Chatbot not found",
			});
		}
		return mapChatbotWithSettingsToDTO(chatbot);
	})
	.callable();

export const updateChatbotSettings = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.use(ChatbotGuard)
	.input(UPDATE_CHATBOT_SETTINGS_INPUT_DTO)
	.handler(async ({ context, input }) => {
		const organizationId = context.organizationId;
		const database = context.database;

		try {
			await updateSDKSettingsTransaction(database, {
				organizationId,
				sdkId: input.id,
				name: input.name,
				data: {
					instruction: input.instruction,
					welcomeMessage: input.welcomeMessage,
					inputPlaceholder: input.inputPlaceholder,
					primaryColor: input.primaryColor,
					secondaryColor: input.secondaryColor,
					model: input.model ?? undefined,
					temperature: input.temperature,
				},
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_ERROR", {
				message: "Failed to update chatbot settings",
			});
		}
	})
	.callable();

export const createChatbotConnection = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.use(ChatbotGuard)
	.input(CREATE_CHATBOT_CONNECTION_INPUT_DTO)
	.output(CREATE_CHATBOT_CONNECTION_OUTPUT_DTO)
	.handler(async ({ context, input }) => {
		const chatbotId = context.chatbotId;
		const database = context.database;

		// Generate Keys
		const asm = new AsymmetricCrypto();
		const keys = asm.generateKeyPair();

		try {
			await createWidgetConnectionTransaction(database, {
				sdkId: chatbotId,
				connectionName: input.connectionName,
				connectionSource: input.connectionSource,
				connectionIcon: input.connectionIcon,
				connectionType: input.connectionType,
				publicKey: keys.publicKey,
				privateKey: keys.privateKey,
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_ERROR", {
				message: "Failed to create chatbot connection",
			});
		}

		if (input.connectionType === "SERVER") {
			return {
				key: keys.privateKey,
			};
		}

		return {
			key: keys.publicKey,
		};
	})
	.callable();

export const listConnections = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.use(ChatbotGuard)
	.output(CHATBOT_CONNECTIONS_DTO)
	.handler(async ({ context }) => {
		const chatbotId = context.chatbotId;
		const database = context.database;

		const connections = await listSDKConnections(database, {
			sdkId: chatbotId,
		});
		if (!connections || connections.length === 0) {
			throw new ORPCError("NOT_FOUND", {
				message: "Chatbot connections not found",
			});
		}

		return connections.map(mapConnectionToDTO);
	})
	.callable();

export const findChatbotConnection = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.use(ChatbotGuard)
	.input(FIND_CHATBOT_CONNECTION_INPUT_DTO)
	.output(CHATBOT_CONNECTION_DTO)
	.handler(async ({ input, context }) => {
		const connectionId = input.connectionId;
		const database = context.database;

		const connection = await getSDKConnectionById(database, {
			connectionId,
		});
		if (!connection) {
			throw new ORPCError("NOT_FOUND", {
				message: "Chatbot connection not found",
			});
		}

		return mapConnectionToDTO(connection);
	})
	.callable();

export const deleteChatbotConnection = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.use(ChatbotGuard)
	.input(DELETE_CHATBOT_CONNECTION_INPUT_DTO)
	.handler(async ({ input, context }) => {
		const connectionId = input.connectionId;
		const database = context.database;

		try {
			await deleteSDKConnection(database, { connectionId });
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_ERROR", {
				message: "Failed to delete chatbot connection",
			});
		}
	})
	.callable();

export const rotateChatbotConnectionKeys = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.use(ChatbotGuard)
	.input(ROTATE_CHATBOT_CONNECTION_KEYS_INPUT_DTO)
	.output(ROTATE_CHATBOT_CONNECTION_KEYS_OUTPUT_DTO)
	.handler(async ({ input, context }) => {
		const database = context.database;

		// Generate Secret Key
		const asm = new AsymmetricCrypto();
		const keys = asm.generateKeyPair();

		try {
			await rotateWidgetConnectionKeysTransaction(database, {
				connectionId: input.connectionId,
				publicKey: keys.publicKey,
				privateKey: keys.privateKey,
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_ERROR", {
				message: "Failed to rotate chatbot connection",
			});
		}

		if (input.connectionType === "SERVER") {
			return {
				privateKey: keys.privateKey,
				publicKey: null,
			};
		}

		return {
			publicKey: keys.publicKey,
			privateKey: null,
		};
	})
	.callable();

export const toggleChatbotConnection = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.use(ChatbotGuard)
	.input(TOGGLE_CHATBOT_CONNECTION_INPUT_DTO)
	.handler(async ({ input, context }) => {
		const database = context.database;
		const connectionId = input.connectionId;

		try {
			await toggleConnectionTransaction(database, { connectionId });
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_ERROR", {
				message: "Failed to toggle chatbot connection",
			});
		}
	})
	.callable();

export const updateChatbotConnection = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.use(ChatbotGuard)
	.input(UPDATE_CHATBOT_CONNECTION_INPUT_DTO)
	.handler(async ({ input, context }) => {
		const database = context.database;
		try {
			await updateSDKConnectionTransaction(database, {
				connectionId: input.connectionId,
				connectionName: input.connectionName,
				connectionSource: input.connectionSource,
				connectionActive: input.connectionActive,
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_ERROR", {
				message: "Failed to update chatbot connection",
			});
		}
	})
	.callable();
