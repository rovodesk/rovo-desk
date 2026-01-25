import { useOrganization } from "@clerk/tanstack-react-start";
import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@zero-heads-lab/design-system/components/ui/card";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@zero-heads-lab/design-system/components/ui/tooltip";
// import { Overview } from "./components/overview";
// import { RecentSales } from "./components/recent-sales";
import { BellIcon } from "lucide-react";
import { Search } from "@/components/search";
import { Header } from "./layout/header";
import { MainContent } from "./layout/main";

export function Dashboard() {
	const { organization: activeOrg } = useOrganization();

	return (
		<>
			{/* Header */}
			<Header>
				<Search />
				<div className="ms-auto flex items-center space-x-4">
					{/*TODO:Add Notification Dropdown*/}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								onClick={() => console.log("Not Implemented Yet !")}
								size="icon"
								variant="ghost"
							>
								<BellIcon />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">Notification</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<ThemeSwitch />
						</TooltipTrigger>
						<TooltipContent side="bottom">Theme</TooltipContent>
					</Tooltip>
				</div>
			</Header>

			{/* ===== Main ===== */}
			<MainContent fluid>
				<div className="mb-2 flex items-center justify-between space-y-2">
					<h1 className="font-bold text-2xl tracking-tight">
						{`${activeOrg?.name}'s Dashboard`}
					</h1>
					<div className="flex items-center space-x-2">
						<Button>Download</Button>
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-medium text-sm">
								Total Revenue
							</CardTitle>
							<svg
								className="h-4 w-4 text-muted-foreground"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
							</svg>
						</CardHeader>
						<CardContent>
							<div className="font-bold text-2xl">$45,231.89</div>
							<p className="text-muted-foreground text-xs">
								+20.1% from last month
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-medium text-sm">
								Subscriptions
							</CardTitle>
							<svg
								className="h-4 w-4 text-muted-foreground"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
						</CardHeader>
						<CardContent>
							<div className="font-bold text-2xl">+2350</div>
							<p className="text-muted-foreground text-xs">
								+180.1% from last month
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-medium text-sm">Sales</CardTitle>
							<svg
								className="h-4 w-4 text-muted-foreground"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect height="14" rx="2" width="20" x="2" y="5" />
								<path d="M2 10h20" />
							</svg>
						</CardHeader>
						<CardContent>
							<div className="font-bold text-2xl">+12,234</div>
							<p className="text-muted-foreground text-xs">
								+19% from last month
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-medium text-sm">Active Now</CardTitle>
							<svg
								className="h-4 w-4 text-muted-foreground"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
							</svg>
						</CardHeader>
						<CardContent>
							<div className="font-bold text-2xl">+573</div>
							<p className="text-muted-foreground text-xs">
								+201 since last hour
							</p>
						</CardContent>
					</Card>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
					<Card className="col-span-1 lg:col-span-4">
						<CardHeader>
							<CardTitle>Overview</CardTitle>
						</CardHeader>
						<CardContent className="ps-2">
							<Skeleton className="h-96" />
						</CardContent>
					</Card>
					<Card className="col-span-1 lg:col-span-3">
						<CardHeader>
							<CardTitle>Recent Sales</CardTitle>
							<CardDescription>You made 265 sales this month.</CardDescription>
						</CardHeader>
						<CardContent>
							<Skeleton className="h-96" />
						</CardContent>
					</Card>
				</div>
			</MainContent>
		</>
	);
}
