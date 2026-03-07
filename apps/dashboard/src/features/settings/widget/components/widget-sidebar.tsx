/** biome-ignore-all lint/suspicious/noExplicitAny: Form and Fields are unknown */
import { ScrollArea } from "@zero-heads-lab/design-system/components/ui/scroll-area";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@zero-heads-lab/design-system/components/ui/tabs";
import {
	type WidgetConfig,
	WidgetConfigKeys,
} from "@zero-heads-lab/shared/types";
import { useCallback } from "react";
import { AdvancedTab } from "./tabs/advanced-tab";
import { AppearanceTab } from "./tabs/appearance-tab";
import { LauncherTab } from "./tabs/launcher-tab";
import { ScreensTab } from "./tabs/screens-tab";

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
						{WidgetConfigKeys.map((tab) => (
							<TabsTrigger
								className="rounded-none border-transparent border-b-2 px-3 py-2.5 text-xs capitalize data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
								key={tab}
								value={tab}
							>
								{tab === "screens" ? "Screens" : tab}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<ScrollArea className="flex-1">
					<div className="p-4">
						<TabsContent className="mt-0" value="launcher">
							<LauncherTab
								launcher={config.launcher}
								onChange={updateLauncher}
							/>
						</TabsContent>
						<TabsContent className="mt-0" value="appearance">
							<AppearanceTab onChange={updateTheme} theme={config.theme} />
						</TabsContent>
						<TabsContent className="mt-0" value="screens">
							<ScreensTab onChange={updateHome} screens={config.screens} />
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
