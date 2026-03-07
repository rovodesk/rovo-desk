import type { WidgetConfig, WidgetMode, WidgetTabType } from "@zero-heads-lab/shared/types";

export function resolveBlocks(
    config: WidgetConfig,
    mode: WidgetMode,
    tab?: WidgetTabType
) {
    const modeConfig = config.screens?.[mode];
    if (!modeConfig) return [];

    const activeTab: WidgetTabType = tab ?? modeConfig.defaultTab;

    const screen = modeConfig.screens.find((s: { tab: WidgetTabType; }) => s.tab === activeTab);

    return screen?.blocks ?? [];
}
