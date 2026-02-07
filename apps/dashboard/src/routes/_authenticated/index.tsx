import { createFileRoute } from "@tanstack/react-router";

// import { profileQueries } from "@/data/queries/profile.queries";

import { Dashboard } from "@/features/dashboard";

export const Route = createFileRoute("/_authenticated/")({
	component: Dashboard,
	// loader: async ({ context }) => {
	// 	const { queryClient } = context;

	// 	const profile = await queryClient.fetchQuery(profileQueries.current());

	// 	if (!profile.onboardingCompletedAt) {
	// 		console.log("Onboarding not completed");
	// 	}

	// 	return {
	// 		profile,
	// 	};
	// },
});
