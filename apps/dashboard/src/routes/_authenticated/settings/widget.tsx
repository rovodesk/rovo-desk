import { createFileRoute } from "@tanstack/react-router";
import { WidgetSettings } from "@/features/settings/widget";

export const Route = createFileRoute("/_authenticated/settings/widget")({
	component: WidgetSettings,
});
