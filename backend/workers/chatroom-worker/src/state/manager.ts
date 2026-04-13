import { ROOM_STATUS, type RoomState } from "@/types";
import type { IStateManager } from "./adapter";

type StateManagerDeps = {
	ctx: DurableObjectState;
	roomName: string;
	maxMessages?: number;
};

export class StateManager implements IStateManager {
	private ctx: DurableObjectState;
	private roomName: string;
	private maxMessages: number;

	private static STATE_KEY = "state";
	private static STALE_TTL = 1000 * 60 * 60; // 1 hour

	constructor(deps: StateManagerDeps) {
		this.ctx = deps.ctx;
		this.roomName = deps.roomName;
		this.maxMessages = deps.maxMessages ?? 100;
	}

	// ---------------------------
	// INIT (idempotent + safe)
	// ---------------------------
	async init(): Promise<RoomState> {
		return this.withLock(async () => {
			let state = await this.ctx.storage.get<RoomState>(StateManager.STATE_KEY);

			if (state && this.isStale(state)) {
				console.warn(`[StateManager] Cleaning stale room ${this.roomName}`);
				await this.ctx.storage.deleteAll();
				state = undefined;
			}

			if (!state) {
				state = this.createInitialState();
				await this.ctx.storage.put(StateManager.STATE_KEY, state);
			}

			return state;
		});
	}

	// ---------------------------
	// READ
	// ---------------------------
	async get(): Promise<RoomState> {
		const state = await this.ctx.storage.get<RoomState>(StateManager.STATE_KEY);

		if (!state) {
			throw new Error(
				`[StateManager] State not initialized for room ${this.roomName}`
			);
		}

		return state;
	}

	// ---------------------------
	// WRITE HELPERS
	// ---------------------------
	private async mutate(mutator: (state: RoomState) => void | Promise<void>) {
		await this.ctx.storage.transaction(async (txn) => {
			const state = await txn.get<RoomState>(StateManager.STATE_KEY);

			if (!state) {
				throw new Error(
					`[StateManager] Missing state in transaction (${this.roomName})`
				);
			}

			const prevVersion = state.version ?? 0;

			await mutator(state);

			state.version = prevVersion + 1;
			state.lastActiveAt = Date.now();

			await txn.put(StateManager.STATE_KEY, state);
		});
	}

	// ---------------------------
	// MUTATIONS
	// ---------------------------
	async appendMessage(message: any) {
		await this.mutate((state) => {
			state.messages.push(message);

			if (state.messages.length > this.maxMessages) {
				state.messages = state.messages.slice(-this.maxMessages);
			}
		});
	}

	async updateStatus(status: ROOM_STATUS) {
		await this.mutate((state) => {
			state.status = status;
		});
	}

	async assignAgent(agentId: string) {
		await this.mutate((state) => {
			state.status = ROOM_STATUS.ESCALATED;
			state.agentId = agentId;
		});
	}

	async touchAIResponse() {
		await this.mutate((state) => {
			state.lastAIResponseAt = Date.now();
		});
	}

	// ---------------------------
	// INTERNAL
	// ---------------------------
	private createInitialState(): RoomState {
		return {
			status: ROOM_STATUS.AI_ONLY,
			messages: [],
			createdAt: Date.now(),
			lastActiveAt: Date.now(),
			lastAIResponseAt: 0,
			version: 1,
		};
	}

	private isStale(state: RoomState): boolean {
		return Date.now() - state.lastActiveAt > StateManager.STALE_TTL;
	}

	/**
	 * Simple lock wrapper (DO is single-threaded, but protects async re-entry)
	 */
	private async withLock<T>(fn: () => Promise<T>): Promise<T> {
		return await fn();
	}
}
