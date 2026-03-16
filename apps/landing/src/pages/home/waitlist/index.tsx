import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import React from "react";
import { CursorTrail } from "@/components/cursor-trail";
import { Scribble } from "../problem/scribble";

export default function WaitlistSection({ className }: { className?: string }) {
	const containerRef = React.useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	});

	const smoothProgress = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const rotate = useTransform(smoothProgress, [0, 0.5], [8, 0]);
	const scale = useTransform(smoothProgress, [0, 0.5], [0.92, 1]);
	const opacity = useTransform(smoothProgress, [0, 0.3], [0.5, 1]);
	const blur = useTransform(smoothProgress, [0, 0.3], [10, 0]);

	return (
		<section
			className={cn("relative overflow-hidden py-32", className)}
			ref={containerRef}
		>
			{/* Add the CursorTrail here - it tracks the whole section */}
			<CursorTrail containerRef={containerRef} />

			<div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
				<div className="grid gap-20 lg:grid-cols-2 lg:items-center">
					{/* LEFT SIDE */}
					<div className="space-y-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
							whileInView={{ opacity: 1, y: 0 }}
						>
							<div className="mb-4 flex items-center gap-3">
								<span className="h-px w-6 bg-blue-600" />
								<Scribble />

								<span className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">
									Early Access
								</span>
							</div>

							<h2 className="font-bold text-5xl text-slate-900 tracking-tight lg:text-6xl dark:text-white">
								The AI Workspace
								<br />
								<span className="text-blue-600">Built for Teams</span>
							</h2>

							<p className="mt-6 max-w-md text-lg text-slate-600 leading-relaxed">
								RovoDesk connects your tools, conversations, and customer
								workflows into a single intelligent workspace.
							</p>
						</motion.div>

						{/* WAITLIST FORM */}
						<motion.form
							className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.2, duration: 0.6 }}
							whileInView={{ opacity: 1, y: 0 }}
						>
							<input
								className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900"
								placeholder="Enter your work email"
								type="email"
							/>

							<button
								className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-sm text-white transition hover:bg-blue-700"
								type="submit"
							>
								Join Waitlist
							</button>
						</motion.form>

						{/* SOCIAL PROOF */}
						<p className="text-slate-500 text-sm">
							Join{" "}
							<span className="font-semibold text-slate-700 dark:text-slate-200">
								1,200+ teams
							</span>{" "}
							already on the waitlist.
						</p>
					</div>

					{/* RIGHT SIDE VISUAL */}
					<div className="perspective-[1200px] w-full">
						<motion.div
							className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
							style={{
								rotateX: rotate,
								scale,
								opacity,
								filter: `blur(${blur}px)`,
								boxShadow:
									"0 50px 100px -20px rgba(0,0,0,0.15), 0 30px 60px -30px rgba(0,0,0,0.2)",
							}}
						>
							<img
								alt="RovoDesk dashboard"
								className="h-full w-full object-cover"
								src="/dashboards/funnels.png"
							/>

							<div className="absolute inset-0 ring-1 ring-white/20 ring-inset" />
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
