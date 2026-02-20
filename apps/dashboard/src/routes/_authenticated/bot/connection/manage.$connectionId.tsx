import { createFileRoute } from "@tanstack/react-router";
import ManageConnection from "@/features/bot/connection/manage";

export const Route = createFileRoute(
	"/_authenticated/bot/connection/manage/$connectionId"
)({
	component: ManageConnection,
	loader: ({ params }) => {
		return { connectionId: params.connectionId };
	},
	staticData: {
		breadcrumb: () => "Bot / Connection / Manage",
	},
});
