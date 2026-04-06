import { SDKConfigSchema } from "@zero-heads-lab/shared/validations";
import { mountWidget } from "./components/mount";
import "./style/widget.css";

(function bootstrap() {
	const root = document.getElementById("rovodesk-root");
	if (!root) {
		console.error("[Rovodesk] No root");
		return;
	}

	const { store, actions, unmount } = mountWidget(root);

	// We start with "*" to allow the init message from any origin (or referrer if preferred)
	// and lock it to the actual origin once we receive "init"
	let parentOrigin = "*";
	let resizeTimeout: ReturnType<typeof setTimeout>;

	const sendResize = (state: ReturnType<typeof store.getState>) => {
		const panelWidth = state.config?.widget?.theme?.widgetWidth ?? 440;
		const panelHeight = state.config?.widget?.theme?.widgetHeight ?? 720;

		const GAP = 12;
		const LAUNCHER = 64;
		const SHADOW_Y = 60;
		const SHADOW_X = 140;

		const height = state.ui?.isOpen
			? panelHeight + GAP + LAUNCHER + SHADOW_Y
			: LAUNCHER + SHADOW_Y;

		const widgetWidth = state.ui?.isOpen
			? panelWidth + SHADOW_X
			: LAUNCHER + SHADOW_X;

		const payload = { width: widgetWidth, height };

		clearTimeout(resizeTimeout);

		if (state.ui?.isOpen) {
			window.parent.postMessage({ type: "resize", ...payload }, parentOrigin);
		} else {
			resizeTimeout = setTimeout(() => {
				window.parent.postMessage({ type: "resize", ...payload }, parentOrigin);
			}, 300);
		}
	};
	// Send initial size immediately
	sendResize(store.getState());

	// biome-ignore lint/suspicious/noExplicitAny: Stte can be any
	const unsubscribe = store.subscribe((state: any) => {
		sendResize(state);
	});

	// HANDLE Commands
	function handleMessage(e: MessageEvent) {
		if (parentOrigin !== "*" && e.origin !== parentOrigin) return;
		if (!e.data || typeof e.data !== "object") return;

		const { type, payload } = e.data;

		switch (type) {
			case "init": {
				if (store.getState().ui?.isInitialized) return;

				// Capture origin, falling back to '*' if 'null' (e.g., local files or sandboxed iframes)
				parentOrigin = e.origin === "null" ? "*" : e.origin;

				const result = SDKConfigSchema.safeParse(payload);
				if (!result.success) {
					console.error("[Rovodesk] Invalid config:", result.error);
					return;
				}

				actions.init(result.data);
				break;
			}

			case "open":
				actions.open();
				break;

			case "close":
				actions.close();
				break;

			case "update":
				if (!payload || typeof payload !== "object") return;

				// biome-ignore lint/suspicious/noExplicitAny:Any Type
				store.setState((prev: any) => ({
					config: {
						...(prev.config ?? {}),
						...payload,
					},
				}));
				break;

			default:
				console.warn("[Rovodesk] Unknown command:", type);
		}
	}
	window.addEventListener("message", handleMessage);

	// 🔹 Cleanup
	window.addEventListener("beforeunload", () => {
		unsubscribe();
		window.removeEventListener("message", handleMessage);
		unmount?.();
	});
})();
