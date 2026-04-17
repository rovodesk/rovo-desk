import {
	IconBoltFilled,
	IconBrandDiscordFilled,
	IconFilterFilled,
	IconLayoutDashboardFilled,
	IconMessagesFilled,
	IconStack2Filled,
} from "@tabler/icons-react";
import {
	useLocation,
	useMatchRoute,
	useNavigate,
} from "@tanstack/react-router";
import Logo from "@zero-heads-lab/design-system/components/logo";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@zero-heads-lab/design-system/components/ui/tooltip";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { ChartNoAxesGantt, ListTodo, Megaphone } from "lucide-react";
import { motion, type Variants } from "motion/react";
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
		icon: IconLayoutDashboardFilled,
		label: "Dashboard",
		path: "/",
	},
	{
		id: "inbox",
		icon: IconMessagesFilled,
		label: "Inbox",
		badge: 6,
		path: "/inbox",
	},
	{
		id: "funnels",
		icon: IconFilterFilled,
		label: "Filter",
		path: "/funnels",
	},
	{
		id: "help-center",
		icon: IconStack2Filled,
		label: "Help Center",
		path: "/help-center",
	},
	{
		id: "tasks",
		icon: ListTodo,
		label: "Tasks",
		path: "/tasks",
	},
	{
		id: "automation",
		icon: IconBoltFilled,
		label: "Automation",
		path: "/automation",
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
		id: "community",
		icon: IconBrandDiscordFilled,
		label: "Community",
		path: "/community",
	},
	{
		id: "docs",
		icon: ChartNoAxesGantt,
		label: "Docs",
		path: "#",
	},
];

const sidebarVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0.1,
		},
	},
};

const navItemVariants: Variants = {
	hidden: { opacity: 0, y: 15 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 24,
		},
	},
};

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

	const matchRoute = useMatchRoute();

	const isActive = (path: string) =>
		path !== "#" &&
		!!matchRoute({
			to: path,
			fuzzy: true,
		});

	return (
		<motion.div
			animate="visible"
			className="flex h-screen w-18 shrink-0 flex-col items-center border-r py-3"
			initial="hidden"
			onMouseEnter={handleMouseEnter}
			variants={sidebarVariants}
		>
			{/* Logo - Animates as the first child */}
			<motion.div
				className="m-2 flex items-center justify-center text-center"
				variants={navItemVariants}
			>
				<Logo className="h-12 w-12" />
			</motion.div>

			<nav className="flex flex-1 flex-col items-center gap-2 p-2">
				{primaryNavItems.map((item) => (
					<NavButton
						isActive={isActive(item.path)}
						item={item}
						key={item.id}
						onClick={() => handleClick(item)}
					/>
				))}
			</nav>

			{/* Bottom section also staggers */}
			<div className="flex flex-col items-center gap-2">
				{bottomNavItems.map((item) => (
					<NavButton
						isActive={activeItem === item.id}
						item={item}
						key={item.id}
						onClick={() => handleClick(item)}
					/>
				))}
				<motion.div variants={navItemVariants}>
					<UserProfileDropdown />
				</motion.div>
			</div>
		</motion.div>
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
				<motion.button
					className="relative flex h-10 w-10 items-center justify-center rounded-lg outline-none"
					onClick={onClick}
					variants={navItemVariants}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					{/* Sliding background pill */}
					{isActive && (
						<motion.div
							className="absolute inset-0 rounded-lg bg-blue-600/80"
							layoutId="sidebar-active-pill"
							transition={{
								type: "spring",
								stiffness: 360,
								damping: 25,
							}}
						/>
					)}

					<Icon
						className={cn(
							"relative z-10 h-5 w-5 transition-colors duration-200",
							isActive ? "text-white" : "text-muted-foreground"
						)}
					/>

					{item.badge && (
						<motion.span
							animate={{ scale: 1 }}
							className="absolute -top-0.5 -right-0.5 z-20 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-medium text-[10px] text-white"
							initial={{ scale: 0 }}
						>
							{item.badge}
						</motion.span>
					)}
				</motion.button>
			</TooltipTrigger>
			<TooltipContent side="right" sideOffset={8}>
				{item.label}
			</TooltipContent>
		</Tooltip>
	);
}
