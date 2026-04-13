import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import {
	type Connection,
	type ConnectionContext,
	Server,
	type WSMessage,
} from "partyserver";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as Y from "yjs";
import type { PartyBindings } from "../../types";

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;
const STORAGE_KEY = "yjs-update";
const SAVE_DEBOUNCE_MS = 1000;

type CommentReply = {
	id: string;
	userId: string;
	userName: string;
	body: string;
	createdAt: string;
};

type CommentThread = {
	id: string;
	anchor: {
		type: "text-range" | "block";
		from?: number;
		to?: number;
		blockId?: string;
	};
	userId: string;
	userName: string;
	body: string;
	createdAt: string;
	resolved: boolean;
	replies: CommentReply[];
};

export default class RealtimeDocument extends Server<PartyBindings> {
	doc = new Y.Doc();
	awareness = new awarenessProtocol.Awareness(this.doc);

	private state: DurableObjectState;

	private saveTimeout: ReturnType<typeof setTimeout> | null = null;
	private loaded = false;

	// Shared Yjs structures
	content = this.doc.getXmlFragment("content");
	meta = this.doc.getMap("meta");
	comments = this.doc.getMap<CommentThread>("comments");
	commentOrder = this.doc.getArray<string>("comment-order");

	constructor(state: DurableObjectState, env: PartyBindings) {
		super(state, env);
		this.state = state;

		// Block requests until initial state is loaded
		this.state.blockConcurrencyWhile(async () => {
			await this.loadFromStorage();
			this.loaded = true;
		});

		// Broadcast doc updates to all peers except origin
		this.doc.on("update", (update: Uint8Array, origin: unknown) => {
			this.schedulePersist();

			const encoder = encoding.createEncoder();
			encoding.writeVarUint(encoder, MESSAGE_SYNC);
			syncProtocol.writeUpdate(encoder, update);

			const message = encoding.toUint8Array(encoder);
			const exclude =
				origin && typeof origin === "object" && "id" in origin
					? [String((origin as { id: string }).id)]
					: [];

			this.broadcast(message, exclude);
		});

		// Broadcast awareness changes to all peers except origin
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
				const changedClients = added.concat(updated, removed);

				const encoder = encoding.createEncoder();
				encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
				encoding.writeVarUint8Array(
					encoder,
					awarenessProtocol.encodeAwarenessUpdate(
						this.awareness,
						changedClients
					)
				);

				const message = encoding.toUint8Array(encoder);
				const exclude =
					origin && typeof origin === "object" && "id" in origin
						? [String((origin as { id: string }).id)]
						: [];

				this.broadcast(message, exclude);
			}
		);
	}

	/**
	 * Loads the Yjs document state from Durable Object storage.
	 */
	private async loadFromStorage() {
		const persisted = await this.state.storage.get<ArrayBuffer>(STORAGE_KEY);
		if (!persisted) return;

		const update = new Uint8Array(persisted);
		Y.applyUpdate(this.doc, update, "storage");
	}

	/**
	 * Persists the full merged Yjs state to Durable Object storage.
	 * For many docs this is good enough. If docs get large, move to incremental updates.
	 */
	private async persistNow() {
		const update = Y.encodeStateAsUpdate(this.doc);
		await this.state.storage.put(STORAGE_KEY, update);
	}

	/**
	 * Debounced persistence to reduce write amplification.
	 */
	private schedulePersist() {
		if (this.saveTimeout) clearTimeout(this.saveTimeout);

		this.saveTimeout = setTimeout(() => {
			this.ctx.waitUntil(this.persistNow());
		}, SAVE_DEBOUNCE_MS);
	}

	/**
	 * Optional helper methods for comment operations
	 * These can also be driven entirely from client-side Yjs transactions.
	 */
	private addComment(thread: CommentThread) {
		this.doc.transact(() => {
			this.comments.set(thread.id, thread);
			this.commentOrder.push([thread.id]);
		}, "server:add-comment");
	}

	private resolveComment(threadId: string, resolved: boolean) {
		this.doc.transact(() => {
			const existing = this.comments.get(threadId);
			if (!existing) return;

			this.comments.set(threadId, {
				...existing,
				resolved,
			});
		}, "server:resolve-comment");
	}

	private addReply(threadId: string, reply: CommentReply) {
		this.doc.transact(() => {
			const existing = this.comments.get(threadId);
			if (!existing) return;

			this.comments.set(threadId, {
				...existing,
				replies: [...existing.replies, reply],
			});
		}, "server:add-reply");
	}

	/**
	 * Handle incoming websocket messages
	 */
	onMessage(connection: Connection, message: WSMessage): void {
		if (!this.loaded) return;

		const uint8Array =
			message instanceof ArrayBuffer
				? new Uint8Array(message)
				: new Uint8Array(message as unknown as ArrayBuffer);

		const decoder = decoding.createDecoder(uint8Array);
		const messageType = decoding.readVarUint(decoder);

		switch (messageType) {
			case MESSAGE_SYNC: {
				const encoder = encoding.createEncoder();
				encoding.writeVarUint(encoder, MESSAGE_SYNC);

				syncProtocol.readSyncMessage(decoder, encoder, this.doc, connection);

				if (encoding.length(encoder) > 1) {
					connection.send(encoding.toUint8Array(encoder));
				}
				break;
			}

			case MESSAGE_AWARENESS: {
				const update = decoding.readVarUint8Array(decoder);
				awarenessProtocol.applyAwarenessUpdate(
					this.awareness,
					update,
					connection
				);
				break;
			}

			default: {
				console.warn("Unknown message type:", messageType);
				break;
			}
		}
	}

	/**
	 * When a client connects:
	 * 1. Send Yjs sync step 1
	 * 2. Send current awareness state
	 */
	onConnect(
		connection: Connection,
		_ctx: ConnectionContext
	): void | Promise<void> {
		if (!this.loaded) return;

		// Sync step 1
		const syncEncoder = encoding.createEncoder();
		encoding.writeVarUint(syncEncoder, MESSAGE_SYNC);
		syncProtocol.writeSyncStep1(syncEncoder, this.doc);
		connection.send(encoding.toUint8Array(syncEncoder));

		// Awareness state
		const awarenessStates = Array.from(this.awareness.getStates().keys());
		if (awarenessStates.length > 0) {
			const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(
				this.awareness,
				awarenessStates
			);

			const awarenessEncoder = encoding.createEncoder();
			encoding.writeVarUint(awarenessEncoder, MESSAGE_AWARENESS);
			encoding.writeVarUint8Array(awarenessEncoder, awarenessUpdate);

			connection.send(encoding.toUint8Array(awarenessEncoder));
		}
	}

	/**
	 * Remove awareness states belonging to the disconnected connection.
	 */
	onClose(
		connection: Connection,
		code: number,
		reason: string,
		wasClean: boolean
	): void | Promise<void> {
		console.log("DISCONNECTED", {
			connectionId: connection.id,
			code,
			reason,
			wasClean,
		});

		const states = this.awareness.getStates();
		const clientIdsToRemove: number[] = [];

		states.forEach((state, clientId) => {
			/**
			 * IMPORTANT:
			 * awareness payload is usually user-defined client state.
			 * If you want reliable cleanup, you should attach connection info
			 * to awareness on the client OR keep your own connection->client map.
			 */
			if (
				state &&
				typeof state === "object" &&
				"__connectionId" in state &&
				state.__connectionId === connection.id
			) {
				clientIdsToRemove.push(clientId);
			}
		});

		if (clientIdsToRemove.length > 0) {
			awarenessProtocol.removeAwarenessStates(
				this.awareness,
				clientIdsToRemove,
				connection
			);
		}

		this.ctx.waitUntil(this.persistNow());
	}

	onError(_connection: Connection, error: Error): void | Promise<void> {
		console.error("PARTYKIT ERROR", error);
	}

	/**
	 * Optional HTTP API
	 * Useful for snapshots / exporting / server-side metadata access
	 */
	async onRequest(req: Request): Promise<Response> {
		const url = new URL(req.url);

		if (req.method === "GET" && url.pathname.endsWith("/snapshot")) {
			const update = Y.encodeStateAsUpdate(this.doc);
			return new Response(update, {
				headers: {
					"content-type": "application/octet-stream",
				},
			});
		}

		if (req.method === "GET" && url.pathname.endsWith("/comments")) {
			const orderedIds = this.commentOrder.toArray();
			const threads = orderedIds
				.map((id) => this.comments.get(id))
				.filter(Boolean);

			return Response.json({ comments: threads });
		}

		if (req.method === "POST" && url.pathname.endsWith("/comments")) {
			const body = (await req.json()) as CommentThread;
			this.addComment(body);
			await this.persistNow();
			return Response.json({ ok: true });
		}

		if (req.method === "POST" && url.pathname.endsWith("/comments/resolve")) {
			const body = (await req.json()) as {
				threadId: string;
				resolved: boolean;
			};

			this.resolveComment(body.threadId, body.resolved);
			await this.persistNow();

			return Response.json({ ok: true });
		}

		if (req.method === "POST" && url.pathname.endsWith("/comments/reply")) {
			const body = (await req.json()) as {
				threadId: string;
				reply: CommentReply;
			};

			this.addReply(body.threadId, body.reply);
			await this.persistNow();

			return Response.json({ ok: true });
		}

		return new Response("Not found", { status: 404 });
	}
}
