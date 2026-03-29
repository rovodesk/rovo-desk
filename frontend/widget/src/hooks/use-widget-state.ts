import { useSyncExternalStore } from "react";
import { useWidgetContext } from "../context";

export function useWidgetState() {
	const { store } = useWidgetContext();

	return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}
