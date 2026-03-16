import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import React from "react";

export default function ProblemSection({ className }: { className?: string }) {
	const containerRef = React.useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"], // Starts animating as soon as it enters viewport
	});

	// Smooth out the scroll progress for a "premium" weighted feel
	const smoothProgress = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	// Minimalist Enterprise Transforms
	const rotate = useTransform(smoothProgress, [0, 0.5], [8, 0]); // Reduced tilt
	const scale = useTransform(smoothProgress, [0, 0.5], [0.92, 1]); // Subtle growth
	const opacity = useTransform(smoothProgress, [0, 0.3], [0.5, 1]);
	const blur = useTransform(smoothProgress, [0, 0.3], [10, 0]); // Focus effect

	return (
		<section
			className={cn("relative overflow-hidden py-24", className)}
			ref={containerRef}
		>
			<div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
				<div className="flex flex-col items-center gap-16">
					{/* Text Content */}
					<div className="flex-1 space-y-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
							whileInView={{ opacity: 1, y: 0 }}
						>
							<div className="mb-4 flex items-center gap-3">
								<span className="h-[1px] w-6 bg-blue-600" />
								<span className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">
									RovoDesk AI
								</span>
							</div>
							<h2 className="font-bold text-5xl text-slate-900 tracking-tight lg:text-7xl dark:text-white">
								Connected <br />
								<span className="text-blue-600">Across Tools</span>
							</h2>
							<p className="mt-6 max-w-md text-lg text-slate-600 leading-relaxed">
								Streamline your workflow by unifying data from every platform
								into a single, intelligent interface.
							</p>
						</motion.div>
					</div>

					{/* Visual Stage */}
					<div className="perspective-1000 w-full flex-1">
						<motion.div
							className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
							style={{
								rotateX: rotate,
								scale,
								opacity,
								filter: `blur(${blur}px)`, // Dynamic focus
								boxShadow:
									"0 50px 100px -20px rgba(0,0,0,0.15), 0 30px 60px -30px rgba(0,0,0,0.2)",
							}}
						>
							<img
								alt="Dashboard"
								className="h-full w-full object-cover"
								src="/dashboards/chat.png"
							/>
							{/* Subtle Glass Overlay for depth */}
							<div className="absolute inset-0 ring-1 ring-white/20 ring-inset" />
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
