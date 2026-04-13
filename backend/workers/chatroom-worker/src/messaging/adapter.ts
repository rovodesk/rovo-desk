import type { Connection } from "partyserver";

export interface IMessagingService {
	handleUserMessage(connection: Connection, content: string): Promise<void>;
	escalate(): Promise<void>;
	broadcastSystemMessage(text: string): void;
}
