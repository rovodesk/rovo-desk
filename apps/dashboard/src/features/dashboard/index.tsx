import { useQuery } from "@tanstack/react-query";
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
import { MainContent } from "@/components/main-content";
import { Search } from "@/components/search";
import { authQueries } from "@/lib/queries/auth";
import { Header } from "./layout/header";

export function Dashboard() {
	const { data: session, isLoading } = useQuery(authQueries.session());

	const activeOrgId = useMemo(
		() => session?.session.activeOrganizationId,
		[session]
	);

	const { data: orgDetails } = useQuery({
		...authQueries.activeOrg(activeOrgId ?? ""),
		enabled: !!activeOrgId,
	});

	if (isLoading) {
		return <Skeleton className="h-8 w-40" />;
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
				<div className="mb-2 flex items-center justify-between space-y-2 px-2">
					<h1 className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight">
						{orgDetails?.name ? (
							orgDetails.name
						) : (
							<Skeleton className="h-8 w-40" />
						)}{" "}
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

				{/* Cards */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{/* same cards as before */}
				</div>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
					<Card className="lg:col-span-4">
						<CardHeader>
							<CardTitle>Overview</CardTitle>
						</CardHeader>
						<CardContent className="ps-2">
							<Skeleton className="h-96" />
						</CardContent>
					</Card>

					<Card className="lg:col-span-3">
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
