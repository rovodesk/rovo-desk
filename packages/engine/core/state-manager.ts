import type {
	BotState,
	NewState,
	StateListener,
	StateSubscriber,
	StateUpdater,
} from "../types";

/**
 * Store Interface used to interact with the current state of the application.
 */
export interface Store<T extends BotState> {
	/**
	 * Get the current state.
	 */
	getState: () => T;
	/**
	 * Update the current state.
	 */
	setState: StateUpdater<T>;
	/**
	 * Subscribe to the state changes.
	 */
	subscribe: StateSubscriber<T>;
}

export const initialStore = <T extends BotState>(initialState: T): Store<T> => {
	// Create a deep copy of the initial state to avoid mutating the original object.
	let state = structuredClone(initialState);
	// Use a Set to store the listeners to avoid duplicate listeners.
	const listeners: Set<StateListener<T>> = new Set<StateListener<T>>();

	const getState = () => state;

	const setState = (updater: NewState<T>) => {
		const partialState =
			typeof updater === "function" ? updater(state) : updater;

		if (!partialState || typeof partialState !== "object") return;

		const nextState = { ...state, ...partialState };

		// Shallow equality check
		const hasChanged = Object.keys(partialState).some(
			(key) => !Object.is(state[key as keyof T], nextState[key as keyof T])
		);
		if (!hasChanged) return;

		// Change state and notify listeners
		state = nextState;
		listeners.forEach((listener) => listener(state));
	};

	const subscribe = (listener: StateListener<T>) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};

	return { getState, setState, subscribe };
};
