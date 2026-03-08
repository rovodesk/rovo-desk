import { useEffect, useRef, useState } from "react";

export const TypingCodeFeature = ({ text }: { text: string }) => {
	const [displayedText, setDisplayedText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);
	const terminalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (currentIndex < text.length) {
			const timeout = setTimeout(
				() => {
					setDisplayedText((prev) => prev + text[currentIndex]);
					setCurrentIndex((prev) => prev + 1);

					if (terminalRef.current) {
						terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
					}
				},
				Math.random() * 30 + 10
			); // Random typing speed for realistic effect

			return () => clearTimeout(timeout);
		}
	}, [currentIndex, text]);

	// Reset animation when component unmounts and remounts
	useEffect(() => {
		setDisplayedText("");
		setCurrentIndex(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="relative mt-3">
			<div className="mb-2 flex items-center gap-2">
				<div className="text-neutral-500 text-xs dark:text-neutral-400">
					server.ts
				</div>
			</div>
			<div
				className="h-[150px] overflow-y-auto rounded-md bg-neutral-900 p-3 font-mono text-neutral-100 text-xs dark:bg-black"
				ref={terminalRef}
			>
				<pre className="whitespace-pre-wrap">
					{displayedText}
					<span className="animate-pulse">|</span>
				</pre>
			</div>
		</div>
	);
};
