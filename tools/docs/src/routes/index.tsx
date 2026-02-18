import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Feature } from "@/components/feature";
import { baseOptions } from "@/lib/layout.shared";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<HomeLayout {...baseOptions()}>
			<main className="fade-in flex animate-in flex-col duration-700">
				{/* HERO */}
				<section className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-32 pb-28 text-center">
					<h1 className="font-serif text-[56px] leading-tight tracking-tight sm:text-[64px]">
						Zero Heads for Developers
					</h1>

					<p className="mt-8 max-w-2xl text-[18px] leading-relaxed">
						Integrate with Zero Heads by building apps on the complete{" "}
						<span className="hover:underline">
							AI customer service platform
						</span>
						. Create seamless customized experiences using our APIs and SDKs.
					</p>

					<div className="mt-10 flex items-center justify-center gap-4">
						<Button asChild>
							<Link
								className="rounded-md px-6 py-3 font-medium text-sm"
								params={{ _splat: "" }}
								to="/docs/$"
							>
								Start building
							</Link>
						</Button>

						<Button asChild variant="outline">
							<Link
								className="rounded-md px-6 py-3 font-medium text-sm"
								params={{ _splat: "" }}
								to="/docs/$"
							>
								See Docs
							</Link>
						</Button>
					</div>
				</section>

				{/* FEATURES */}
				<section className="mx-auto w-full max-w-6xl px-6 pb-32">
					<div className="grid gap-20 md:grid-cols-3">
						<Feature
							description="On Web, iOS, Android, and more. Make sure your platform is available everywhere your customers are."
							linkText="Install now →"
							title="Install Zero Heads"
						/>

						<Feature
							description="Offer an integration to thousands of customers. Build solutions from AI to reporting."
							linkText="Sign up for free →"
							title="Build and list an app"
						/>

						<Feature
							description="Build a solution just for your team on your main workspace. Extend your capabilities easily."
							linkText="See how it works →"
							title="Create a custom integration"
						/>
					</div>
				</section>

				{/* Grid */}
				<section className="mx-auto w-full max-w-6xl px-6 pb-32">
					<div className="grid gap-16 md:grid-cols-2">
						{/* Left side */}
						<div>
							<h2 className="font-serif text-3xl leading-snug">
								Join the brands who build <br /> on Zero Heads
							</h2>

							<div className="mt-8 grid grid-cols-2 gap-6 text-gray-400">
								<div className="font-medium">Product Hunt</div>
								<div className="font-medium">Coda</div>
								<div className="font-medium">tray.io</div>
								<div className="font-medium">Wootric</div>
								<div className="font-medium">Front</div>
							</div>

							<div className="mt-6">
								<Link
									className="font-medium text-primary text-sm hover:underline"
									params={{ _splat: "" }}
									to="/docs/$"
								>
									Go to app store →
								</Link>
							</div>
						</div>

						{/* Right side testimonial */}
						<div className="rounded-xl border-2 p-10 shadow-sm">
							<p className="leading-relaxed">
								<span className="text-4xl">“</span>
								<span className="text-2xl">
									The Zero Heads API had everything we needed to go from
									whiteboard to working app within a week. Plus, the
									documentation made it dead simple.
								</span>
								<span className="text-4xl">”</span>
							</p>

							<div className="mt-6 text-sm">
								<div className="font-semibold">Roger Zurawicki</div>
								<div className="text-muted-foreground">Engineer @ Coda</div>
							</div>
						</div>
					</div>
				</section>

				{/* =============================== */}
				{/* GUIDES SECTION */}
				{/* =============================== */}

				<section className="mx-auto w-full max-w-6xl px-6 pb-28 text-center">
					<h2 className="font-serif text-4xl">Guides for developers</h2>

					<div className="mt-14 grid gap-16 text-left md:grid-cols-3">
						<div>
							<h3 className="font-medium text-lg text-muted-foreground">
								🎟 Tickets + GitHub Issues
							</h3>
							<p className="mt-3 text-muted-foreground/40 text-sm leading-relaxed">
								<span className="text-primary hover:underline">
									Build an integration
								</span>{" "}
								using webhooks and the Tickets API to create a GitHub issue when
								a ticket is created.
							</p>
						</div>

						<div>
							<h3 className="font-medium text-lg text-muted-foreground">
								📈 Reporting
							</h3>
							<p className="mt-3 text-muted-foreground/40 text-sm leading-relaxed">
								<span className="text-primary hover:underline">
									Create your own reports
								</span>{" "}
								from conversation and teammates data using the API.
							</p>
						</div>

						<div>
							<h3 className="font-medium text-lg text-muted-foreground">
								✉ Inbox apps for admins
							</h3>
							<p className="mt-3 text-muted-foreground/40 text-sm leading-relaxed">
								In Zero Heads, admins are called teammates.{" "}
								<span className="text-primary hover:underline">
									Build an Inbox app
								</span>{" "}
								for a teammate to log data about a contact.
							</p>
						</div>
					</div>
				</section>

				{/* =============================== */}
				{/* NEED HELP SECTION */}
				{/* =============================== */}

				<section className="mx-auto h-full w-full max-w-5xl px-6 pb-32">
					<div className="flex flex-col items-start justify-between gap-6 rounded-xl border-2 px-10 py-12 md:flex-row md:items-center">
						<div>
							<h3 className="font-serif text-2xl text-muted-foreground">
								Need help?
							</h3>
							<p className="mt-2 text-muted-foreground/40 text-sm">
								Get fast, helpful support via chat or in the Zero Heads
								Community.
							</p>
						</div>

						<Button className="rounded-md bg-primary px-6 py-3 font-medium text-sm">
							Join community
						</Button>
					</div>
				</section>

				{/* =============================== */}
				{/* FOOTER */}
				{/* =============================== */}

				<footer className="border-t py-10 text-center text-muted-foreground text-sm">
					© {new Date().getFullYear()} Zero Heads
				</footer>
			</main>
		</HomeLayout>
	);
}
