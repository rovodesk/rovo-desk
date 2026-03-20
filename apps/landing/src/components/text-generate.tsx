import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect, useRef } from "react";

export const TextGenerateEffect = ({
	words,
	className,
	filter = true,
	duration = 0.5,
}: {
	words: string;
	className?: string;
	filter?: boolean;
	duration?: number;
}) => {
	const [scope, animate] = useAnimate();
	const containerRef = useRef<HTMLDivElement | null>(null);

	const isInView = useInView(containerRef, {
		margin: "-20% 0px", // 🔥 triggers slightly before fully visible
		once: true, // 🔥 runs only once (important)
	});

	const wordsArray = words.split(" ");
	// biome-ignore lint/correctness/useExhaustiveDependencies: Unnecessary re-renders for animate
	useEffect(() => {
		if (!isInView) return;

		animate(
			"span",
			{
				opacity: 1,
				filter: filter ? "blur(0px)" : "none",
			},
			{
				duration: duration ? duration : 1,
				delay: stagger(0.2),
			}
		);
	}, [isInView]);

	const renderWords = () => {
		return (
			<div className={cn("font-bold", className)} ref={containerRef}>
				<div className="mt-4">
					<div className="text-5xl text-black leading-snug tracking-wide dark:text-white">
						<motion.div ref={scope}>
							{wordsArray.map((word, idx) => (
								<motion.span
									className="text-black opacity-0 dark:text-white"
									key={word + idx}
									style={{
										filter: filter ? "blur(10px)" : "none",
									}}
								>
									{word}{" "}
								</motion.span>
							))}
						</motion.div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className={cn("font-bold", className)}>
			<div className="mt-4">
				<div className="text-5xl text-black leading-snug tracking-wide dark:text-white">
					{renderWords()}
				</div>
			</div>
		</div>
	);
};
