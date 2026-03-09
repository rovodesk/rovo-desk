import { createFileRoute } from "@tanstack/react-router";
import { getHomePage } from "@/lib/utils/queries";
import HomePage from "@/pages/home";

export const Route = createFileRoute("/")({
	component: HomePage,
	loader: async ({ context }) => {
		const queryClient = context.queryClient;

		await queryClient.ensureQueryData({
			queryKey: ["pages", "home"],
			queryFn: getHomePage,
		});
	},
});
