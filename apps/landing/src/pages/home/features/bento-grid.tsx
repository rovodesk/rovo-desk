import { Link } from "@tanstack/react-router";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { ArrowUpRight } from "lucide-react";
import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useTransform,
	type Variants,
} from "motion/react";
import { useState } from "react";
import { AIVoiceInput } from "./ai-voice-input";
import { ChartAnimation } from "./chart-animation";
import { CounterAnimation } from "./counter-animation";
import { type FeatureItem, featureItems } from "./features";
import { MetricsFeature } from "./metrics-feature";
import { NotificationsFeature } from "./notifications-feature";
import { SpotlightFeature } from "./spotlight-feature";
import { TimelineFeature } from "./timeline-feature";
import { TypingCodeFeature } from "./typing-code-feature";

const fadeInUp: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut",
		},
	},
};

const staggerContainer: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
			delayChildren: 0.3,
		},
	},
};

const BentoCard = ({ item }: { item?: FeatureItem }) => {
	const [_isHovered, setIsHovered] = useState(false);
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const rotateX = useTransform(y, [-100, 100], [2, -2]);
	const rotateY = useTransform(x, [-100, 100], [-2, 2]);

	const glowX = useMotionValue(50); // %
	const glowY = useMotionValue(50); // %
	const glow = useMotionTemplate`
	radial-gradient(
		600px circle at ${glowX}% ${glowY}%,
		rgba(255,255,255,0.08),
		transparent 60%
	)
`;

	function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
		const rect = event.currentTarget.getBoundingClientRect();

		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		const xPct = (mouseX / rect.width) * 100;
		const yPct = (mouseY / rect.height) * 100;

		glowX.set(xPct);
		glowY.set(yPct);

		// existing tilt logic
		x.set((xPct / 100 - 0.5) * 100);
		y.set((yPct / 100 - 0.5) * 100);
	}

	function handleMouseLeave() {
		x.set(0);
		y.set(0);
		setIsHovered(false);
	}

	if (!item) return null;

	return (
		<motion.div
			className="h-full"
			onHoverEnd={handleMouseLeave}
			onHoverStart={() => setIsHovered(true)}
			onMouseMove={handleMouseMove}
			style={{
				rotateX,
				rotateY,
				transformStyle: "preserve-3d",
			}}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			variants={fadeInUp}
			whileHover={{ y: -5 }}
		>
			<Link
				aria-label={`${item.title} - ${item.description}`}
				className={cn(
					"group relative flex h-full flex-col gap-4 rounded-xl border p-5 transition-all duration-500 ease-out",

					// 🔥 Base (dark glass)
					"border-white/10 bg-white/3 backdrop-blur-xl",

					// Depth
					"shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]",

					// Hover (subtle lift + light)
					"hover:border-white/20 hover:bg-white/5 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]",

					// Inner glow (very important)
					"before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",

					item.className
				)}
				tabIndex={0}
				to={item.href || "#"}
			>
				<motion.div
					className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					style={{ background: glow }}
				/>
				<div
					className="relative z-10 flex h-full flex-col gap-3"
					style={{ transform: "translateZ(20px)" }}
				>
					<div className="flex flex-1 flex-col space-y-2">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-neutral-900 text-xl tracking-tight transition-colors duration-300 group-hover:text-neutral-700 dark:text-neutral-100 dark:group-hover:text-neutral-300">
								{item.title}
							</h3>
							<div className="text-neutral-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-neutral-500">
								<ArrowUpRight className="h-5 w-5" />
							</div>
						</div>

						<p className="text-neutral-600 text-sm tracking-tight dark:text-neutral-400">
							{item.description}
						</p>

						{/* Feature specific content */}
						{item.feature === "spotlight" && item.spotlightItems && (
							<SpotlightFeature items={item.spotlightItems} />
						)}

						{item.feature === "counter" && item.statistic && (
							<div className="mt-auto pt-3">
								<CounterAnimation
									end={item.statistic.end || 100}
									start={item.statistic.start || 0}
									suffix={item.statistic.suffix}
								/>
							</div>
						)}

						{item.feature === "chart" && item.statistic && (
							<div className="mt-auto pt-3">
								<div className="mb-1 flex items-center justify-between">
									<span className="font-medium text-neutral-700 text-sm dark:text-neutral-300">
										{item.statistic.label}
									</span>
									<span className="font-medium text-neutral-700 text-sm dark:text-neutral-300">
										{item.statistic.end}
										{item.statistic.suffix}
									</span>
								</div>
								<ChartAnimation value={item.statistic.end || 0} />
							</div>
						)}

						{item.feature === "timeline" && item.timeline && (
							<TimelineFeature timeline={item.timeline} />
						)}

						{item.feature === "typing" && item.typingText && (
							<TypingCodeFeature text={item.typingText} />
						)}

						{item.feature === "metrics" && item.metrics && (
							<MetricsFeature metrics={item.metrics} />
						)}

						{item.feature === "notifications" && <NotificationsFeature />}
					</div>
				</div>
			</Link>
		</motion.div>
	);
};

export default function BentoGrid({ className }: { className?: string }) {
	return (
		<div className={cn("w-full", className)}>
			{/* Bento Grid */}
			<motion.div
				className="grid gap-6"
				initial="hidden"
				variants={staggerContainer}
				viewport={{ once: true }}
				whileInView="visible"
			>
				<div className="grid gap-6 md:grid-cols-3">
					<motion.div className="md:col-span-1" variants={fadeInUp}>
						<BentoCard item={featureItems[0]} />
					</motion.div>
					<motion.div className="md:col-span-2" variants={fadeInUp}>
						<BentoCard item={featureItems[1]} />
					</motion.div>
				</div>
				<div className="grid gap-6 md:grid-cols-2">
					<motion.div className="md:col-span-1" variants={fadeInUp}>
						<BentoCard item={featureItems[2]} />
					</motion.div>
					<motion.div
						className="overflow-hidden rounded-xl border border-white/10 bg-linear-to-b from-neutral-50/80 to-neutral-50 transition-all duration-300 hover:border-neutral-400/30 hover:shadow-lg hover:shadow-neutral-200/20 md:col-span-1 dark:border-neutral-800/50 dark:from-neutral-900/80 dark:to-neutral-900 dark:hover:border-neutral-600/30 dark:hover:shadow-neutral-900/20"
						variants={fadeInUp}
					>
						<div className="p-5">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="font-semibold text-neutral-900 text-xl tracking-tight dark:text-neutral-100">
									Voice Assistant
								</h3>
							</div>
							<p className="mb-4 text-neutral-600 text-sm tracking-tight dark:text-neutral-400">
								Interact with our AI using natural voice commands. Experience
								seamless voice-driven interactions with advanced speech
								recognition.
							</p>
							<AIVoiceInput />
						</div>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
