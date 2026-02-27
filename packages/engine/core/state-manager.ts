import type { BotState } from "../types";

type listenerFunc<T> = (state: T) => void;

/**
 * Store Interface used to interact with the current state of the application.
 */
interface Store<T> {
	/**
	 * Get the current state.
	 */
	getState: () => T;
	/**
	 * Update the current state.
	 */
	setState: (updater: Partial<T> | ((state: T) => T)) => void;
	/**
	 * Subscribe to the state changes.
	 */
	subscribe: (listener: listenerFunc<T>) => () => void;
}

const initialStore = <T extends BotState>(initialState: T): Store<T> => {
	// Create a deep copy of the initial state to avoid mutating the original object.
	let state = structuredClone(initialState);
	// Use a Set to store the listeners to avoid duplicate listeners.
	const listeners: Set<listenerFunc<T>> = new Set<listenerFunc<T>>();

	const getState = () => state;

	const setState = (updater: Partial<T> | ((state: T) => T)) => {
		const nextState =
			typeof updater === "function"
				? (updater as (state: T) => T)(state)
				: { ...state, ...updater };

		if (Object.is(nextState, state)) return;

		state = nextState;
		listeners.forEach((listener) => listener(state));
	};

	const subscribe = (listener: listenerFunc<T>) => {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	};

	return { getState, setState, subscribe };
};

export { initialStore, type Store };
