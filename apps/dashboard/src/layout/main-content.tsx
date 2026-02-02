<<<<<<<< HEAD:packages/design-system/layout/main-content.tsx
import { cn } from "../lib/utils";
========
import { cn } from "@zero-heads-lab/design-system/lib/utils";
>>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored):apps/dashboard/src/layout/main-content.tsx
import type { HTMLMotionProps } from "motion/react";
import { AnimatePresence, motion } from "motion/react";

type MainContentProps = {
	fixed?: boolean;
	fluid?: boolean;
	ref?: React.Ref<HTMLElement>;
	className?: string;
	children?: React.ReactNode;
	animate?: boolean;
};

export function MainContent({
	children,
	className,
	fixed,
	fluid,
	animate,
	...props
}: MainContentProps) {
	if (!animate)
		return (
			<main
				className={cn(
					"space-y-8 px-4 py-6",

					// If layout is fixed, make the main container flex and grow
					fixed && "flex grow flex-col overflow-hidden",

					// If layout is not fluid, set the max-width
					!fluid &&
						"@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl",
					className
				)}
				data-layout={fixed ? "fixed" : "auto"}
				{...props}
			>
				{children}
			</main>
		);

	// Otherwise animate
	return (
		<AnimatePresence mode="wait">
			<motion.main
				animate={{ y: 0, opacity: 1 }}
				className={cn(
					"space-y-8 px-4 py-6",

					// If layout is fixed, make the main container flex and grow
					fixed && "flex grow flex-col overflow-hidden",

					// If layout is not fluid, set the max-width
					!fluid &&
						"@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl",
					className
				)}
				exit={{ y: 32, opacity: 0 }}
				initial={{ y: 32, opacity: 0 }}
				key={location.pathname}
				transition={{
					duration: 0.45,
					ease: "easeOut",
					delay: 0.6, // wait for sidebar animation
				}}
				{...(props as HTMLMotionProps<"main">)}
			>
				{children}
			</motion.main>
		</AnimatePresence>
	);
}
