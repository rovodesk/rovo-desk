import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { IntegrationFlowAnimation } from "./integration-flow";
import { Scribble } from "./scribble";

export default function ProblemSection({ className }: { className?: string }) {
	return (
		<section className={cn("relative", className)}>
			{/* Background "Noise" & Grid */}
			<Background />

			{/* Content */}
			<div className="relative z-10 w-full px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
				<div className="mx-auto max-w-7xl">
					<div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center lg:gap-20">
						{/* LEFT CONTENT */}
						<div className="relative lg:col-span-5">
							{/* Background Scribble - Top Left */}
							<div className="absolute -top-12 -left-12 opacity-40 lg:opacity-100">
								<Scribble />
							</div>

							<AnimatePresence mode="wait">
								<motion.div
									animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
									className="relative z-10 flex flex-col gap-6 lg:gap-10"
									exit={{ opacity: 0, x: 30, filter: "blur(12px)" }}
									initial={{ opacity: 0, x: -30, filter: "blur(12px)" }}
									transition={{
										duration: 0.6,
										ease: [0.22, 1, 0.36, 1], // Custom "Expo" easing
									}}
								>
									{/* Tag + Line Decor */}
									<div className="flex items-center gap-4">
										<div className="h-px w-8 bg-blue-600 lg:w-12" />
										<span className="font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em] lg:text-[11px]">
											RovoDesk AI
										</span>
									</div>

									{/* High-Contrast Heading */}
									<h2 className="max-w-md font-extrabold text-4xl text-blue-600 leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
										Connected Across Tools
									</h2>

									{/* The "Insight" Glass Card */}
									<InsightCard />
								</motion.div>
							</AnimatePresence>
						</div>

						{/* RIGHT STAGE */}
						<div className="lg:col-span-7">
							<div className="relative aspect-4/3 w-full sm:aspect-video">
								{/* Glass Canvas */}
								<div className="h-full w-full overflow-hidden rounded-2xl backdrop-blur-sm">
									<AnimatePresence mode="wait">
										<motion.div
											animate={{ opacity: 1, scale: 1 }}
											className="flex h-full w-full items-center justify-center"
											exit={{ opacity: 0, scale: 1.05 }}
											initial={{ opacity: 0, scale: 0.95 }}
											transition={{ duration: 0.6, ease: "anticipate" }}
										>
											<IntegrationFlowAnimation className="h-full w-full scale-[0.9] sm:scale-95 lg:scale-100" />
										</motion.div>
									</AnimatePresence>
								</div>

								{/* Floating UI */}
								<motion.div
									animate={{ y: [0, -10, 0] }}
									className="absolute -top-6 -right-6 hidden w-48 rounded-2xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur-md lg:block"
									transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
								>
									<div className="flex flex-col gap-2">
										<div className="h-2 w-1/2 rounded-full bg-slate-100" />
										<div className="h-2 w-full rounded-full bg-slate-200" />

										<div className="mt-2 flex justify-between">
											<div className="h-4 w-4 rounded-full bg-green-400" />
											<div className="h-4 w-12 rounded-full bg-slate-900" />
										</div>
									</div>
								</motion.div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function InsightCard() {
	return (
		<div className="group relative max-w-xl">
			{/* BACKGROUND DEPTH: A wide, soft gradient wash */}
			{/* FLOATING BREADCRUMB: Premium "Path" UI */}
			<div className="mb-4 flex items-center gap-2 px-2">
				<div className="h-1.5 w-1.5 rounded-lg bg-slate-300" />
				<span className="font-bold font-mono text-[10px] text-slate-400 uppercase tracking-widest">
					RovoDesk <span className="mx-1 text-slate-200">/</span> Integrations{" "}
					<span className="mx-1 text-slate-200">/</span>{" "}
					<span className="text-blue-600">Unified_Layer</span>
				</span>
			</div>

			{/* THE CARD: Border-less High-Contrast Glass */}
			{/* CONTENT: High-density typography */}
			<div className="relative z-10 space-y-8 rounded-2xl border border-slate-200 bg-white/10 p-6 shadow-lg backdrop-blur-md">
				<h3 className="font-bold text-2xl text-slate-900 tracking-tight lg:text-3xl dark:text-white">
					Consolidate your <span className="font-serif italic">entire</span>{" "}
					tech stack.
				</h3>

				{/* ACCENT: The Scribble as a "Seal of Quality" */}
				<div className="absolute top-8 right-8 scale-75 opacity-20 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
					<Scribble />
				</div>

				<p className="max-w-md text-lg text-slate-500 leading-relaxed transition-colors dark:text-white">
					Stop context-switching between Intercom, Hubspot, and Notion. RovoDesk
					acts as the{" "}
					<span className="rounded bg-slate-100 px-1.5 py-0.5 font-bold font-mono text-slate-800 text-sm dark:bg-blue-600 dark:text-white">
						0_sync
					</span>{" "}
					layer for your team.
				</p>

				{/* DATA VIZ STRIP: Premium "Live Feed" aesthetic */}
				<div className="flex items-center gap-6 pt-4">
					<div className="flex flex-col">
						<span className="font-bold text-[10px] text-blue-600 uppercase">
							Latency
						</span>
						<span className="font-mono font-semibold text-sm dark:text-white">
							12ms
						</span>
					</div>
					<div className="h-8 w-px bg-slate-200" />
					<div className="flex flex-col">
						<span className="font-bold text-[10px] text-blue-600 uppercase">
							Throughput
						</span>
						<span className="font-mono font-semibold text-sm dark:text-white">
							99.9%
						</span>
					</div>

					{/* Animated Mini-Waveform */}
					<div className="flex h-6 items-end gap-0.5">
						{[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
							<motion.div
								animate={{
									height: [`${h * 100}%`, `${h * 0.5 * 100}%`, `${h * 100}%`],
								}}
								className="w-1 rounded-full bg-blue-600 dark:bg-white"
								key={i}
								transition={{
									repeat: Number.POSITIVE_INFINITY,
									duration: 1.5,
									delay: i * 0.2,
								}}
							/>
						))}
					</div>
				</div>
			</div>

			{/* INTERACTIVE GLOW: Follows mouse or static corner */}
			<div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-600/40 opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />
		</div>
	);
}

const Background = () => {
	return (
		<div className="mask-[radial-gradient(ellipse_at_center,white,transparent)] absolute inset-0 z-0 opacity-[0.03]">
			<div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-size-[40px_40px]" />
		</div>
	);
};
