import { useEffect, useState } from "react";

export function ReadingProgressBar() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const updateProgress = () => {
			const scrollTop = window.scrollY;
			const docHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
		};

		window.addEventListener("scroll", updateProgress, { passive: true });
		return () => window.removeEventListener("scroll", updateProgress);
	}, []);

	return (
		<div className="fixed top-0 right-0 left-0 z-50 h-0.5 bg-transparent">
			<div
				className="h-full bg-accent transition-[width] duration-150 ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
