import { cn } from "@zero-heads-lab/design-system/lib/utils";
<<<<<<< HEAD
import { ChatSequence } from "@/components/chat-sequence";
import { Icons } from "@/components/icons";
import { OrbitingCircles } from "@/components/orbiting-circles";
import { TextGenerateEffect } from "@/components/text-generate";
import type { ProblemBlock } from "@/lib/componen-registry/types";
import { Highlighter } from "./highlighter";

type Props = {
	className?: string;
	data: ProblemBlock;
};

export default function ProblemSection({ className, data }: Props) {
	return (
		<section
			className={cn(
				"relative min-h-svh overflow-hidden border-t bg-black",
				"px-4 py-20 sm:px-6 sm:py-28",
				className
			)}
		>
			{/* Background gradient - Fixed bg-linear to bg-gradient */}
			<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black via-black/80 to-transparent" />
			{/* Container */}
			<div className="relative z-10 mx-auto max-w-7xl">
				{/* Header Section */}
				<div className="mb-16">
					<TextGenerateEffect words="Everything you need to scale faster. Explore the features that make RovoDesk the perfect choice for your business." />
					<div className="mt-8">
						<p className="leading-relaxed">
							The{" "}
							<Highlighter action="underline" highlightColor="#FF9800">
								Magic UI Highlighter
							</Highlighter>{" "}
							makes important{" "}
							<Highlighter
								action="highlight"
								highlightColor="#00FFFF"
								textColor="#000000"
							>
								text stand out
							</Highlighter>{" "}
							effortlessly.
						</p>
					</div>
				</div>

				<div className="grid items-center gap-16 lg:grid-cols-2">
					{/* LEFT: Visual (Orbiting Circles) */}
					<div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
						<OrbitingCircles iconSize={40} radius={80}>
							<Icons.whatsapp />
							<Icons.notion />
							<Icons.openai />
							<Icons.googleDrive />
						</OrbitingCircles>

						{/* Outer Circle */}
						<OrbitingCircles iconSize={30} radius={160} reverse speed={2}>
							<Icons.whatsapp />
							<Icons.notion />
							<Icons.openai />
							<Icons.googleDrive />
						</OrbitingCircles>
					</div>

					{/* RIGHT: Product (Chat) */}
					<div className="relative">
						{/* Glow */}
						<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.08),transparent_70%)]" />

						{/* Chat Container */}
						<div className={cn("relative overflow-hidden")}>
							<ChatSequence />
						</div>

						{/* Bottom fade */}
						<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black to-transparent" />
=======
import {motion, useScroll, useSpring, useTransform} from "motion/react";
						import React from "react";

						export default function ProblemSection({className}: {className ?: string}) {
	const containerRef = React.useRef<HTMLDivElement>(null);

							const {scrollYProgress} = useScroll({
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
>>>>>>> 8b8c11c (feat: Add animated components and cursor trail for enhanced UI experience)
										</div>
									</div>
								</div>
							</section>
	);
<<<<<<< HEAD
}
=======
}
>>>>>>> 8b8c11c (feat: Add animated components and cursor trail for enhanced UI experience)
