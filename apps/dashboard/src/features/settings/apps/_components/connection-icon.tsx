import type { IconProps } from "@tabler/icons-react";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { CONNECTION_MAP } from "./connection-map";

interface ConnectionIconProps extends IconProps {
	iconKey?: string;
	fallbackText?: string;
	className?: string;
}

export const ConnectionIcon = ({
	iconKey,
	fallbackText,
	className,
	...props
}: ConnectionIconProps) => {
	// Look up the component in your map
	const IconComponent = iconKey ? CONNECTION_MAP[iconKey] : null;

	return (
		<div
			className={cn(
				"flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background",
				className
			)}
		>
			{IconComponent ? (
				<IconComponent.icon className="h-5 w-5" {...props} />
			) : (
				<span className="font-bold text-[10px] text-muted-foreground uppercase">
					{fallbackText?.slice(0, 2) || "??"}
				</span>
			)}
		</div>
	);
};
