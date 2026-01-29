import { Link } from "@tanstack/react-router";
import Logo from "@zero-heads-lab/design-system/components/logo";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { AnimatePresence, motion } from "motion/react";

export function AppTitle() {
	const { setOpenMobile, state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					asChild
					className="gap-2 bg-transparent! py-0 hover:bg-transparent active:bg-transparent"
					size="lg"
				>
					<Link onClick={() => setOpenMobile(false)} to="/">
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
							<Logo className="size-4" />
						</div>

						<AnimatePresence mode="popLayout">
							{!isCollapsed && (
								<motion.div
									animate={{ opacity: 1, x: 0 }}
									className="ml-2 flex flex-col gap-0.5 leading-none transition-all duration-500"
									initial={{ opacity: 0, x: -10 }}
									key="sidebar-text"
									transition={{ duration: 0.5, ease: "easeInOut" }}
								>
									<span className="font-medium">Zero Heads</span>
									<span className="text-xs">v1.0.0</span>
								</motion.div>
							)}
						</AnimatePresence>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
