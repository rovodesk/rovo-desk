import { motion } from "motion/react";

export function Scribble({ color = "#155efc" }: { color?: string }) {
	return (
		<svg height="90" viewBox="0 0 100 100" width="90">
			<motion.circle
				animate={{ scale: [1, 1.4, 1] }}
				cx="50"
				cy="50"
				fill={color}
				r="3"
				transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
			/>

			<motion.path
				animate={{ rotate: 360 }}
				d="M50 20 L50 30 M80 50 L70 50 M50 80 L50 70 M20 50 L30 50"
				stroke={color}
				strokeWidth="2"
				transition={{
					repeat: Number.POSITIVE_INFINITY,
					duration: 10,
					ease: "linear",
				}}
			/>
		</svg>
	);
}
