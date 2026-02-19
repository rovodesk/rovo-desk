import type { BotState } from "./types";

export type StateManager<T extends BotState> = [
	T,
	(updater: Partial<T> | ((state: T) => T)) => void,
	(listenerFunc: (state: T) => void) => void,
];

export const stateManager = <T extends BotState>(
	initialState: T
): StateManager<T> => {
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
