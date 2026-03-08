import { Clock, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";

export const MetricsFeature = ({
	metrics,
}: {
	metrics: Array<{
		label: string;
		value: number;
		suffix?: string;
		color?: string;
	}>;
}) => {
	const getColorClass = (color = "emerald") => {
		const colors = {
			emerald: "bg-emerald-500 dark:bg-emerald-400",
			blue: "bg-blue-500 dark:bg-blue-400",
			violet: "bg-violet-500 dark:bg-violet-400",
			amber: "bg-amber-500 dark:bg-amber-400",
			rose: "bg-rose-500 dark:bg-rose-400",
		};
		return colors[color as keyof typeof colors] || colors.emerald;
	};

	return (
		<div className="mt-3 space-y-3">
			{metrics.map((metric, index) => (
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="space-y-1"
					initial={{ opacity: 0, y: 10 }}
					key={`metric-${metric.label.toLowerCase().replace(/\s+/g, "-")}`}
					transition={{ delay: 0.15 * index }}
				>
					<div className="flex items-center justify-between text-sm">
						<div className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
							{metric.label === "Uptime" && <Clock className="h-3.5 w-3.5" />}
							{metric.label === "Response time" && (
								<Zap className="h-3.5 w-3.5" />
							)}
							{metric.label === "Cost reduction" && (
								<Sparkles className="h-3.5 w-3.5" />
							)}
							{metric.label}
						</div>
						<div className="font-semibold text-neutral-700 dark:text-neutral-300">
							{metric.value}
							{metric.suffix}
						</div>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
						<motion.div
							animate={{
								width: `${Math.min(100, metric.value)}%`,
							}}
							className={`h-full rounded-full ${getColorClass(metric.color)}`}
							initial={{ width: 0 }}
							transition={{
								duration: 1.2,
								ease: "easeOut",
								delay: 0.15 * index,
							}}
						/>
					</div>
				</motion.div>
			))}
		</div>
	);
};
