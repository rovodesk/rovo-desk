import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { PanelLeft, PanelRight } from "lucide-react";
import { useEffect, useState } from "react";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { useDashboardLayout } from ".";

export type HeaderProps = React.HTMLAttributes<HTMLElement> & {
	showSecondarySidebarToggle?: boolean;

	showRightSidebarToggle?: boolean;
	isRightSidebarOpen?: boolean;
	onToggleRightSidebar?: () => void;

	headerLeftContent?: React.ReactNode;
	headerRightContent?: React.ReactNode;
	title?: string;
};

export function Header({
	className,

	showSecondarySidebarToggle = true,

	isRightSidebarOpen,
	onToggleRightSidebar,
	showRightSidebarToggle = true,

	headerLeftContent,
	headerRightContent,

	title = "BreadCrumbs Goes Here",
	...props
}: HeaderProps) {
	const [_offset, setOffset] = useState(0);

	useEffect(() => {
		const onScroll = () => {
			setOffset(document.body.scrollTop || document.documentElement.scrollTop);
		};

		document.addEventListener("scroll", onScroll, { passive: true });
		return () => document.removeEventListener("scroll", onScroll);
	}, []);

	const { secondarySidebarOpen, setSecondarySidebarOpen } =
		useDashboardLayout();

	return (
		<header
			className={cn(
				"flex h-[53px] shrink-0 items-center justify-between border-header border-b bg-header px-4",
				className
			)}
			{...props}
		>
			<div className="flex items-center gap-4 px-2">
				{/* Secondary Sidebar Toggle */}
				{showSecondarySidebarToggle && secondarySidebarOpen && (
					<div className="flex items-center gap-2">
						<Button
							className="h-8 w-8"
							onClick={() => setSecondarySidebarOpen(!secondarySidebarOpen)}
							size="icon"
							variant="ghost"
						>
							<PanelLeft className="h-4 w-4" />
						</Button>
						<Separator orientation="vertical" />
					</div>
				)}

				<DynamicBreadcrumb />
				{headerLeftContent}
			</div>

			<div className="flex items-center gap-1">
				{headerRightContent}
				{showRightSidebarToggle && (
					<div className="flex items-center gap-2">
						<Separator orientation="vertical" />
						<Button
							className="h-8 w-8"
							onClick={onToggleRightSidebar}
							size="icon"
							variant={isRightSidebarOpen ? "secondary" : "ghost"}
						>
							<PanelRight className="h-4 w-4" />
						</Button>
					</div>
				)}
			</div>
		</header>
	);
}
