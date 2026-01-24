import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	useRouteContext,
	useRouterState,
} from "@tanstack/react-router";
import { api } from "@zero-heads-lab/backend/convex/_generated/api";
import { LogoIcon } from "@zero-heads-lab/design-system/components/logo";
import { NavigationProgress } from "@zero-heads-lab/design-system/components/navigation-progress";
import { LogOutIcon, Music2 } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/header";
import { SignOutDialog } from "@/components/sign-out-dialog";
import { getPunkSongs } from "@/data/demo-data";

export const Route = createFileRoute("/_authenticated/")({
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(
			convexQuery(api.auth.getCurrentUser, {})
		);
		return { user };
	},
	component: App,
});

function App() {
	const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
	const { user } = useRouteContext({ from: Route.id });

	// Logic: Show progress bar if the router is fetching data
	const isLoadingRoute = useRouterState({ select: (s) => s.isLoading });

	const { data, isLoading } = useQuery({
		queryKey: ["punkSongs"],
		queryFn: () => getPunkSongs(),
	});

	return (
		<div className="min-h-screen bg-background">
			<NavigationProgress isNavigating={isLoadingRoute} />

			<Header className="sticky top-0 z-40 border-b bg-card/50 backdrop-blur-md">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<div className="flex items-center gap-4">
						<LogoIcon className="size-8 text-primary" />
						<h1 className="font-bold text-xl tracking-tight">Zero Heads Lab</h1>
					</div>

					<div className="flex items-center gap-6">
						<div className="hidden text-right md:block">
							<p className="font-medium text-sm leading-none">{user?.name}</p>
							<p className="mt-1 text-muted-foreground text-xs">
								{user?.email}
							</p>
						</div>

						<SignOutDialog
							onOpenChange={setSignOutDialogOpen}
							open={signOutDialogOpen}
							trigger={
								<button
									aria-label="Sign out"
									className="flex size-9 items-center justify-center rounded-full border bg-background text-destructive transition-colors hover:bg-muted"
									type="button"
								>
									<LogOutIcon className="size-4" />
								</button>
							}
						/>
					</div>
				</div>
			</Header>

			<main className="container mx-auto max-w-4xl p-6">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h2 className="font-bold text-3xl tracking-tight">🎸 Punk Songs</h2>
						<p className="text-muted-foreground">
							The ultimate collection of high-energy tracks.
						</p>
					</div>
				</div>

				{isLoading ? (
					<div className="grid gap-4">
						{[1, 2, 3].map((i) => (
							<div
								className="h-20 w-full animate-pulse rounded-xl bg-muted"
								key={i}
							/>
						))}
					</div>
				) : (
					<div className="grid gap-3">
						{data?.map((song) => (
							<div
								className="group flex items-center justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
								key={song.id}
							>
								<div className="flex items-center gap-4">
									<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Music2 className="size-5" />
									</div>
									<div>
										<p className="font-semibold text-card-foreground">
											{song.name}
										</p>
										<p className="text-muted-foreground text-sm">
											{song.artist}
										</p>
									</div>
								</div>
								<div className="rounded bg-muted px-2 py-1 font-mono text-muted-foreground text-xs uppercase tracking-widest">
									Punk-Rock
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
