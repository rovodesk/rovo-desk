import { useNavigate } from "@tanstack/react-router";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@zero-heads-lab/design-system/components/ui/tooltip";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { ChevronDown, ChevronRight, Pin, Search } from "lucide-react";
import { useState } from "react";
import { useDashboardLayout } from "@/layout";

export interface SecondaryNavSection {
	title?: string;
	collapsible?: boolean;
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
		<div
			className={cn(
				"flex h-screen w-60 shrink-0 flex-col border-r bg-background transition-all duration-300 ease-in-out",
				secondarySidebarOpen ? "w-60" : "w-0"
			)}
			onMouseLeave={handleMouseLeave}
		>
			{/* Header */}
			{header && (
				<div
					className={cn(
						"flex items-center justify-between border-b px-2 py-4 transition-all duration-300 ease-in-out",
						secondarySidebarOpen ? "opacity-100" : "opacity-0"
					)}
				>
					{header}
				</div>
			)}

			{/* Search */}
			{searchable && (
				<div
					className={cn(
						"px-3 py-2",
						secondarySidebarOpen ? "opacity-100" : "opacity-0"
					)}
				>
					<div className="relative">
						<Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="h-8 border-border bg-background pl-8 text-xs"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search..."
							value={search}
						/>
					</div>
				</div>
			)}
			{/* Component */}
			{component}

			{/* Navigation */}
			<div
				className={cn(
					"scrollbar-thin flex-1 overflow-y-auto px-2 py-1 transition-all duration-300 ease-in-out",
					secondarySidebarOpen ? "opacity-100" : "opacity-0"
				)}
			>
				{sections?.map((section) => {
					const isCollapsed = collapsedSections.has(section?.title || "");
					const filteredItems = section.items.filter((item) =>
						item.label.toLowerCase().includes(search.toLowerCase())
					);

					if (filteredItems.length === 0 && search) return null;

					return (
						<div className="mb-2" key={section.title}>
							{section.title && (
								<button
									className={cn(
										"flex w-full items-center gap-1.5 px-2 py-1.5 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider",
										section.collapsible &&
											"cursor-pointer hover:text-secondary-foreground"
									)}
									onClick={() =>
										section.collapsible && toggleSection(section.title || "")
									}
								>
									{section.collapsible &&
										(isCollapsed ? (
											<ChevronRight className="h-3 w-3" />
										) : (
											<ChevronDown className="h-3 w-3" />
										))}
									{section.title}
								</button>
							)}

							{!isCollapsed && (
								<div className="space-y-0.5">
									{filteredItems.map((item) => {
										return (
											<SecondaryNavButton
												activeItem={activeItemId}
												item={item}
												key={item.id}
												onItemClick={handleClick}
											/>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function SecondarySidebarTitleHeader({ title }: { title: string }) {
	const { pinnedSecondarySidebar, setPinnedSecondarySidebar } =
		useDashboardLayout();
	return (
		<>
			<h2 className="font-semibold text-sm">{title}</h2>
			<Tooltip>
				<TooltipTrigger>
					<Button
						className={cn(
							"ml-auto h-8 w-8 transition-all duration-100 hover:scale-110",
							pinnedSecondarySidebar && "bg-accent text-destructive"
						)}
						onClick={() => setPinnedSecondarySidebar(!pinnedSecondarySidebar)}
						size="icon"
						variant="ghost"
					>
						<Pin className="h-4 w-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					{pinnedSecondarySidebar ? "Unpin" : "Pin"}
				</TooltipContent>
			</Tooltip>
		</>
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
				"flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
				activeItem === item.id
					? "bg-accent font-medium text-accent-foreground"
					: "text-secondary-foreground hover:bg-muted"
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
