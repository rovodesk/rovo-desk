import type { Server } from "partyserver";
import type { ChatMessage } from "./messaging/schema";

export type Bindings = {
	CHAT_ROOM: DurableObjectNamespace<Server>;
	AI: Ai;
	RATE_LIMIT_KV: KVNamespace;
};

export type Variables = {
	MAX_MESSAGE_LIMIT: number;
	RATE_LIMIT_WINDOW_MS: number;
	RATE_LIMIT_USER: number;
	RATE_LIMIT_AGENT: number;
	RATE_LIMIT_AI: number;
	AI_MODEL: string;
};

export type Env = {
	Bindings: Bindings;
	Variables: Variables;
};

export enum ROOM_STATUS {
	AI_ONLY = "AI_ONLY",
	ESCALATING = "ESCALATING",
	ESCALATED = "ESCALATED",
	DONE = "DONE",
}

export enum ACTOR_ROLE {
	USER = "user",
	AGENT = "agent",
	AI = "ai",
}

export enum MESSAGE_TYPE {
	USER = "user",
	AI = "ai",
	AGENT = "agent",
	SYSTEM = "system",
	ESCALATION = "escalation",
}

export enum FILE_TYPE {
	IMAGE = "image",
	VIDEO = "video",
	AUDIO = "audio",
	FILE = "file",
}

export interface RoomState {
	status: ROOM_STATUS;
	userId?: string;
	agentId?: string;

	messages: ChatMessage[];

	createdAt: number;
	lastActiveAt: number;
	lastAIResponseAt?: number;

	version: number;
}
