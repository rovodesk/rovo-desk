import {
	determineAccessRole,
	hasPlatformAccessRole,
} from "@zero-heads-lab/auth/helpers";
import { useDomainDetails, useSession } from "@zero-heads-lab/auth/hooks";
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
import { BellIcon } from "lucide-react";
import { useMemo } from "react";
import { Search } from "@/components/search";
import { Header } from "@/layout/header";
import { MainContent } from "@/layout/main-content";

export function Dashboard() {
	const { session, isLoading: isSessionLoading } = useSession();

	const activedomainId = useMemo(
		() => session?.session.activeOrganizationId,
		[session]
	);

	const { domain, isLoading: isDomainLoading } = useDomainDetails(
		activedomainId ?? ""
	);

	const isLoading = isSessionLoading || isDomainLoading;

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	return (
		<>
			{/* Header */}
			<Header>
				<Search />
				<div className="ms-auto flex items-center space-x-4">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								onClick={() => console.log("Not Implemented Yet !")}
								size="icon"
								variant="ghost"
							>
								<BellIcon className="size-5" />
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
					<h1 className="inline-flex items-center gap-2 font-bold text-3xl tracking-tight">
						{hasPlatformAccessRole(determineAccessRole(session?.user?.role))
							? "Platform"
							: domain?.name}{" "}
						Dashboard
					</h1>
					<div className="flex items-center space-x-2">
						<button className="relative p-[3px]">
							<div className="absolute inset-0 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500" />
							<div className="group relative rounded-[6px] bg-black px-4 py-2 font-medium text-white transition duration-200 hover:bg-transparent">
								Upgrade Plan ✨
							</div>
						</button>
					</div>
				</div>

				<div className="space-y-4">
					{/* Cards */}
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{/* Placeholder for your actual stat cards */}
						{Array.from({ length: 4 }).map((_, i) => (
							<Card key={i}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-medium text-sm">
										Total Revenue
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">$45,231.89</div>
									<p className="text-muted-foreground text-xs">
										+20.1% from last month
									</p>
								</CardContent>
							</Card>
						))}
					</div>

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
						<Card className="lg:col-span-4">
							<CardHeader>
								<CardTitle>Overview</CardTitle>
							</CardHeader>
							<CardContent className="ps-2">
								{/* Replace with your Chart component */}
								<div className="flex h-[350px] items-center justify-center rounded-md border border-dashed bg-muted/20">
									Chart Area
								</div>
							</CardContent>
						</Card>

						<Card className="lg:col-span-3">
							<CardHeader>
								<CardTitle>Recent Sales</CardTitle>
								<CardDescription>
									You made 265 sales this month.
								</CardDescription>
							</CardHeader>
							<CardContent>
								{/* Replace with your RecentSales list */}
								<div className="flex h-[350px] items-center justify-center rounded-md border border-dashed bg-muted/20">
									Sales List
								</div>
							</CardContent>
						</Card>
					</div>
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
