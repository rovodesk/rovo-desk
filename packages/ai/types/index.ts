type Role = "user" | "assistant";

export type ChatMessage = {
	role: Role;
	content: string;
};

export type IncomingMessage = {
	source: Role;
	message?: string;
};

export type SessionStatus =
	| "connecting"
	| "connected"
	| "disconnected"
	| "disconnecting";
