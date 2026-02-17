import { type Connection, Server } from "partyserver";
import type { Bindings } from "../../types";

export class ChatRoom extends Server<Bindings> {
	onError(_connection: Connection, error: Error): void | Promise<void> {
		console.error("PARTYKIT ERROR", error);
	}
}
