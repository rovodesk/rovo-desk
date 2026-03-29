import { useLocation, useNavigate } from "@tanstack/react-router";
import { DiscordIcon } from "@zero-heads-lab/design-system/assets/icons/discord-icon";
import Logo from "@zero-heads-lab/design-system/components/logo";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@zero-heads-lab/design-system/components/ui/tooltip";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import {
	Inbox,
	Layers2,
	LayoutDashboard,
	Megaphone,
	TableOfContents,
	Users2,
} from "lucide-react";
import { useDashboardLayout } from "@/layout";
import { UserProfileDropdown } from "../user-profile-dropdown";

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
		id: "users",
		icon: Users2,
		label: "Users",
		path: "/user-management",
	},
	{
		id: "cms",
		icon: Layers2,
		label: "CMS",
		path: "/cms",
	},
];

const bottomNavItems: PrimaryNavItem[] = [
	{
		id: "announcements",
		icon: Megaphone,
		label: "Announcements",
		path: "/announcements",
	},
	{
		id: "discord",
		icon: DiscordIcon,
		label: "Discord",
		path: "/discord",
	},
	{
		id: "docs",
		icon: TableOfContents,
		label: "Docs",
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
		return match?.id || "dashboard";
	};

	const activeItem = getActiveId();

	const handleClick = (item: PrimaryNavItem) => {
		if (item.path !== "#") navigate({ to: item.path });
	};

	const { setSecondarySidebarOpen } = useDashboardLayout();

	const handleMouseEnter = () => {
		setSecondarySidebarOpen(true);
	};

	return (
		<div
			className="flex h-screen w-16 shrink-0 flex-col items-center border-r py-3"
			onMouseEnter={handleMouseEnter}
		>
			<div className="mb-2 flex items-center justify-center rounded-full p-2 text-center">
				<Logo className="mb-3 h-10 w-10" />
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
				<UserProfileDropdown />
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
						"relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-150",
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
