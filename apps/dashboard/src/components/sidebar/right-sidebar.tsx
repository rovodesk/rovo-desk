import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { ChevronDown, X } from "lucide-react";

interface RightSidebarProps {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
}

export function RightSidebar({
	isOpen = false,
	onClose,
	children,
}: RightSidebarProps) {
	return (
		<div
			className={cn(
				"flex h-screen shrink-0 flex-col overflow-hidden border-border border-l bg-crm-right transition-all duration-200",
				isOpen ? "w-80" : "w-0"
			)}
		>
			{isOpen && (
				<>
					{/* Header */}
					<div className="flex items-center justify-between border-border border-b px-4 py-3">
						<div className="flex items-center gap-2 font-medium text-crm-right-foreground text-sm">
							<span>Contact Details</span>
							<ChevronDown className="h-3.5 w-3.5" />
						</div>
						<Button
							className="h-7 w-7"
							onClick={onClose}
							size="icon"
							variant="ghost"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					{/* Content */}
					<div className="scrollbar-thin flex-1 overflow-y-auto">
						{children}
					</div>
				</>
			)}
		</div>
	);
}
