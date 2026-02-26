import * as Y from "@zero-heads-lab/shared/utils/yjs";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import {
	type Connection,
	type ConnectionContext,
	Server,
	type WSMessage,
} from "partyserver";
import * as awareness from "y-protocols/awareness";
import * as sync from "y-protocols/sync";
import type { Bindings } from "../../types";

export default class Document extends Server<Bindings> {
	doc = new Y.Doc();
	awareness = new awareness.Awareness(this.doc);

	constructor(state: DurableObjectState, env: Bindings) {
		super(state, env);

		// Handle document updates
		this.doc.on("update", (update, origin) => {
			const encoder = encoding.createEncoder();
			encoding.writeVarUint(encoder, 0); // message type sync
			sync.writeUpdate(encoder, update);
			const message = encoding.toUint8Array(encoder);

			// Broadcast to all clients except the origin
			this.broadcast(
				message,
				origin instanceof Object && "id" in origin ? [origin.id as string] : []
			);
		});

		// Handle awareness updates
		this.awareness.on(
			"update",
			(
				{
					added,
					updated,
					removed,
				}: { added: number[]; updated: number[]; removed: number[] },
				origin: unknown
			) => {
				const changedClients = added.concat(updated).concat(removed);
				const encoder = encoding.createEncoder();
				encoding.writeVarUint(encoder, 1); // message type awareness
				encoding.writeVarUint8Array(
					encoder,
					awareness.encodeAwarenessUpdate(this.awareness, changedClients)
				);
				const message = encoding.toUint8Array(encoder);

				// Broadcast to all clients except the origin
				this.broadcast(
					message,
					origin instanceof Object && "id" in origin
						? [origin.id as string]
						: []
				);
			}
		);
	}

	// OnReceiving A Message
	onMessage(connection: Connection, message: WSMessage): void {
		const uint8Array = new Uint8Array(message as ArrayBuffer);
		const decoder = decoding.createDecoder(uint8Array);
		const messageType = decoding.readVarUint(decoder);

		if (messageType === 0) {
			// Sync Message Content
			const encoder = encoding.createEncoder();
			encoding.writeVarUint(encoder, 0); // message type sync
			sync.readSyncMessage(decoder, encoder, this.doc, connection);
			if (encoding.length(encoder) > 1) {
				connection.send(encoding.toUint8Array(encoder));
			}
		} else if (messageType === 1) {
			// Apply Awarness
			awareness.applyAwarenessUpdate(
				this.awareness,
				decoding.readVarUint8Array(decoder),
				connection
			);
		}
	}

	// OnConnecting A Socket Connection
	onConnect(
		connection: Connection,
		_ctx: ConnectionContext
	): void | Promise<void> {
		// 1. Send Sync Step 1
		const syncEncoder = encoding.createEncoder();
		encoding.writeVarUint(syncEncoder, 0); // message type sync
		sync.writeSyncStep1(syncEncoder, this.doc);
		connection.send(encoding.toUint8Array(syncEncoder));

		// 2. Send Awareness Update
		const awarenessUpdate = awareness.encodeAwarenessUpdate(
			this.awareness,
			Array.from(this.awareness.getStates().keys())
		);
		const awarenessEncoder = encoding.createEncoder();
		encoding.writeVarUint(awarenessEncoder, 1); // message type awareness
		encoding.writeVarUint8Array(awarenessEncoder, awarenessUpdate);
		connection.send(encoding.toUint8Array(awarenessEncoder));
	}

	// OnClosing A Socket Connection
	onClose(
		connection: Connection,
		code: number,
		reason: string,
		wasClean: boolean
	): void | Promise<void> {
		console.log("DISCONNECTED", code, reason, wasClean);
		// Clean up awareness for this connection
		const clientIds: number[] = [];

		this.awareness.getStates().forEach((_, clientId) => {
			const state = this.awareness.getStates().get(clientId);
			if (state?.connection === connection) {
				clientIds.push(clientId);
			}
		});
		awareness.removeAwarenessStates(this.awareness, clientIds, connection);
	}

	onError(_connection: Connection, error: Error): void | Promise<void> {
		console.error("PARTYKIT ERROR", error);
	}
}
