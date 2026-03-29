import { cn } from "@zero-heads-lab/design-system/lib/utils";
import type React from "react";

export const SectionMain = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div className={cn("scrollbar-thin flex-1 overflow-y-auto p-6", className)}>
			{children}
		</div>
	);
};

export default SectionMain;
