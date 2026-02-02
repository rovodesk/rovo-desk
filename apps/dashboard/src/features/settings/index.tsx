import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import {
	Tabs,
	TabsList,
	TabsTrigger,
} from "@zero-heads-lab/design-system/components/ui/tabs";
import { Bell, CreditCard, Palette, ShieldCheck, UserCog } from "lucide-react";
<<<<<<< HEAD
=======
import { Search } from "@/components/search";
import { Header } from "@/layout/header";
import { MainContent } from "@/layout/main-content";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

const tabItems = [
	{
		title: "Profile",
		href: "/settings",
		icon: <UserCog size={18} />,
	},
	{
		title: "Appearance",
		href: "/settings/appearance",
		icon: <Palette size={18} />,
	},
	{
		title: "Security",
		href: "/settings/security",
		icon: <ShieldCheck size={18} />,
	},
	{
		title: "Billing",
		href: "/settings/billing",
		icon: <CreditCard size={18} />,
	},
	{
		title: "Notifications",
		href: "/settings/notifications",
		icon: <Bell size={18} />,
	},
];

export function Settings() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	const activeTab =
		tabItems.find((item) => item.href === pathname)?.title ?? "Profile";

	return (
		<>
			{/* ===== Top Heading ===== */}
			<Header>
				<Search />
				<div className="ms-auto flex items-center space-x-4">
					<ThemeSwitch />
				</div>
			</Header>

			<MainContent>
				<div className="space-y-0.5">
					<h1 className="font-bold text-2xl tracking-tight md:text-3xl">
						Settings
					</h1>
					<p className="text-muted-foreground">
						Manage your account settings and set e-mail preferences.
					</p>
				</div>

				<Tabs className="flex h-full flex-col gap-6" defaultValue={activeTab}>
					<TabsList className="h-12 gap-2">
						{tabItems.map((item) => (
							<TabsTrigger
								asChild
								className={
									activeTab === item.title ? "text-accent-foreground!" : ""
								}
								key={item.title}
								value={item.title}
							>
								<Link to={item.href}>
									{item.icon}
									{item.title}
								</Link>
							</TabsTrigger>
						))}
					</TabsList>

					{/* Routed content */}
					<div className="flex w-full flex-1 overflow-y-hidden p-1">
						<Outlet />
					</div>
				</Tabs>
			</MainContent>
		</>
	);
}
