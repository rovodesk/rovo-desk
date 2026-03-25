import type {
	StateListener,
	StateSubscriber,
	StateUpdater,
	WidgetState,
} from "../types";

/**
 * Store Interface used to interact with the current state of the application.
 */
export interface Store<T extends WidgetState> {
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

export const initialStore = <T extends WidgetState>(
	initialState: T
): Store<T> => {
	// Create a deep copy of the initial state to avoid mutating the original object.
	//⚠️ StructuredClone can break in some environments.
	// Not supported in older browsers
	// Slower than necessary
	// Unnecessary if initialState is not mutated

	// let state = structuredClone(initialState);

	let state: T = { ...initialState };

	// Use a Set to store the listeners to avoid duplicate listeners.
	const listeners = new Set<StateListener<T>>();

	// Get the current state
	const getState = () => state;

	// Update the current state
	const setState: StateUpdater<T> = (updater) => {
		const partialState =
			typeof updater === "function" ? updater(state) : updater;

		if (!partialState || typeof partialState !== "object") return;

		const hasChanged = Object.keys(partialState).some(
			(key) => !Object.is(state[key as keyof T], partialState[key as keyof T])
		);

		if (!hasChanged) return;

		const prevState = state;
		state = { ...state, ...partialState };
		console.log("UPDATED", state);

		for (const listener of listeners) {
			listener(state, prevState);
		}
	};

	// Subscribe to the state changes
	const subscribe: StateSubscriber<T> = (listener) => {
		listeners.add(listener);

		return () => {
			listeners.delete(listener);
		};
	};

	return { getState, setState, subscribe };
};
