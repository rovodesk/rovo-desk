import { ORPCError } from "@orpc/client";
import { AsymmetricCrypto } from "@zero-heads-lab/crypto";
import {
	createChatbotConnectionTransaction,
	rotateChatbotConnectionKeysTransaction,
	softDeleteChatbotConnection,
	toggleConnectionTransaction,
	updateChatbotConnectionTransaction,
	updateChatbotSettingsTransaction,
} from "@zero-heads-lab/database/repositories/chatbot/mutations";
import {
	getChatbotConnectionById,
	getChatbotWithSettingsByOrganizationId,
	listChatbotConnections,
} from "@zero-heads-lab/database/repositories/chatbot/queries";
import { base } from "../context";
import {
	CHATBOT_CONNECTION_DTO,
	CHATBOT_CONNECTIONS_DTO,
	CHATBOT_WITH_SETTINGS_DTO,
	CREATE_CHATBOT_CONNECTION_INPUT_DTO,
	DELETE_CHATBOT_CONNECTION_INPUT_DTO,
	FIND_CHATBOT_CONNECTION_INPUT_DTO,
	ROTATE_CHATBOT_CONNECTION_KEYS_INPUT_DTO,
	TOGGLE_CHATBOT_CONNECTION_INPUT_DTO,
	UPDATE_CHATBOT_CONNECTION_INPUT_DTO,
	UPDATE_CHATBOT_SETTINGS_INPUT_DTO,
} from "../dto/chatbot.dto";
import { AuthGuard } from "../middlewares/auth.middleware";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { ChatbotGuard } from "../middlewares/chatbot.middleware";
import { OrganizationGuard } from "../middlewares/organization.middleware";

export const findChatbotWithSettings = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.output(CHATBOT_WITH_SETTINGS_DTO)
	.handler(async ({ context }) => {
		const organizationId = context.organizationId;

		const chatbot =
			await getChatbotWithSettingsByOrganizationId(organizationId);
		if (!chatbot) {
			throw new ORPCError("NOT_FOUND", {
				message: "Chatbot not found",
			});
		}
		return chatbot;
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

		try {
			await updateChatbotSettingsTransaction({
				organizationId,
				chatbotId: input.id,
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
	.handler(async ({ context, input }) => {
		const chatbotId = context.chatbotId;

		const crypto = new AsymmetricCrypto();
		const { publicKey, privateKey } = crypto.generateKeyPair();

		try {
			await createChatbotConnectionTransaction(
				chatbotId,
				input.connectionName,
				input.connectionType,
				input.connectionSource,
				input.connectionIcon,
				privateKey,
				publicKey
			);
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_ERROR", {
				message: "Failed to create chatbot connection",
			});
		}

		if (input.connectionType === "CLIENT") {
			return {
				privateKey: null,
				publicKey,
			};
		}
		return {
			privateKey,
			publicKey: null,
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

		const connections = await listChatbotConnections(chatbotId);
		if (!connections) {
			throw new ORPCError("NOT_FOUND", {
				message: "Chatbot connections not found",
			});
		}

		if (
			connections.find((connection) => connection.connectionType === "CLIENT")
		) {
			return connections.map((connection) => {
				return {
					...connection,
					privateKey: null,
				};
			});
		}

		if (
			connections.find((connection) => connection.connectionType === "SERVER")
		) {
			return connections.map((connection) => {
				return {
					...connection,
					publicKey: null,
				};
			});
		}

		if (
			connections.find((connection) => connection.connectionType === "PLUGIN")
		) {
			return connections.map((connection) => {
				return {
					...connection,
					publicKey: null,
				};
			});
		}
		return connections;
	})
	.callable();

export const findChatbotConnection = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.use(ChatbotGuard)
	.input(FIND_CHATBOT_CONNECTION_INPUT_DTO)
	.output(CHATBOT_CONNECTION_DTO)
	.handler(async ({ input }) => {
		const connectionId = input.connectionId;

		const connection = await getChatbotConnectionById(connectionId);
		if (!connection) {
			throw new ORPCError("NOT_FOUND", {
				message: "Chatbot connection not found",
			});
		}

		if (connection.connectionType === "CLIENT") {
			return {
				...connection,
				privateKey: null,
			};
		}

		if (connection.connectionType === "SERVER") {
			return {
				...connection,
				publicKey: null,
			};
		}

		if (connection.connectionType === "PLUGIN") {
			return {
				...connection,
				publicKey: null,
			};
		}
		return connection;
	})
	.callable();

export const deleteChatbotConnection = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.use(ChatbotGuard)
	.input(DELETE_CHATBOT_CONNECTION_INPUT_DTO)
	.handler(async ({ input }) => {
		const connectionId = input.connectionId;

		try {
			await softDeleteChatbotConnection(connectionId);
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
	.handler(async ({ input }) => {
		const connectionId = input.connectionId;

		const crypto = new AsymmetricCrypto();
		const { publicKey, privateKey } = crypto.generateKeyPair();

		try {
			await rotateChatbotConnectionKeysTransaction(connectionId, {
				privateKey,
				publicKey,
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_ERROR", {
				message: "Failed to rotate chatbot connection",
			});
		}
	})
	.callable();

export const toggleChatbotConnection = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.use(ChatbotGuard)
	.input(TOGGLE_CHATBOT_CONNECTION_INPUT_DTO)
	.handler(async ({ input }) => {
		const connectionId = input.connectionId;

		try {
			await toggleConnectionTransaction({ connectionId });
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
	.handler(async ({ input }) => {
		try {
			await updateChatbotConnectionTransaction({
				connectionId: input.connectionId,
				connectionName: input.connectionName,
				connectionSource: input.connectionSource,
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_ERROR", {
				message: "Failed to update chatbot connection",
			});
		}
	})
	.callable();
