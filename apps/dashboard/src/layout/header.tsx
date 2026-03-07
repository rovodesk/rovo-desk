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
	onToggleRightSidebar?: () => void;

	rightSidebarToggleIcon?: React.ReactElement;
	headerLeftContent?: React.ReactNode;
	headerRightContent?: React.ReactNode;
};

export function Header({
	className,

	showSecondarySidebarToggle = true,

	showRightSidebarToggle = true,
	rightSidebarToggleIcon = <PanelRight className="h-4 w-4" />,

	headerLeftContent,
	headerRightContent,

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

	const {
		secondarySidebarOpen,
		setSecondarySidebarOpen,
		rightSidebarOpen,
		setRightSidebarOpen,
	} = useDashboardLayout();

	return (
		<header
			className={cn(
				"flex h-16 shrink-0 items-center justify-between bg-header px-4",
				className
			)}
			{...props}
		>
			<div className="flex items-center gap-4 px-2">
				{/* Secondary Sidebar Toggle */}
				{showSecondarySidebarToggle ||
					(secondarySidebarOpen && (
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
					))}

				<DynamicBreadcrumb />
				{headerLeftContent && (
					<div className="flex items-center gap-4">{headerLeftContent}</div>
				)}
			</div>

			<div className="flex items-center gap-1">
				{headerRightContent && (
					<div className="flex items-center gap-4">{headerRightContent}</div>
				)}
				{showRightSidebarToggle && (
					<div className="ml-2 flex items-center gap-4">
						<Separator orientation="vertical" />
						<Button
							className="h-8 w-8"
							onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
							size="icon"
							variant={rightSidebarOpen ? "secondary" : "ghost"}
						>
							{rightSidebarToggleIcon}
						</Button>
					</div>
				)}
			</div>
		</header>
	);
}
