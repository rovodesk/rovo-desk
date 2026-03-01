import { useLocation, useNavigate } from "@tanstack/react-router";
import { useUser } from "@zero-heads-lab/auth/hooks";
import Logo from "@zero-heads-lab/design-system/components/logo";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@zero-heads-lab/design-system/components/ui/tooltip";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import {
	BarChart3,
	Bell,
	Book,
	Funnel,
	HelpCircle,
	Inbox,
	LayoutDashboard,
	Settings,
	Target,
	Zap,
} from "lucide-react";
import { useDashboardLayout } from "@/layout";

export type PrimaryNavItem = {
	id: string;
	icon: React.ElementType;
	label: string;
	badge?: number;
	path: string;
};

const primaryNavItems: PrimaryNavItem[] = [
	{
		id: "dashboard",
		icon: LayoutDashboard,
		label: "Dashboard",
		path: "/",
	},
	{
		id: "inbox",
		icon: Inbox,
		label: "Inbox",
		badge: 6,
		path: "/inbox",
	},
	{
		id: "funnels",
		icon: Funnel,
		label: "Funnels",
		path: "/funnels",
	},
	{
		id: "knowledge-base",
		icon: Book,
		label: "Knowledge Base",
		path: "/knowledge-base",
	},
	{
		id: "automation",
		icon: Zap,
		label: "Automation",
		path: "/automation",
	},
	{
		id: "reports",
		icon: BarChart3,
		label: "Reports",
		path: "/reports",
	},
	{
		id: "outreach",
		icon: Target,
		label: "Outreach",
		path: "/outreach",
	},
];

const bottomNavItems: PrimaryNavItem[] = [
	{
		id: "notifications",
		icon: Bell,
		label: "Notifications",
		badge: 3,
		path: "#",
	},
	{
		id: "settings",
		icon: Settings,
		label: "Settings",
		path: "/settings",
	},
	{
		id: "help",
		icon: HelpCircle,
		label: "Help",
		path: "#",
	},
];

export function PrimarySidebar() {
	const navigate = useNavigate();
	const location = useLocation();

	// Get Active Item
	const getActiveId = () => {
		const allItems = [...primaryNavItems, ...bottomNavItems];
		const match = allItems.find(
			(item) => item.path !== "#" && location.pathname.startsWith(item.path)
		);
		return match?.id || "inbox";
	};

	const activeItem = getActiveId();

	const handleClick = (item: PrimaryNavItem) => {
		if (item.path !== "#") navigate({ to: item.path });
	};

	const { user } = useUser();

	const name = user?.name || "";
	const image = user?.image || "";
	const abbreviation = name
		?.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const { setSecondarySidebarOpen } = useDashboardLayout();

	const handleMouseEnter = () => {
		setSecondarySidebarOpen(true);
	};

	return (
		// biome-ignore lint/a11y/noNoninteractiveElementInteractions: Need this
		// biome-ignore lint/a11y/noStaticElementInteractions: Need this
		<div
			className="flex h-screen w-16 shrink-0 flex-col items-center border-r py-3"
			onMouseEnter={handleMouseEnter}
		>
			<div className="mb-2 flex items-center justify-center rounded-full p-2 text-center">
				<Logo className="mb-3 h-10 w-8" />
			</div>

			<nav className="flex flex-1 flex-col items-center gap-2">
				{primaryNavItems.map((item) => (
					<NavButton
						isActive={activeItem === item.id}
						item={item}
						key={item.id}
						onClick={() => handleClick(item)}
					/>
				))}
			</nav>

			<div className="flex flex-col items-center gap-2">
				{bottomNavItems.map((item) => (
					<NavButton
						isActive={activeItem === item.id}
						item={item}
						key={item.id}
						onClick={() => handleClick(item)}
					/>
				))}
				<div className="relative mt-2">
					<span className="absolute -top-0.5 -right-0.5 z-10 h-2.5 w-2.5 rounded-full bg-green-500" />
					<Avatar className="relative h-10 w-10 rounded-lg border dark:border-gray-700">
						<AvatarImage alt={name} src={image} />
						<AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
							{abbreviation}
						</AvatarFallback>
					</Avatar>
				</div>
			</div>
		</div>
	);
}

function NavButton({
	item,
	isActive,
	onClick,
}: {
	item: PrimaryNavItem;
	isActive: boolean;
	onClick: () => void;
}) {
	const Icon = item.icon;
	return (
		<Tooltip delayDuration={0}>
			<TooltipTrigger asChild>
				<button
					className={cn(
						"relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-150 dark:border dark:border-gray-700",
						isActive
							? "bg-primary text-primary-foreground"
							: "hover:border hover:bg-muted"
					)}
					onClick={onClick}
				>
					<Icon className="h-5 w-5" />
					{item.badge && (
						<span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-medium text-[10px] text-white">
							{item.badge}
						</span>
					)}
				</button>
			</TooltipTrigger>
			<TooltipContent side="right" sideOffset={8}>
				{item.label}
			</TooltipContent>
		</Tooltip>
	);
}
