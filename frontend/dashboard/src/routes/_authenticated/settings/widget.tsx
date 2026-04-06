import { createFileRoute } from "@tanstack/react-router";
// import { WidgetProvider } from "@/providers/widget";

export const Route = createFileRoute("/_authenticated/settings/widget")({
	component: () => (
		// <WidgetProvider>
		// <WidgetSettings />
		// </WidgetProvider>
		<>Placeholder</>
	),
});
