import { IconPlusFilled } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { ChevronRight, Search } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";
import { useDashboardLayout } from "@/layout";

export interface SecondaryNavSection {
	title?: string;
	collapsible?: boolean;
	actionable?: boolean;
	actionIcon?: React.ElementType;
	action?: () => void;
	items: SecondaryNavItemType[];
}

export interface SecondaryNavItemType {
	id: string;
	label: string;
	count?: number;
	dotColor?: string;
	icon?: React.ElementType;
	path?: string;
}

export interface SecondarySidebarProps {
	header?: React.ReactNode;
	sections?: SecondaryNavSection[];
	component?: React.ReactNode;
	activeItem?: string;
	onItemClick?: (id: string) => void;
	searchable?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

const sidebarContentVariants: Variants = {
	closed: {
		opacity: 0,
		x: -20,
		transition: { duration: 0.2 },
	},
	open: {
		opacity: 1,
		x: 0,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 30,
			staggerChildren: 0.05, // Items will pop in one after another
			delayChildren: 0.1, // Wait slightly for sidebar width to expand
		},
	},
};

const itemVariants = {
	closed: { opacity: 0, x: -10 },
	open: { opacity: 1, x: 0 },
};

export function SecondarySidebar({
	header,
	sections,
	component,
	activeItem,
	onItemClick,
	searchable = false,
}: SecondarySidebarProps) {
	const [search, setSearch] = useState("");
	const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
		new Set()
	);

	const toggleSection = (sectionTitle: string) => {
		setCollapsedSections((prev) => {
			const next = new Set(prev);
			if (next.has(sectionTitle)) next.delete(sectionTitle);
			else next.add(sectionTitle);
			return next;
		});
	};

	const {
		secondarySidebarOpen,
		setSecondarySidebarOpen,
		pinnedSecondarySidebar,
	} = useDashboardLayout();

	// Get Active Item
	const getActiveId = () => {
		const allItems = sections?.flatMap((section) => section.items);
		const match = allItems?.find(
			(item) => item.path && location.pathname.startsWith(item.path)
		);
		return match?.id || "dashboard";
	};

	let activeItemId = activeItem ?? getActiveId();

	const navigate = useNavigate();
	const handleClick = (item: SecondaryNavItemType) => {
		if (item.path !== "#") navigate({ to: item.path });
		onItemClick?.(item.id);
		activeItemId = item.id;
	};

	const handleMouseLeave = () => {
		if (!pinnedSecondarySidebar) setSecondarySidebarOpen(false);
	};

	return (
		<motion.div
			animate={{
				width: secondarySidebarOpen ? 276 : 0,
				borderRightWidth: secondarySidebarOpen ? 1 : 0,
			}}
			className="flex h-screen shrink-0 flex-col overflow-hidden border-r bg-background"
			initial={false}
			onMouseLeave={handleMouseLeave}
			transition={{ type: "spring", stiffness: 300, damping: 32 }}
		>
			<AnimatePresence mode="wait">
				{secondarySidebarOpen && (
					<motion.div
						animate="open"
						className="flex h-full w-[276px] flex-col"
						exit="closed"
						initial="closed"
						key="sidebar-content"
						variants={sidebarContentVariants}
					>
						{/* Header */}
						{header && (
							<motion.div
								className="flex items-center justify-between p-2"
								variants={itemVariants}
							>
								{header}
							</motion.div>
						)}

						{/* Search */}
						{searchable && (
							<motion.div className="p-4" variants={itemVariants}>
								<div className="relative">
									<Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
									<Input
										className="h-8 border-border bg-background pl-8 text-xs focus-visible:ring-1"
										onChange={(e) => setSearch(e.target.value)}
										placeholder="Search..."
										value={search}
									/>
								</div>
							</motion.div>
						)}

						{/* Custom Component Area */}
						{component && (
							<motion.div variants={itemVariants}>{component}</motion.div>
						)}

						{/* Navigation Sections */}
						<div className="scrollbar-thin flex-1 overflow-y-auto p-2">
							{sections?.map((section) => {
								const isCollapsed = collapsedSections.has(section.title || "");
								const filteredItems = section.items.filter((i) =>
									i.label.toLowerCase().includes(search.toLowerCase())
								);

								if (filteredItems.length === 0 && search) return null;

								return (
									<motion.div
										className="mb-4"
										key={section.title}
										variants={itemVariants}
									>
										{section.title && (
											<div className="mb-1 flex w-full items-center justify-between">
												<button
													className={cn(
														"flex flex-1 items-center justify-between pl-2 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider transition-colors",
														section.collapsible &&
															"cursor-pointer hover:text-secondary-foreground"
													)}
													onClick={() =>
														section.collapsible &&
														toggleSection(section.title || "")
													}
												>
													{section.title}
													{section.collapsible && (
														<motion.div
															animate={{ rotate: isCollapsed ? 0 : 90 }}
															transition={{ duration: 0.2 }}
														>
															<ChevronRight
																className={cn(
																	"h-5 w-4 p-0.5",
																	isCollapsed
																		? "text-foreground/80"
																		: "text-foreground/60"
																)}
															/>
														</motion.div>
													)}
												</button>

												{section.actionable && (
													<Button
														className="h-6 w-6"
														onClick={(e) => {
															e.stopPropagation();
															section.action?.();
														}}
														size="icon"
														variant="ghost"
													>
														{section.actionIcon ? (
															<section.actionIcon className="h-3 w-3" />
														) : (
															<IconPlusFilled className="h-3 w-3" />
														)}
													</Button>
												)}
											</div>
										)}

										<AnimatePresence initial={false}>
											{!isCollapsed && (
												<motion.div
													animate={{ height: "auto", opacity: 1 }}
													className="space-y-0.5 overflow-hidden"
													exit={{ height: 0, opacity: 0 }}
													initial={{ height: 0, opacity: 0 }}
													transition={{
														type: "spring",
														stiffness: 300,
														damping: 30,
													}}
												>
													{filteredItems.map((item) => (
														<SecondaryNavButton
															activeItem={activeItemId}
															item={item}
															key={item.id}
															onItemClick={handleClick}
														/>
													))}
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								);
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

export function SecondarySidebarTitleHeader({
	title,
	action,
	actionIcon,
}: {
	title: string;
	action?: () => void;
	actionIcon?: React.ElementType;
}) {
	const Icon = actionIcon;
	return (
		<div className="flex w-full items-center justify-between py-2">
			<div className="flex items-center gap-2 px-2">
				<h1 className="font-bold text-xl">{title}</h1>
			</div>

			<Button
				className="rounded-lg"
				onClick={() => action?.()}
				size="icon"
				variant="ghost"
			>
				{Icon ? <Icon className="stroke-muted-foreground" size={24} /> : null}
			</Button>
		</div>
	);
}

function SecondaryNavButton({
	item,
	activeItem,
	onItemClick,
}: {
	item: SecondaryNavItemType;
	activeItem: string;
	onItemClick: (item: SecondaryNavItemType) => void;
}) {
	const Icon = item.icon;
	return (
		<button
			className={cn(
				"flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors",
				activeItem === item.id
					? "bg-card font-medium text-blue-600"
					: "text-foreground/80 hover:bg-muted hover:text-foreground"
			)}
			key={item.id}
			onClick={() => onItemClick?.(item)}
		>
			{item.dotColor && (
				<span
					className="h-2 w-2 shrink-0 rounded-full"
					style={{ backgroundColor: item.dotColor }}
				/>
			)}
			{Icon && <Icon className="h-4 w-4 shrink-0" />}
			<span className="flex-1 truncate text-left">{item.label}</span>
			{item.count !== undefined && (
				<span className="ml-auto text-muted-foreground text-xs">
					{item.count}
				</span>
			)}
		</button>
	);
}
