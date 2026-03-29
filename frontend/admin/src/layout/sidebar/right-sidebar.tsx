import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { X } from "lucide-react";
import { useDashboardLayout } from "..";

export interface RightSidebarProps {
	children?: React.ReactNode;
	headerContent?: React.ReactNode;
}

export function RightSidebar({ children, headerContent }: RightSidebarProps) {
	const { rightSidebarOpen, setRightSidebarOpen } = useDashboardLayout();

	return (
		<div
			className={cn(
				"flex h-screen shrink-0 flex-col overflow-hidden border-border border-l bg-card transition-[max-width] duration-300 ease-in-out",
				rightSidebarOpen ? "max-w-[600px]" : "max-w-0"
			)}
		>
			{rightSidebarOpen && (
				<div className="flex w-fit min-w-[320px] flex-col">
					{/* Header */}
					<div className="flex items-center justify-between border-border border-b px-4 py-3">
						<div className="flex items-center gap-2 font-semibold text-sm">
							{headerContent}
						</div>

						<Button
							className="h-7 w-7"
							onClick={() => setRightSidebarOpen(false)}
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
				</div>
			)}
		</div>
	);
}
