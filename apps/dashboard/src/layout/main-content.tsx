import { Loader } from "@zero-heads-lab/design-system/components/loader";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { setCookie } from "@zero-heads-lab/shared/utils";
import { AnimatePresence, motion } from "motion/react";
import { RightSidebar } from "@/layout/sidebar/right-sidebar";
import {
	type SecondaryNavSection,
	SecondarySidebar,
	type SecondarySidebarProps,
} from "@/layout/sidebar/secondary-sidebar";
import { useDashboardLayout } from ".";
import { Header, type HeaderProps } from "./header";

type MainContentProps = {
	className?: string;
	children: React.ReactNode;
	animate?: boolean;
	showHeader?: boolean;

	secondaryHeader?: React.ReactNode;
	secondarySections?: SecondaryNavSection[];

	secondarySearchable?: boolean;

	rightSidebarContent?: React.ReactNode;
	rightSidebarHeaderContent?: React.ReactNode;
} & HeaderProps &
	SecondarySidebarProps;

export function MainContent({
	className,
	children,
	animate = false,

	showHeader = true,

	secondaryHeader,
	secondarySections,
	secondarySearchable,

	rightSidebarContent,
	rightSidebarHeaderContent,
	rightSidebarToggleIcon,

	headerLeftContent,
	headerRightContent,
}: MainContentProps) {
	const { secondarySidebarOpen, hydrated } = useDashboardLayout();

	if (!hydrated) return <Loader title="Loading Dashboard" />;

	if (!animate)
		return (
			<>
				{/* Secondary Sidebar (only if provided) */}
				{secondarySections && (
					<SecondarySidebar
						header={secondaryHeader}
						onItemClick={() =>
							setCookie(
								"secondary-sidebar-state",
								secondarySidebarOpen ? "closed" : "open"
							)
						}
						searchable={secondarySearchable}
						sections={secondarySections}
					/>
				)}

				<div className="flex min-w-0 flex-1 flex-col">
					{showHeader && (
						<Header
							headerLeftContent={headerLeftContent}
							headerRightContent={headerRightContent}
							rightSidebarToggleIcon={rightSidebarToggleIcon}
							showRightSidebarToggle={!!rightSidebarContent}
						/>
					)}

					<main
						className={cn(
							"flex h-svh grow flex-col space-y-6 overflow-hidden",
							className
						)}
					>
						{children}
					</main>
				</div>

				{!!rightSidebarContent && (
					<RightSidebar headerContent={rightSidebarHeaderContent}>
						{rightSidebarContent}
					</RightSidebar>
				)}
			</>
		);

	return (
		<AnimatePresence mode="wait">
			<motion.main
				animate={{ y: 0, opacity: 1 }}
				className={cn("flex-1 overflow-hidden", className)}
				exit={{ y: 32, opacity: 0 }}
				initial={{ y: 32, opacity: 0 }}
				key={location.pathname}
				transition={{
					duration: 0.45,
					ease: "easeOut",
					delay: 0.6, // wait for sidebar animation
				}}
			>
				{children}
			</motion.main>
		</AnimatePresence>
	);
}
