import { cn } from "@zero-heads-lab/design-system/lib/utils";
import type * as React from "react";

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Width of the border in pixels
	 * @default 1
	 */
	borderWidth?: number;
	/**
	 * Duration of the animation in seconds
	 * @default 14
	 */
	duration?: number;
	/**
	 * Color of the border, can be a single color or an array of colors
	 * @default "#e2e8f0"
	 */
	shineColor?: string | string[];
}

/**
 * Shine Border
 *
 * An animated background border effect component with configurable properties.
 */
export function ShineBorder({
	borderWidth = 1,
	duration = 14,
	shineColor = "#e2e8f0",
	className,
	style,
	...props
}: ShineBorderProps) {
	return (
		<div
			className={cn(
				"pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position] motion-safe:animate-shine",
				className
			)}
			style={
				{
					"--border-width": `${borderWidth}px`,
					"--duration": `${duration}s`,
					backgroundImage: `radial-gradient(transparent,transparent, ${
						Array.isArray(shineColor) ? shineColor.join(",") : shineColor
					},transparent,transparent)`,
					backgroundSize: "300% 300%",
					mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
					WebkitMask:
						"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
					WebkitMaskComposite: "xor",
					maskComposite: "exclude",
					padding: "var(--border-width)",
					...style,
				} as React.CSSProperties
			}
			{...props}
		/>
	);
}
