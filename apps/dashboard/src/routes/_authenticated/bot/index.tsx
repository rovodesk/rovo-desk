import { createFileRoute } from "@tanstack/react-router";
import { BotHome } from "@/features/bot";

export const Route = createFileRoute("/_authenticated/bot/")({
	component: BotHome,
	staticData: {
		breadcrumb: () => "Bot",
	},
});
