import { useEffect, useState } from "react";

export const CounterAnimation = ({
	start,
	end,
	suffix = "",
}: {
	start: number;
	end: number;
	suffix?: string;
}) => {
	const [count, setCount] = useState(start);

	useEffect(() => {
		const duration = 2000;
		const frameRate = 1000 / 60;
		const totalFrames = Math.round(duration / frameRate);

		let currentFrame = 0;
		const counter = setInterval(() => {
			currentFrame++;
			const progress = currentFrame / totalFrames;
			const easedProgress = 1 - (1 - progress) ** 3;
			const current = start + (end - start) * easedProgress;

			setCount(Math.min(current, end));

			if (currentFrame === totalFrames) {
				clearInterval(counter);
			}
		}, frameRate);

		return () => clearInterval(counter);
	}, [start, end]);

	return (
		<div className="flex items-baseline gap-1">
			<span className="font-bold text-3xl text-neutral-900 dark:text-neutral-100">
				{count.toFixed(1).replace(/\.0$/, "")}
			</span>
			<span className="font-medium text-neutral-900 text-xl dark:text-neutral-100">
				{suffix}
			</span>
		</div>
	);
};
