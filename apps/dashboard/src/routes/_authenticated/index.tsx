import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/features/dashboard";
import { profileQueries } from "@/lib/queries/profile.queries";

export const Route = createFileRoute("/_authenticated/")({
	component: Dashboard,
	loader: async ({ context }) => {
		const { queryClient } = context;

		const profile = await queryClient.fetchQuery(profileQueries.current());

		if (!profile.onboardingCompletedAt) {
			console.log("Onboarding not completed");
		}

		return {
			profile,
		};
	},
});
