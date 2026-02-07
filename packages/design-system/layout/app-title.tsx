import Logo from "../components/logo";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "../components/ui/sidebar";
import { motion } from "motion/react";

export function AppTitle() {
	const { setOpenMobile, state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					asChild
					className="bg-transparent!"
					onClick={() => setOpenMobile(false)}
					size="lg"
				>
					<a className="flex items-center gap-2 overflow-hidden" href="/">
						<div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
							<Logo className="size-4" />
						</div>

						<motion.div
							animate={{
								opacity: isCollapsed ? 0 : 1,
								width: isCollapsed ? 0 : "auto",
							}}
							className="ml-2 flex flex-col gap-0.5 overflow-hidden whitespace-nowrap leading-none"
							transition={{ duration: 0.2, ease: "easeOut" }}
						>
							<span className="font-medium">Zero Heads</span>
							<span className="text-xs">v1.0.0</span>
						</motion.div>
					</a>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
