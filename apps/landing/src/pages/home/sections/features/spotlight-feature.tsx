import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export const SpotlightFeature = ({ items }: { items: string[] }) => (
	<ul className="mt-2 space-y-1.5">
		{items.map((item, index) => (
			<motion.li
				animate={{ opacity: 1, x: 0 }}
				className="flex items-center gap-2"
				initial={{ opacity: 0, x: -10 }}
				key={`spotlight-${item.toLowerCase().replace(/\s+/g, "-")}`}
				transition={{ delay: 0.1 * index }}
			>
				<CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
				<span className="text-neutral-700 text-sm dark:text-neutral-300">
					{item}
				</span>
			</motion.li>
		))}
	</ul>
);
