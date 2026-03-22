import { useWidgetActions } from "@/hooks/use-widget-actions";
import { useWidgetState } from "@/hooks/use-widget-state";
import { ChatIcon, CloseIcon } from "./icons";
import { Navigation } from "./navigation";
import { resolveScreen } from "@/utils";

const DEFAULT_WIDGET_CONFIG = {
	launcher: { position: "bottom-right" },
	theme: {
		shadow: true,
	}
}

const DEFAULT_WIDGET_WIDTH = 400;
const DEFAULT_WIDGET_HEIGHT = 704;
const DEFAULT_BORDER_RADIUS = 24;

export function Widget() {
	const state = useWidgetState();

	// Default widget config
	const widgetConfig = state.widgetConfig ?? DEFAULT_WIDGET_CONFIG;

	const theme = widgetConfig.theme;
	const width = DEFAULT_WIDGET_WIDTH;
	const height = DEFAULT_WIDGET_HEIGHT;


	// 🔹 Resolve screen (typed)
	const Screen = resolveScreen(state);


	return (
		<div className="relative h-full w-full">
			<div className="absolute right-6 bottom-6 flex flex-col items-end gap-3">
				{/* Panel */}
				<div
					className={`rovodesk-widget flex flex-col overflow-hidden transform-gpu will-change-transform origin-bottom-right transition-[transform,opacity,box-shadow] duration-300 ease-out
         					${state.isOpen
							? "open opacity-100 translate-y-0 scale-100 pointer-events-auto"
							: "opacity-0 translate-y-4 scale-95 pointer-events-none"
						}
        `}
					style={{
						width,
						height,
						background: theme.backgroundColor ?? "#0F0F0F",
						borderRadius: DEFAULT_BORDER_RADIUS,
					}}
				>
					{/* 🔹 Screen area (takes remaining space) */}
					<div className="flex-1 overflow-hidden">
						<Screen state={state} />
					</div>

					{/* 🔹 Navigation Bar Fixed at bottom */}
					<Navigation />
				</div>

				{/* Launcher */}
				{!widgetConfig.launcher?.hideDefault && <Launcher />}
			</div>
		</div>
	);
}

function Launcher() {
	const { isOpen, isInitialized } = useWidgetState();
	const actions = useWidgetActions();

	const toggle = () => {
		if (!isInitialized) return;
		if (isOpen) {
			actions.close();
		} else {
			actions.open();
		}
	};

	return (
		<button
			className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full transition-all duration-300 ease-out ${!isInitialized ? 'opacity-50 cursor-not-allowed' : ''}`}
			onClick={toggle}
			disabled={!isInitialized}
		>
			{/* 🔥 Gradient background */}
			<div className="absolute inset-0 rounded-full bg-linear-to-br from-black via-indigo-900 to-blue-900" />

			{/* 🔥 Glow layer (controlled, no bleed) */}
			<div className="pointer-events-none absolute inset-0 rounded-full bg-indigo-500/30 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

			{/* 🔥 Icon */}
			<div
				className={`relative z-10 flex items-center justify-center text-white transition-all duration-300 ${isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"}
        `}
			>
				{isOpen ? <CloseIcon /> : <ChatIcon />}
			</div>
		</button>
	);
}	
