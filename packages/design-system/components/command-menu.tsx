import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { useTheme } from "../context/theme";
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from "lucide-react";
import React from "react";
<<<<<<< HEAD:packages/design-system/components/command-menu.tsx
import { useSearch } from "../context/search";
import type { NavCollapsible, SidebarConfig } from "../types/sidebar";

type CommandMenuProps = {
    sidebarData: SidebarConfig,
};

export function CommandMenu({sidebarData }: CommandMenuProps) {
=======
import { SIDEBAR_CONFIG } from "@/data/sidebar-data";
import { useSidebarData } from "@/hooks/use-sidebar-data";
import { useSearch } from "@/providers/search";
import type { NavCollapsible } from "@/types/sidebar";

export function CommandMenu() {
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored):apps/dashboard/src/components/command-menu.tsx
	const { setTheme } = useTheme();
	const navigate = useNavigate();
	const { open, setOpen } = useSearch();

<<<<<<< HEAD:packages/design-system/components/command-menu.tsx
=======
	const { sidebarData } = useSidebarData(SIDEBAR_CONFIG);
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored):apps/dashboard/src/components/command-menu.tsx

	const runCommand = React.useCallback(
		(command: () => unknown) => {
			setOpen(false);
			command();
		},
		[setOpen]
	);

	return (
		<CommandDialog modal onOpenChange={setOpen} open={open}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<ScrollArea className="h-72 pe-1" type="hover">
					<CommandEmpty>No results found.</CommandEmpty>

					{sidebarData.navGroups.map((group) => (
						<CommandGroup heading={group.title} key={group.title}>
							{group.items.map((navItem) => {
								// We only support collapsible sections in this sidebar
								if (!("items" in navItem && navItem.items)) return null;

								const section = navItem as NavCollapsible;

								return section?.items?.map((subItem) => (
									<CommandItem
										key={`${section.title}-${subItem.title}`}
										onSelect={() =>
											runCommand(() => window.location.href = subItem.url)
										}
										value={`${section.title} ${subItem.title}`}
									>
										<div className="mr-2 flex size-4 items-center justify-center">
											{section.icon ? (
												<section.icon className="size-3 text-muted-foreground" />
											) : (
												<ArrowRight className="size-2" />
											)}
										</div>

										<div className="flex items-center gap-1">
											<span className="text-muted-foreground">
												{section.title}
											</span>
											<ChevronRight className="size-3 text-muted-foreground/50" />
											<span>{subItem.title}</span>
										</div>
									</CommandItem>
								));
							})}
						</CommandGroup>
					))}

					<CommandSeparator />

					<CommandGroup heading="Theme">
						<CommandItem
							onSelect={() => runCommand(() => setTheme("light"))}
							value="theme light"
						>
							<Sun className="mr-2 size-4" /> <span>Light Mode</span>
						</CommandItem>

						<CommandItem
							onSelect={() => runCommand(() => setTheme("dark"))}
							value="theme dark"
						>
							<Moon className="mr-2 size-4" /> <span>Dark Mode</span>
						</CommandItem>

						<CommandItem
							onSelect={() => runCommand(() => setTheme("system"))}
							value="theme system"
						>
							<Laptop className="mr-2 size-4" /> <span>System Default</span>
						</CommandItem>
					</CommandGroup>
				</ScrollArea>
			</CommandList>
		</CommandDialog>
	);
}

function CommandMenuSkeleton({ open }: { open: boolean }) {
	return (
		<CommandDialog modal open={open}>
			{/* Input */}
			<CommandInput
				className="opacity-50"
				disabled
				placeholder="Type a command or search..."
			/>

			<CommandList>
				<ScrollArea className="h-72 pe-1" type="hover">
					{/* Nav groups */}
					{Array.from({ length: 3 }).map((_, groupIndex) => (
						<CommandGroup heading="" key={groupIndex}>
							<Skeleton className="mb-2 h-3 w-24" /> {/* Group title */}
							{Array.from({ length: 4 }).map((_, itemIndex) => (
								<div
									className="flex items-center gap-3 px-2 py-2"
									key={itemIndex}
								>
									<Skeleton className="size-4 rounded-sm" />
									<div className="flex flex-1 items-center gap-2">
										<Skeleton className="h-3 w-20" />
										<Skeleton className="h-3 w-3" />
										<Skeleton className="h-3 w-28" />
									</div>
								</div>
							))}
						</CommandGroup>
					))}

					<CommandSeparator />

					{/* Theme section */}
					<CommandGroup heading="">
						<Skeleton className="mb-2 h-3 w-16" />

						{Array.from({ length: 3 }).map((_, index) => (
							<div className="flex items-center gap-3 px-2 py-2" key={index}>
								<Skeleton className="size-4 rounded-sm" />
								<Skeleton className="h-3 w-32" />
							</div>
						))}
					</CommandGroup>
				</ScrollArea>
			</CommandList>
		</CommandDialog>
	);
}
