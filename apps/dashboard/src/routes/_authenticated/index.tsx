import { createFileRoute } from "@tanstack/react-router";

<<<<<<< HEAD
// import { profileQueries } from "@/data/queries/profile.queries";
=======


>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

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
