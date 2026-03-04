/** biome-ignore-all lint/suspicious/noExplicitAny: Form and Fields are unknown */
import { ScrollArea } from "@zero-heads-lab/design-system/components/ui/scroll-area";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@zero-heads-lab/design-system/components/ui/tabs";
import type { WidgetConfig } from "@zero-heads-lab/shared/types";
import { useCallback } from "react";
import { AdvancedTab } from "../tabs/advanced-tab";
import { AppearanceTab } from "../tabs/appearance-tab";
import { BehaviorTab } from "../tabs/behavior-tab";
import { ConversationTab } from "../tabs/conversation-tab";
import { LauncherTab } from "../tabs/launcher-tab";
import { ScreensTab } from "../tabs/screens-tab";

type WidgetSidebarProps = {
	config: WidgetConfig;
	updateConfig: (
		field: keyof WidgetConfig,
		value: WidgetConfig[keyof WidgetConfig]
	) => void;
};

export const WidgetSidebar = ({ config, updateConfig }: WidgetSidebarProps) => {
	const updateTheme = useCallback(
		(partial: Partial<WidgetConfig["theme"]>) => {
			updateConfig("theme", {
				...config.theme,
				...partial,
			});
		},
		[updateConfig, config]
	);

	const updateLauncher = useCallback(
		(partial: Partial<WidgetConfig["launcher"]>) => {
			updateConfig("launcher", {
				...config.launcher,
				...partial,
			});
		},
		[config, updateConfig]
	);

	const updateHome = useCallback(
		(screens: WidgetConfig["screens"]) => {
			updateConfig("screens", {
				...config.screens,
				...screens,
			});
		},
		[updateConfig, config]
	);

	const updateConversation = useCallback(
		(partial: Partial<WidgetConfig["conversation"]>) => {
			updateConfig("conversation", {
				...config.conversation,
				...partial,
			});
		},
		[config, updateConfig]
	);

	const updateBehavior = useCallback(
		(partial: Partial<WidgetConfig["behavior"]>) => {
			updateConfig("behavior", {
				...config.behavior,
				...partial,
			});
		},
		[config, updateConfig]
	);

	const updateAdvanced = useCallback(
		(partial: Partial<WidgetConfig["advanced"]>) => {
			updateConfig("advanced", {
				...config.advanced,
				...partial,
			});
		},
		[config, updateConfig]
	);

	return (
		<div className="flex h-svh w-fit min-w-[380px] max-w-[560px] shrink-0 flex-col border-border border-r bg-background">
			{/* Tabs */}
			<Tabs className="flex min-h-0 flex-1 flex-col" defaultValue="launcher">
				<div className="border-border border-b px-2">
					<TabsList className="h-10 w-full justify-start gap-0 rounded-none bg-transparent p-0">
						{[
							"launcher",
							"home",
							"conversation",
							"appearance",
							"behavior",
							"advanced",
						].map((tab) => (
							<TabsTrigger
								className="rounded-none border-transparent border-b-2 px-3 py-2.5 text-xs capitalize data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
								key={tab}
								value={tab}
							>
								{tab === "home" ? "Home Screen" : tab}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<ScrollArea className="flex-1">
					<div className="p-4">
						<TabsContent className="mt-0" value="appearance">
							<AppearanceTab onChange={updateTheme} theme={config.theme} />
						</TabsContent>
						<TabsContent className="mt-0" value="launcher">
							<LauncherTab
								launcher={config.launcher}
								onChange={updateLauncher}
							/>
						</TabsContent>
						<TabsContent className="mt-0" value="home">
							<ScreensTab onChange={updateHome} screens={config.screens} />
						</TabsContent>
						<TabsContent className="mt-0" value="conversation">
							<ConversationTab
								conversation={config.conversation}
								onChange={updateConversation}
							/>
						</TabsContent>
						<TabsContent className="mt-0" value="behavior">
							<BehaviorTab
								behavior={config.behavior}
								onChange={updateBehavior}
							/>
						</TabsContent>
						<TabsContent className="mt-0" value="advanced">
							<AdvancedTab
								advanced={config.advanced}
								onChange={updateAdvanced}
							/>
						</TabsContent>
					</div>
				</ScrollArea>
			</Tabs>
		</div>
	);
};

export default WidgetSidebar;
