export type MessageType = "bot" | "user" | "external" | "system";

export interface ChatMessage {
	id: string;
	userId?: string;
	username?: string;
	message: string;
	timestamp: number;
	type: MessageType;
	loading?: boolean;
	widget?: string;
}
