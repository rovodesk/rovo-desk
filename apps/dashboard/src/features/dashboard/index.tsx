import { IconBell } from "@tabler/icons-react";
import { determineAccessRole } from "@zero-heads-lab/auth/helpers";
import { useOrganization, useSession } from "@zero-heads-lab/auth/hooks";
import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
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
import { Search } from "@/components/search";
import { Header } from "@/layout/header";
import { MainContent } from "@/layout/main-content";
import { Overview } from "./_components/overview";
import { RecentSales } from "./_components/recent-sales";

const findPlan = (plan: string) => {
	switch (plan) {
		case "basic":
			return "basic";
		case "pro":
			return "pro";
		case "startup":
			return "startup";
		case "enterprise":
			return "enterprise";
		default:
			return "basic";
	}
};

export function Dashboard() {
	const { session, loading: isSessionLoading } = useSession();
	const { organization, loading: isOrganizationLoading } = useOrganization();

	const name = organization?.name ?? "Unknown";
	const plan = findPlan(organization?.metadata?.plan ?? "basic");
	const role = determineAccessRole(session?.user?.role);

	const isLoading = isSessionLoading || isOrganizationLoading;
	if (isLoading) {
		return <DashboardSkeleton />;
	}

	return (
		<>
			{/* Header */}
			<Header>
				<Search />
				<div className="ms-auto flex items-center space-x-4">
					{/*TODO:Add Notification*/}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								onClick={() => console.log("Not Implemented Yet !")}
								size="icon"
								variant="ghost"
							>
								<IconBell />
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
				<div className="mb-8 flex items-center justify-between space-y-2 px-2">
					<div className="flex items-center gap-4">
						<h1 className="inline-flex items-center gap-2 font-bold text-3xl tracking-tight">
							{name} Dashboard
						</h1>
						<Badge variant="outline">{role}</Badge>
					</div>
					<div className="flex items-center space-x-2">
						{plan === "basic" ||
							(plan !== "enterprise" && (
								<button className="relative p-[3px]">
									<div className="absolute inset-0 rounded-lg bg-linear-to-r from-[#0c2218] to-[#72e3ad]" />
									<div className="group relative rounded-[6px] bg-black px-4 py-2 font-medium text-white transition duration-200 hover:bg-transparent">
										Upgrade Plan ✨
									</div>
								</button>
							))}
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
							<Overview />
						</CardContent>
					</Card>
					<Card className="col-span-1 lg:col-span-3">
						<CardHeader>
							<CardTitle>Recent Sales</CardTitle>
							<CardDescription>You made 265 sales this month.</CardDescription>
						</CardHeader>
						<CardContent>
							<RecentSales />
						</CardContent>
					</Card>
				</div>
			</MainContent>
		</>
	);
}

function DashboardSkeleton() {
	return (
		<>
			<Header>
				{/* Search Skeleton */}
				<Skeleton className="h-9 w-64 rounded-md" />
				<div className="ms-auto flex items-center space-x-4">
					{/* Icons Skeleton */}
					<Skeleton className="size-9 rounded-full" />
					<Skeleton className="size-9 rounded-full" />
				</div>
			</Header>

			<MainContent fluid>
				{/* Top Bar Skeleton */}
				<div className="mb-8 flex items-center justify-between px-2">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-10 w-32" />
				</div>

				<div className="space-y-4">
					{/* 4 Stats Cards Skeleton */}
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<Card key={i}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<Skeleton className="h-4 w-[100px]" />
									<Skeleton className="size-4 rounded-full" />
								</CardHeader>
								<CardContent>
									<Skeleton className="mb-2 h-8 w-[60px]" />
									<Skeleton className="h-3 w-[120px]" />
								</CardContent>
							</Card>
						))}
					</div>

					{/* Main Grid Skeleton */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
						{/* Overview Chart Skeleton */}
						<Card className="lg:col-span-4">
							<CardHeader>
								<Skeleton className="h-6 w-[140px]" />
							</CardHeader>
							<CardContent className="ps-2">
								<Skeleton className="h-[350px] w-full rounded-xl" />
							</CardContent>
						</Card>

						{/* Recent Sales Skeleton */}
						<Card className="lg:col-span-3">
							<CardHeader>
								<Skeleton className="mb-2 h-6 w-[140px]" />
								<Skeleton className="h-4 w-[200px]" />
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{Array.from({ length: 5 }).map((_, i) => (
										<div className="flex items-center gap-4" key={i}>
											<Skeleton className="size-10 rounded-full" />
											<div className="space-y-2">
												<Skeleton className="h-4 w-[150px]" />
												<Skeleton className="h-3 w-[100px]" />
											</div>
											<Skeleton className="ml-auto h-4 w-[50px]" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</MainContent>
		</>
	);
}
