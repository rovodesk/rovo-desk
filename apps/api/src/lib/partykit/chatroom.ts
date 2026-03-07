import type { ChatMessage } from "@zero-heads-lab/shared/types";
import { type Connection, type PartyServerOptions, Server } from "partyserver";
import type { Bindings } from "../../types";

export default class ChatRoom extends Server<Bindings> {
	options: PartyServerOptions = {
		props: { hibernate: true },
	};

	// biome-ignore lint/suspicious/useAwait: No Awaited function here
	async onRequest(request: Request): Promise<Response> {
		console.log("HTTP Request received in room", request.url);

		return new Response("ChatRoom HTTP endpoint", {
			status: 200,
		});
	}

	// Persisted room state
	async onStart() {
		if (!(await this.ctx.storage.get<ChatMessage[]>("messages"))) {
			await this.ctx.storage.put("messages", []);
		}
	}

	// Initial Message when user Connects
	async onConnect(connection: Connection) {
		console.log(`User connected: ${connection.id}`);

		// Send chat history to new user
		const history =
			(await this.ctx.storage.get<ChatMessage[]>("messages")) || [];

		connection.send(
			JSON.stringify({
				type: "history",
				data: history,
			})
		);

		this.broadcastSystemMessage("User joined the room");
	}

	async onMessage(connection: Connection, data: string) {
		try {
			await this.handleUserMessage(connection, data);
		} catch (err) {
			console.error("Invalid message format", err);
		}
	}

	// When User Sends A Message
	async handleUserMessage(connection: Connection, message: string) {
		console.log(`Connection ${connection.id} sent a message`);

		const chatMessage: ChatMessage = {
			id: crypto.randomUUID(),
			userId: connection.id,
			message,
			timestamp: Date.now(),
			type: "user",
		};

		// Save message
		const messages =
			(await this.ctx.storage.get<ChatMessage[]>("messages")) || [];
		messages.push(chatMessage);
		await this.ctx.storage.put("messages", messages);

		// Broadcast user message
		this.broadcast(JSON.stringify({ type: "message", data: chatMessage }));

		// Generate bot reply
		const botReply = await this.generateBotReply(message);

		const botMessage: ChatMessage = {
			id: crypto.randomUUID(),
			userId: "bot",
			username: "ChatBot",
			message: botReply,
			timestamp: Date.now(),
			type: "bot",
		};

		messages.push(botMessage);
		await this.ctx.storage.put("messages", messages);

		this.broadcast(JSON.stringify({ type: "message", data: botMessage }));
	}

	// Generate Bot Reply
	generateBotReply(userMessage: string): string {
		// Replace this with LLM call later
		if (userMessage.toLowerCase().includes("hello")) {
			return "Hello 👋 How can I help you today?";
		}

		if (userMessage.toLowerCase().includes("price")) {
			return "Our pricing starts at $9/month.";
		}

		return `You said: "${userMessage}". I'm still learning 🤖`;
	}

	// Broadcast System Message
	broadcastSystemMessage(text: string) {
		const systemMessage: ChatMessage = {
			id: crypto.randomUUID(),
			userId: "system",
			username: "System",
			message: text,
			timestamp: Date.now(),
			type: "system",
		};

		this.broadcast(
			JSON.stringify({
				type: "message",
				data: systemMessage,
			})
		);
	}

	// On Disconnect
	onDisconnect(_connection: Connection): void {
		console.log(`User disconnected: ${_connection.id}`);
		this.broadcastSystemMessage("User left the room");
	}

	// On Any Error
	onError(_connection: Connection, error: Error): void {
		console.error("PARTYKIT ERROR", error);
	}
}
