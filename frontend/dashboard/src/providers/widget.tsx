import type { WidgetConfig } from "@zero-heads-lab/shared/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useWidget as useWidgetQuery } from "@/hooks/use-widget";

type WidgetContextType = {
	config: WidgetConfig | null;
	updateConfig: <K extends keyof WidgetConfig>(
		key: K,
		value: WidgetConfig[K]
	) => void;
	save: () => Promise<void>;
	isDirty: boolean;
	loading: boolean;
	reset: () => void;
	version?: number;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
	const { widget, isLoading, updateWidgetSettingsAsync } = useWidgetQuery();
	const [config, setConfig] = useState<WidgetConfig | null>(null);
	const [isDirty, setIsDirty] = useState(false);

	/* -------------------------
	   Load config from DB
	-------------------------- */

	useEffect(() => {
		if (widget?.config && !isDirty) {
			setConfig(widget.config);
		}
	}, [widget?.config, isDirty]);

	/* -------------------------
	   Update config locally
	-------------------------- */

	function updateConfig<K extends keyof WidgetConfig>(
		key: K,
		value: WidgetConfig[K]
	) {
		setConfig((prev) => {
			if (!prev) return prev;
			setIsDirty(true);
			return {
				...prev,
				[key]: value,
			};
		});
	}

	function reset() {
		if (widget?.config) {
			setConfig(widget.config);
			setIsDirty(false);
		}
	}

	/* -------------------------
	   Persist config to DB
	-------------------------- */

	async function save() {
		if (!config) return;

		await updateWidgetSettingsAsync({ widgetConfig: config });
		setIsDirty(false);
	}

	return (
		<WidgetContext.Provider
			value={{
				config,
				updateConfig,
				save,
				isDirty,
				loading: isLoading,
				reset,
				version: widget?.version,
			}}
		>
			{children}
		</WidgetContext.Provider>
	);
}

export function useWidget() {
	const ctx = useContext(WidgetContext);

	if (!ctx) {
		throw new Error("useWidget must be used inside WidgetProvider");
	}

	return ctx;
}
