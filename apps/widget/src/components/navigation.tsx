import type { WidgetTabType } from "@zero-heads-lab/shared/types";
import { capitalize } from "@zero-heads-lab/shared/utils";
import {
	HelpCircle,
	Home,
	Loader2,
	Megaphone,
	MessageSquare,
} from "lucide-react";
import { useWidgetActions } from "@/hooks/use-widget-actions";
import { useWidgetState } from "../hooks/use-widget-state";
import { screenRegistry } from "../screens";

type TabConfig = {
	label: string;
	icon: any;
};

export const TAB_CONFIG: Partial<Record<WidgetTabType, TabConfig>> = {
	welcome: {
		label: "Home",
		icon: Home,
	},
	inbox: {
		label: "Messages",
		icon: MessageSquare,
	},
	knowledge_base: {
		label: "Help",
		icon: HelpCircle,
	},
	publications: {
		label: "News",
		icon: Megaphone,
	},
};

export function Navigation() {
	const state = useWidgetState();
	const actions = useWidgetActions();

	const activeTab = state.activeTab ?? "welcome";

	const tabs = (Object.keys(screenRegistry) as WidgetTabType[]).filter(
		(tab) => tab !== "conversation"
	);

	if (!state.isInitialized) {
		return (
			<div className="relative z-10 -mt-px border-white/10 border-t bg-[#161618] px-2 py-2">
				<div className="flex items-center justify-between">
					{/* Skeleton tabs */}
					{[1, 2, 3].map((i) => (
						<div
							className="flex flex-1 flex-col items-center justify-center gap-2 py-2"
							key={i}
						>
							<div className="h-5 w-5 animate-pulse rounded-md bg-white/10" />
							<div className="h-2 w-10 animate-pulse rounded bg-white/10" />
						</div>
					))}
				</div>

				{/* Bottom subtle loading indicator */}
				<div className="mt-2 flex items-center justify-center gap-2 text-white/40 text-xs">
					<Loader2 className="h-3 w-3 animate-spin" />
					<span>Initializing…</span>
				</div>
			</div>
		);
	}

	return (
		<div className="relative z-10 -mt-px border-white/10 border-t bg-[#161618] px-2 py-3">
			<div className="flex items-center justify-between">
				{tabs.map((tab) => {
					const isActive = activeTab === tab;

					const config = TAB_CONFIG[tab];
					const Icon = config?.icon ?? Home;
					const label = config?.label ?? capitalize(tab.replace("_", " "));

					return (
						<button
							className="group flex flex-1 flex-col items-center justify-center gap-[5px] py-1"
							key={tab}
							onClick={() => actions.navigate(tab)}
						>
							<div className="relative flex items-center justify-center">
								<Icon
									className={`transition-all duration-200 ${
										isActive
											? "text-white"
											: "text-neutral-400 group-hover:text-white/80"
									}`}
									size={23}
									strokeWidth={2.2}
								/>
								{tab === "inbox" && (
									<div className="absolute -top-[5px] -right-[6px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#E5484D] font-bold text-[10px] text-white shadow-sm ring-2 ring-[#161618]">
										1
									</div>
								)}
							</div>

							<span
								className={`text-[12px] transition-all duration-200 ${
									isActive
										? "font-semibold text-white tracking-wide"
										: "font-medium text-white/40 group-hover:text-white/70"
								}`}
							>
								{label}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
