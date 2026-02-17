import { createFileRoute } from "@tanstack/react-router";
import { AddSource } from "@/features/bot/add-source";

export const Route = createFileRoute("/_authenticated/bot/add-source")({
	component: AddSource,
	staticData: {
		breadcrumb: () => "Bot / Add Source",
	},
});
