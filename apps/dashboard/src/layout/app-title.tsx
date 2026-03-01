import Logo from "@zero-heads-lab/design-system/components/logo";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { motion } from "motion/react";
import { version } from "../../package.json";

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
						<Logo className="size-4" />
						<motion.div
							animate={{
								opacity: isCollapsed ? 0 : 1,
								width: isCollapsed ? 0 : "auto",
							}}
							className="ml-2 flex flex-col gap-0.5 overflow-hidden whitespace-nowrap leading-none"
							transition={{ duration: 0.2, ease: "easeOut" }}
						>
							<span className="font-medium">Zero Heads</span>
							<span className="text-xs">v{version}</span>
						</motion.div>
					</a>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
