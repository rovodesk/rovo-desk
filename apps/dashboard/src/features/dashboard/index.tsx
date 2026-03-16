import { IconPackageExport } from "@tabler/icons-react";
import { determineAuthRole } from "@zero-heads-lab/auth/helpers";
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
import { ScrollArea } from "@zero-heads-lab/design-system/components/ui/scroll-area";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { Columns3Cog } from "lucide-react";
import { Search } from "@/components/search";
import { MainContent } from "@/layout/main-content";
import { Analytics } from "./_components/analytics";
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
	const role = determineAuthRole(session?.user?.role);

	const isLoading = isSessionLoading || isOrganizationLoading;
	if (isLoading) {
		return <DashboardSkeleton />;
	}

	return (
		<MainContent
			headerLeftContent={<Search />}
			headerRightContent={
				<div className="flex items-center gap-4">
					{plan !== "enterprise" && (
						<Button variant="outline">
							<span className="mr-2">👑</span>
							Upgrade Plan
						</Button>
					)}
					<Separator orientation="vertical" />
					<ThemeSwitch />
				</div>
			}
			rightSidebarContent={
				<div className="flex items-center gap-2 font-medium text-crm-right-foreground text-sm">
					<span>Customise Dashboard</span>
				</div>
			}
			rightSidebarHeaderContent={
				<div className="flex items-center gap-2 font-medium text-crm-right-foreground text-sm">
					<span>Customise Dashboard</span>
				</div>
			}
			rightSidebarToggleIcon={<Columns3Cog className="h-4 w-4" />}
		>
			<ScrollArea className="mx-auto flex w-full max-w-[1600px] flex-col space-y-6 px-6 py-6">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="flex items-center gap-3">
							<h1 className="font-semibold text-xl tracking-tight">
								{name}'s Dashboard
							</h1>

							<Badge variant="outline">{role}</Badge>
						</div>

						<p className="text-muted-foreground text-sm">
							Overview of activity and performance for {name}
						</p>
					</div>
					<Button variant="secondary">
						<IconPackageExport className="mr-2 h-4 w-4" />
						Export
					</Button>
				</div>
				{/* Tab Content */}
				<div className="mt-8 space-y-4">
					<Analytics />
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
								<CardTitle className="font-medium text-sm">
									Active Now
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
								<CardDescription>
									You made 265 sales this month.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<RecentSales />
							</CardContent>
						</Card>
					</div>
				</div>
			</ScrollArea>
		</MainContent>
	);
}

function DashboardSkeleton() {
	return (
		<MainContent
			headerLeftContent={<Skeleton className="h-9 w-64 rounded-md" />}
			headerRightContent={
				<div className="ms-auto flex items-center space-x-4">
					<Skeleton className="size-9 rounded-full" />
					<Skeleton className="size-9 rounded-full" />
				</div>
			}
			rightSidebarToggleIcon={<Columns3Cog className="h-4 w-4" />}
		>
			<ScrollArea className="mx-auto flex w-full max-w-[1600px] flex-col space-y-6 px-6 py-6">
				{/* Title & Action Section */}
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="flex items-center gap-3">
							<Skeleton className="h-8 w-64" />{" "}
							{/* Name's Dashboard equivalent */}
							<Skeleton className="h-6 w-16 rounded-md" />{" "}
							{/* Role Badge equivalent */}
						</div>
						<Skeleton className="h-4 w-80" /> {/* Description */}
					</div>
					<Skeleton className="h-9 w-24 rounded-md" /> {/* Export Button */}
				</div>

				<div className="mt-8 space-y-4">
					{/* Top Stats Row (Matching Dashboard's 4-card grid) */}
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<Card key={i}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="size-4 rounded-full" />
								</CardHeader>
								<CardContent>
									<Skeleton className="mb-2 h-8 w-16" />
									<Skeleton className="h-3 w-32" />
								</CardContent>
							</Card>
						))}
					</div>

					{/* Main Content Grid (Matching Dashboard's 7-column split) */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
						{/* Conversation List (Matches Overview Chart column span) */}
						<Card className="col-span-1 lg:col-span-4">
							<CardHeader className="space-y-2">
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-4 w-48" />
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{Array.from({ length: 5 }).map((_, i) => (
										<div
											className="flex flex-col gap-2 border-b pb-4 last:border-0"
											key={i}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Skeleton className="size-8 rounded-full" />
													<Skeleton className="h-4 w-32" />
												</div>
												<Skeleton className="h-3 w-10" />
											</div>
											<div className="space-y-2 pl-10">
												<Skeleton className="h-3 w-full" />
												<Skeleton className="h-3 w-2/3" />
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Recent Activity/Details (Matches Recent Sales column span) */}
						<Card className="col-span-1 lg:col-span-3">
							<CardHeader>
								<Skeleton className="mb-2 h-6 w-32" />
								<Skeleton className="h-4 w-48" />
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{Array.from({ length: 6 }).map((_, i) => (
										<div className="flex items-center gap-4" key={i}>
											<Skeleton className="size-10 rounded-full" />
											<div className="space-y-2">
												<Skeleton className="h-4 w-32" />
												<Skeleton className="h-3 w-24" />
											</div>
											<Skeleton className="ml-auto h-4 w-10" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</ScrollArea>
		</MainContent>
	);
}
