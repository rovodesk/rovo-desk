import { Link } from "@tanstack/react-router";

export function SkipToMain() {
	return (
		<Link
			className={
				"fixed start-44 z-999 -translate-y-52 whitespace-nowrap bg-primary px-4 py-2 font-medium text-primary-foreground text-sm opacity-95 shadow-sm transition hover:bg-primary/90 focus:translate-y-3 focus:transform focus-visible:ring-1 focus-visible:ring-ring"
			}
			to="/"
		>
			Skip to Main
		</Link>
	);
}
