import { Link } from "@tanstack/react-router";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { ArrowUpRight } from "lucide-react";
import {
	motion,
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

	function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
		const rect = event.currentTarget.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		const xPct = mouseX / width - 0.5;
		const yPct = mouseY / height - 0.5;
		x.set(xPct * 100);
		y.set(yPct * 100);
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
				className={`group relative flex h-full flex-col gap-4 rounded-xl border border-neutral-200/60 bg-linear-to-b from-neutral-50/60 via-neutral-50/40 to-neutral-50/30 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] backdrop-blur-xs transition-all duration-500 ease-out before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-b before:from-white/10 before:via-white/20 before:to-transparent before:opacity-100 before:transition-opacity before:duration-500 after:absolute after:inset-0 after:z-[-1] after:rounded-xl after:bg-neutral-50/70 hover:border-neutral-300/50 hover:bg-linear-to-b hover:from-neutral-50/60 hover:via-neutral-50/30 hover:to-neutral-50/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:backdrop-blur-[6px] dark:border-neutral-800/60 dark:from-neutral-900/60 dark:via-neutral-900/40 dark:to-neutral-900/30 dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] dark:hover:border-neutral-700/50 dark:hover:from-neutral-800/60 dark:hover:via-neutral-800/30 dark:hover:to-neutral-800/20 dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] dark:after:bg-neutral-900/70 dark:before:from-black/10 dark:before:via-black/20 dark:before:to-transparent ${item.className}
                `}
				tabIndex={0}
				to={item.href || "#"}
			>
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
						className="overflow-hidden rounded-xl border border-neutral-200/50 bg-linear-to-b from-neutral-50/80 to-neutral-50 transition-all duration-300 hover:border-neutral-400/30 hover:shadow-lg hover:shadow-neutral-200/20 md:col-span-1 dark:border-neutral-800/50 dark:from-neutral-900/80 dark:to-neutral-900 dark:hover:border-neutral-600/30 dark:hover:shadow-neutral-900/20"
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
