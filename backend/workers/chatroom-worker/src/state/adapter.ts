import type { ROOM_STATUS, RoomState } from "@/types";

export interface IStateManager {
	init(): Promise<RoomState>;
	get(): Promise<RoomState>;
	appendMessage(message: any): Promise<void>;
	updateStatus(status: ROOM_STATUS): Promise<void>;
	assignAgent(agentId: string): Promise<void>;
	touchAIResponse(): Promise<void>;
}
