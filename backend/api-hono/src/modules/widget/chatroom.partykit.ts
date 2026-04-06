import type { Message } from "@zero-heads-lab/shared/types";
import { type Connection, type PartyServerOptions, Server } from "partyserver";
import type { PartyBindings } from "../../types";

export default class ChatRoom extends Server<PartyBindings> {
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
		if (!(await this.ctx.storage.get<Message[]>("messages"))) {
			await this.ctx.storage.put("messages", []);
		}
	}

	// Initial Message when user Connects
	async onConnect(connection: Connection) {
		console.log(`User connected: ${connection.id}`);

		// Send chat history to new user
		const history = (await this.ctx.storage.get<Message[]>("messages")) || [];

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
			const parsed = JSON.parse(data);
			if (parsed.type === "message") {
				await this.handleUserMessage(connection, parsed.data.text);
			}
		} catch (err) {
			console.error("Invalid message format", err);
		}
	}

	// When User Sends A Message
	async handleUserMessage(connection: Connection, text: string) {
		const userId = connection.id; // Or extract from headers if possible
		console.log(`User ${userId} sent a message`);

		const chatMessage: Message = {
			id: crypto.randomUUID(),
			type: "text",
			senderId: userId,
			text,
			createdAt: new Date().toISOString(),
		};

		// Save message
		const messages = (await this.ctx.storage.get<Message[]>("messages")) || [];
		messages.push(chatMessage);
		await this.ctx.storage.put("messages", messages);

		// Broadcast user message
		this.broadcast(JSON.stringify({ type: "message", data: chatMessage }));

		// Generate bot reply
		const botReply = await this.generateBotReply(text);

		const botMessage: Message = {
			id: crypto.randomUUID(),
			type: "text",
			senderId: "bot",
			text: botReply,
			createdAt: new Date().toISOString(),
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
		const systemMessage: Message = {
			id: crypto.randomUUID(),
			type: "system",
			senderId: "system",
			text,
			createdAt: new Date().toISOString(),
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
