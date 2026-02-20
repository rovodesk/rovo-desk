import { createFileRoute } from "@tanstack/react-router";
import { AddConnection } from "@/features/bot/connection/add";

export const Route = createFileRoute("/_authenticated/bot/connection/add")({
	component: AddConnection,
	staticData: {
		breadcrumb: () => "Bot / Connection / Add",
	},
});
