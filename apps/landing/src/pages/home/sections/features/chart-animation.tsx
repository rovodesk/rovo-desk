import { motion } from "motion/react";

export const ChartAnimation = ({ value }: { value: number }) => (
	<div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
		<motion.div
			animate={{ width: `${value}%` }}
			className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
			initial={{ width: 0 }}
			transition={{ duration: 1.5, ease: "easeOut" }}
		/>
	</div>
);
