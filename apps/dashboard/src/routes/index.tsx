// routes/index.tsx

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getPunkSongs } from "@/data/demo-data";
import "@/styles/app.css";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
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
