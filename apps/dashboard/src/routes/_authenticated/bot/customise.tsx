import { createFileRoute } from "@tanstack/react-router";
import { CustomiseBot } from "@/features/bot/customise";

export const Route = createFileRoute("/_authenticated/bot/customise")({
	component: CustomiseBot,
	staticData: {
		breadcrumb: () => "Bot / Customise",
	},
});
