import type { BotState } from "./types";

/**
 * 1. Keep an overview over the state
 * 2. Expose methods for interacting with the state
 * 3. Re render our application when state changes
 * @param initialState
 * @returns
 */
export const stateManager = <T extends BotState>(initialState: T) => {
	let state = initialState;
	const listeners: Array<(state: T) => void> = [];

	const stateUpdater = (updater: Partial<T> | ((state: T) => T)) => {
		if (typeof updater === "function") {
			state = updater(state);
		} else {
			state = { ...state, ...updater };
		}
		fireListeners();
	};

	const registerListener = (listenerFunc: (state: T) => void) => {
		listeners.push(listenerFunc);
	};

	const fireListeners = () => {
		listeners.forEach((listener) => {
			listener(state);
		});
	};

	return [state, stateUpdater, registerListener] as const;
};

export default stateManager;
