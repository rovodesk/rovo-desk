// import { useWidgetActions } from "@/hooks/use-widget-actions";
// import { useWidgetState } from "@/hooks/use-widget-state";
// import { resolveScreen } from "@/utils";
// import { ChatIcon, CloseIcon } from "./icons";
// import { Navigation } from "./navigation";

// const DEFAULT_WIDGET_CONFIG = {
// 	launcher: { position: "bottom-right" },
// 	theme: {
// 		shadow: true,
// 	},
// };

// const DEFAULT_WIDGET_WIDTH = 400;
// const DEFAULT_WIDGET_HEIGHT = 704;
// const DEFAULT_BORDER_RADIUS = 24;

// export function Widget() {
// 	const state = useWidgetState();

// 	// Default widget config
// 	const widgetConfig = state.config?.widget ?? DEFAULT_WIDGET_CONFIG;

// 	const theme = widgetConfig.theme;
// 	const width = DEFAULT_WIDGET_WIDTH;
// 	const height = DEFAULT_WIDGET_HEIGHT;

// 	// 🔹 Resolve screen (typed)
// 	const Screen = resolveScreen(state);

// 	return (
// 		<div className="relative h-full w-full">
// 			<div className="absolute right-6 bottom-6 flex flex-col items-end gap-3">
// 				{/* Panel */}
// 				<div
// 					className={`rovodesk-widget flex origin-bottom-right transform-gpu flex-col overflow-hidden transition-[transform,opacity,box-shadow] duration-300 will-change-transform ease-out${
// 						state.ui?.isOpen
// 							? "open pointer-events-auto translate-y-0 scale-100 opacity-100"
// 							: "pointer-events-none translate-y-4 scale-95 opacity-0"
// 					}
//         `}
// 					style={{
// 						width,
// 						height,
// 						background: theme.backgroundColor ?? "#0F0F0F",
// 						borderRadius: DEFAULT_BORDER_RADIUS,
// 					}}
// 				>
// 					{/* 🔹 Screen area (takes remaining space) */}
// 					<div className="flex-1 overflow-hidden">
// 						<Screen state={state} />
// 					</div>

// 					{/* 🔹 Navigation Bar Fixed at bottom */}
// 					<Navigation />
// 				</div>

// 				{/* Launcher */}
// 				{!widgetConfig.launcher?.hideDefault && <Launcher />}
// 			</div>
// 		</div>
// 	);
// }

// function Launcher() {
// 	const { ui } = useWidgetState();
// 	const actions = useWidgetActions();

// 	const toggle = () => {
// 		if (!ui?.isInitialized) return;
// 		if (ui?.isOpen) {
// 			actions.close();
// 		} else {
// 			actions.open();
// 		}
// 	};

// 	return (
// 		<button
// 			className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full transition-all duration-300 ease-out ${ui?.isInitialized ? "" : "cursor-not-allowed opacity-50"}`}
// 			disabled={!ui?.isInitialized}
// 			onClick={toggle}
// 		>
// 			{/* 🔥 Gradient background */}
// 			<div className="absolute inset-0 rounded-full bg-linear-to-br from-black via-indigo-900 to-blue-900" />

// 			{/* 🔥 Glow layer (controlled, no bleed) */}
// 			<div className="pointer-events-none absolute inset-0 rounded-full bg-indigo-500/30 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

// 			{/* 🔥 Icon */}
// 			<div
// 				className={`relative z-10 flex items-center justify-center text-white transition-all duration-300 ${ui?.isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"}
//         `}
// 			>
// 				{ui?.isOpen ? <CloseIcon /> : <ChatIcon />}
// 			</div>
// 		</button>
// 	);
// }
