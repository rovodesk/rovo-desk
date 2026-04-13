import type { Connection } from "partyserver";
import type { IAISercice } from "@/ai/adapter";
import { resolveRole } from "@/security/auth";
import type { IStateManager } from "@/state/adapter";
import {
	ACTOR_ROLE,
	type Env,
	MESSAGE_TYPE,
	ROOM_STATUS,
	type RoomState,
} from "@/types";
import type { IMessagingService } from "./adapter";
import type { ChatMessage } from "./schema";

type MessagingDeps = {
	env: Env;
	state: IStateManager;
	roomName: string;
	ai: IAISercice; // ✅ NEW
	broadcast: (payload: any) => void;
	waitUntil: (promise: Promise<any>) => void;
};

export class MessagingService implements IMessagingService {
	private env: Env;
	private state: IStateManager;
	private roomName: string;
	private ai: IAISercice;
	private broadcastFn: (payload: any) => void;
	private waitUntil: (promise: Promise<any>) => void;

	constructor(deps: MessagingDeps) {
		this.env = deps.env;
		this.state = deps.state;
		this.roomName = deps.roomName;
		this.ai = deps.ai;
		this.broadcastFn = deps.broadcast;
		this.waitUntil = deps.waitUntil;
	}

	// ---------------------------
	// PUBLIC ENTRY
	// ---------------------------
	async handleUserMessage(connection: Connection, content: string) {
		const role = resolveRole(connection);

		// agent join
		if (role === ACTOR_ROLE.AGENT) {
			await this.state.assignAgent(connection.id);
			this.broadcastSystemMessage("Agent joined the chat");
		}

		const message: ChatMessage = {
			id: crypto.randomUUID(), // → replace with cuid2 later
			timestamp: Date.now(),
			content,
			senderId: connection.id,
			type: MESSAGE_TYPE.USER,
		};

		await this.state.appendMessage(message);

		this.broadcast({
			type: "message",
			data: message,
		});

		const state = await this.state.get();

		if (state.status === ROOM_STATUS.AI_ONLY && role === ACTOR_ROLE.USER) {
			this.handleAIResponse(state, content);
		}
	}

	// ---------------------------
	// AI RESPONSE
	// ---------------------------
	private handleAIResponse(state: RoomState, input: string) {
		if (state.lastAIResponseAt && Date.now() - state.lastAIResponseAt < 2000) {
			return;
		}

		this.broadcast({ type: "typing", actor: "ai" });

		this.waitUntil(
			(async () => {
				try {
					const res = await this.ai.generateResponse(input);

					const aiMessage: ChatMessage = {
						id: crypto.randomUUID(),
						timestamp: Date.now(),
						content: res,
						type: MESSAGE_TYPE.AI,
					};

					const latest = await this.state.get();
					if (latest.status !== ROOM_STATUS.AI_ONLY) return;

					await this.state.appendMessage(aiMessage);
					await this.state.touchAIResponse();

					this.broadcast({
						type: "message",
						data: aiMessage,
					});
				} catch (err) {
					console.error("[MessagingService] AI ERROR", err);

					this.broadcast({
						type: "error",
						message: "AI temporarily unavailable",
					});
				}
			})()
		);
	}

	// ---------------------------
	// ESCALATION
	// ---------------------------
	async escalate() {
		const state = await this.state.get();

		if (state.status !== ROOM_STATUS.AI_ONLY) return;

		await this.state.updateStatus(ROOM_STATUS.ESCALATING);

		this.broadcastSystemMessage("Escalating to human agent...");
	}

	private broadcast(payload: any) {
		this.broadcastFn(JSON.stringify(payload));
	}

	broadcastSystemMessage(text: string) {
		const msg: ChatMessage = {
			id: crypto.randomUUID(),
			timestamp: Date.now(),
			content: text,
			senderId: "system",
			type: MESSAGE_TYPE.SYSTEM,
		};

		this.broadcast({
			type: "message",
			data: msg,
		});
	}
}
