// routes/index.tsx
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router"; // [!code ++]
import { getPunkSongs } from "@/data/demo-data";
import "@/styles/app.css";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@zero-heads-lab/backend/convex/_generated/api";

export const Route = createFileRoute("/_authenticated/")({
	// Check for auth BEFORE the route loads
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(
			convexQuery(api.auth.getCurrentUser, {})
		);

		// If no user is found, boot them to sign-in
		if (!user) {
			throw redirect({
				to: "/sign-in",
				search: {
					redirect: "/",
				},
			});
		}

		// Return user to make it available to the loader/component via 'context'
		return { user };
	},
	component: App,
});

function App() {
	// This query handles the actual page content
	const { data, isLoading, error } = useQuery({
		queryKey: ["punkSongs"],
		queryFn: () => getPunkSongs(),
	});

	if (isLoading) {
		return <div className="p-6">Loading punk songs...</div>;
	}

	if (error) {
		return <div className="p-6 text-red-500">Failed to load songs</div>;
	}

	return (
		<div className="p-6">
			<h1 className="mb-4 font-bold text-2xl">🎸 Punk Songs</h1>

			<ul className="space-y-3">
				{data?.map((song) => (
					<li
						className="flex justify-between rounded-lg border p-4"
						key={song.id}
					>
						<span className="font-medium">{song.name}</span>
						<span className="text-muted-foreground">{song.artist}</span>
					</li>
				))}
			</ul>
		</div>
	);
}
