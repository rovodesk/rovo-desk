import { useEffect, useState } from "react";

export const TypewriterText = ({
	text,
	className,
	delay = 20,
}: {
	text: string;
	className?: string;
	delay?: number;
}) => {
	const [displayedText, setDisplayedText] = useState("");

	useEffect(() => {
		let i = 0;
		const interval = setInterval(() => {
			setDisplayedText(text.slice(0, i + 1));
			i++;
			if (i >= text.length) clearInterval(interval);
		}, delay);
		return () => clearInterval(interval);
	}, [text, delay]);

	return <span className={className}>{displayedText}</span>;
};
