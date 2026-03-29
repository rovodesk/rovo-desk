import type {
	ActionProvider,
	Store,
	WidgetState,
} from "@zero-heads-lab/engine";
import { createContext, useContext, useRef } from "react";

type WidgetContextType = {
	store: Store<WidgetState>;
	actions: ActionProvider<WidgetState>;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({
	store,
	actions,
	children,
}: {
	store: Store<WidgetState>;
	actions: ActionProvider<WidgetState>;
	children: React.ReactNode;
}) {
	const storeRef = useRef<Store<WidgetState>>(store);
	const actionsRef = useRef(actions);

	return (
		<WidgetContext.Provider
			value={{
				store: storeRef.current,
				actions: actionsRef.current,
			}}
		>
			{children}
		</WidgetContext.Provider>
	);
}

export function useWidgetContext() {
	const ctx = useContext(WidgetContext);
	if (!ctx) throw new Error("Missing WidgetProvider");
	return ctx;
}
