import { type Connection, type PartyServerOptions, Server } from "partyserver";
import { StateManager } from "@/state/manager";
import { ACTOR_ROLE, type Env } from "@/types";
import type { IAISercice } from "./ai/adapter";
import { AIService } from "./ai/service";
import type { IMessagingService } from "./messaging/adapter";
import { MessagingService } from "./messaging/service";
import type { IRateLimiter } from "./security/adapter";
import { resolveRole } from "./security/auth";
import { RateLimiter } from "./security/ratelimit";

export default class ChatRoom extends Server<Env> {
	options: PartyServerOptions = {
		props: {
			hibernate: true,
		},
	};

	// ---------------------------
	// CORE DEPENDENCIES
	// ---------------------------
	private state = new StateManager({
		ctx: this.ctx,
		roomName: this.name,
		maxMessages: this.env.Variables.MAX_MESSAGE_LIMIT,
	});

	private rateLimiter: IRateLimiter = new RateLimiter(
		this.env,
		{
			windowMs: this.env.Variables.RATE_LIMIT_WINDOW_MS,
			limit: {
				[ACTOR_ROLE.USER]: this.env.Variables.RATE_LIMIT_USER,
				[ACTOR_ROLE.AGENT]: this.env.Variables.RATE_LIMIT_AGENT,
				[ACTOR_ROLE.AI]: this.env.Variables.RATE_LIMIT_AI,
			},
			prefix: `room:${this.name}`,
		},
		(conn) => {
			const url = new URL(conn.uri!);
			return url.searchParams.get("userId") ?? conn.id;
		}
	);

	private aiService: IAISercice = new AIService({
		env: this.env,
	});

	private messaging: IMessagingService = new MessagingService({
		env: this.env,
		state: this.state,
		roomName: this.name,
		ai: this.aiService,
		broadcast: (payload) => this.broadcast(payload),
		waitUntil: this.ctx.waitUntil.bind(this.ctx),
	});

	// ---------------------------
	// INIT
	// ---------------------------
	async onStart() {
		console.debug(`[ChatRoom] Started ${this.name}`);
		await this.state.init();
	}

	async onRequest(): Promise<Response> {
		return await new Response("ChatRoom OK", { status: 200 });
	}

	// ---------------------------
	// CONNECT
	// ---------------------------
	async onConnect(connection: Connection) {
		if (connection.readyState > 1) return;

		const state = await this.state.init();

		const role = resolveRole(connection);
		connection.setState({ role });

		console.log(`[ChatRoom] Connected ${connection.id} (${role})`);

		// send history
		if (state.messages?.length) {
			connection.send(
				JSON.stringify({
					type: "history",
					data: state.messages,
				})
			);
		}

		// agent join
		if (role === ACTOR_ROLE.AGENT) {
			await this.state.assignAgent(connection.id);
			this.messaging.broadcastSystemMessage("Agent joined the chat");
		}
	}

	// ---------------------------
	// MESSAGE ENTRY
	// ---------------------------
	async onMessage(connection: Connection, raw: string) {
		// rate limit
		const allowed = await this.rateLimiter.allow(connection);

		if (!allowed) {
			connection.send(
				JSON.stringify({
					type: "error",
					message: "Rate limit exceeded",
				})
			);
			return;
		}

		try {
			const msg = JSON.parse(raw);

			switch (msg.type) {
				case "message":
					if (!msg.content || msg.content.length > 2000) return;

					await this.messaging.handleUserMessage(connection, msg.content);
					break;

				case "escalate":
					await this.messaging.escalate();
					break;

				default:
					console.warn("[ChatRoom] Unknown message type", msg.type);
			}
		} catch (err) {
			console.error("[ChatRoom] Invalid message", err);
		}
	}

	// ---------------------------
	// HELPERS
	// ---------------------------

	// biome-ignore lint/suspicious/noExplicitAny: payload is a json object
	broadcast(payload: any) {
		super.broadcast(JSON.stringify(payload));
	}

	// ---------------------------
	// LIFECYCLE
	// ---------------------------
	onDisconnect(connection: Connection) {
		console.log(`[ChatRoom] Disconnected ${connection.id}`);
	}

	onError(_connection: Connection, error: Error) {
		console.error("[ChatRoom] ERROR", error);
	}
}
