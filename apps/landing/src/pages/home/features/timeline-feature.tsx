import { motion } from "motion/react";

export const TimelineFeature = ({
	timeline,
}: {
	timeline: Array<{ year: string; event: string }>;
}) => (
	<div className="relative mt-3">
		<div className="absolute top-0 bottom-0 left-[9px] w-[2px] bg-neutral-200 dark:bg-neutral-700" />
		{timeline.map((item) => (
			<motion.div
				animate={{ opacity: 1, x: 0 }}
				className="relative mb-3 flex gap-3"
				initial={{ opacity: 0, x: -10 }}
				key={`timeline-${item.year}-${item.event
					.toLowerCase()
					.replace(/\s+/g, "-")}`}
				transition={{
					delay: (0.15 * Number.parseInt(item.year, 10)) % 10,
				}}
			>
				<div className="z-10 mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-neutral-300 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800" />
				<div>
					<div className="font-medium text-neutral-900 text-sm dark:text-neutral-100">
						{item.year}
					</div>
					<div className="text-neutral-600 text-xs dark:text-neutral-400">
						{item.event}
					</div>
				</div>
			</motion.div>
		))}
	</div>
);
