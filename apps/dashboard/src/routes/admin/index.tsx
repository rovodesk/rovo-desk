import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
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

function AdminDashboard() {
	return <div>Adnib</div>;
}
