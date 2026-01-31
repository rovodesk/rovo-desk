import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { authClient } from "@zero-heads-lab/auth/client";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@zero-heads-lab/design-system/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { ChevronsUpDown, Loader2, Settings } from "lucide-react";
import { useMemo } from "react";
import { authQueries } from "@/lib/queries/auth.queries";
import { AddDomainDialog } from "./add-domain-dialog";

export function DomainSwitcher() {
	const { isMobile } = useSidebar();
	const queryClient = useQueryClient();

	// 1. Fetch Data using our central Query Options
	const { data: session, isLoading: isAuthLoading } = useQuery(
		authQueries.session()
	);
	const { data: listOrganizations = [], isLoading: isOrgsLoading } = useQuery(
		authQueries.orgList()
	);

	// 2. Mutation for switching the active organization
	const {
		mutate: switchOrg,
		isPending,
		variables: switchingId,
	} = useMutation({
		mutationFn: async (organizationId: string) => {
			await authClient.organization.setActive({ organizationId });
			await authClient.organization.setActiveTeam({ teamId: null });
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
			await queryClient.invalidateQueries({
				queryKey: ["auth", "organization"],
			});
			await queryClient.invalidateQueries({ queryKey: ["auth", "teams"] });
		},
		onError: (error) => {
			console.error("Failed to switch organization:", error);
		},
	});

	// 3. Derive active organization from cached data
	const activeOrganization = useMemo(() => {
		return listOrganizations?.find(
			(org) => org.id === session?.session?.activeOrganizationId
		);
	}, [listOrganizations, session?.session?.activeOrganizationId]);

	const isLoaded = !(isAuthLoading || isOrgsLoading);

	if (!isLoaded) return <DomainSwitcherSkeleton />;

	return (
		<SidebarMenu className="group-data-[collapsible=icon]:hidden">
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							className="bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							disabled={isPending}
							size="lg"
						>
							<Avatar className="size-8 rounded-lg">
								<AvatarImage
									src={`https://api.dicebear.com/9.x/shapes/svg?seed=${activeOrganization?.name}`}
								/>
								<AvatarFallback className="rounded-lg text-xs">
									{activeOrganization?.name?.at(0)?.toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{activeOrganization?.name ?? "Select Workspace"}
								</span>
								<span className="truncate text-muted-foreground text-xs">
									{activeOrganization?.slug}
								</span>
							</div>

							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align={isMobile ? "start" : "end"}
						alignOffset={isMobile ? -16 : 100}
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
						side={isMobile ? "bottom" : "right"}
						sideOffset={16}
					>
						<div className="flex h-12 items-center justify-between border-sidebar-accent border-b px-2">
							<DropdownMenuLabel className="text-muted-foreground text-xs">
								My Workspaces
								<AddDomainDialog />
							</DropdownMenuLabel>
						</div>

						{listOrganizations?.map((org) => {
							// Check if THIS specific item is the one currently being switched to
							const isSwitchingThis = isPending && switchingId === org.id;
							const isActive = activeOrganization?.id === org.id;

							return (
								<DropdownMenuItem
									className={`mt-2 cursor-pointer gap-2 p-2 ${isActive ? "bg-sidebar-accent" : "bg-transparent"}`}
									disabled={isPending}
									key={org.id}
									onSelect={(e) => {
										e.preventDefault();
										if (!isActive) switchOrg(org.id);
									}}
								>
									<Avatar className="size-6 rounded-sm">
										<AvatarImage
											src={`https://api.dicebear.com/9.x/shapes/svg?seed=${org.name}`}
										/>
										<AvatarFallback className="text-[10px]">
											{org.name.at(0)?.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									{isSwitchingThis ? (
										<span className="animate-pulse text-muted-foreground text-xs">
											Switching…
										</span>
									) : (
										<span className="flex-1 truncate">{org.name}</span>
									)}
									<DropdownMenuShortcut>
										{isSwitchingThis ? (
											<>
												<Loader2 className="ml-auto size-4 animate-spin" />
												<span className="sr-only">Switching...</span>
											</>
										) : // biome-ignore lint/style/noNestedTernary: Need to show different icons based on active state
										isActive ? (
											<Link to="/">
												<Settings className="ml-auto size-4" />
												<span className="sr-only">Settings</span>
											</Link>
										) : null}
									</DropdownMenuShortcut>
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

function DomainSwitcherSkeleton() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					className="bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					size="lg"
				>
					{/* Avatar skeleton */}
					<Skeleton className="size-8 rounded-lg" />

					{/* Text skeleton */}
					<div className="flex flex-1 flex-col gap-1">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-3 w-20" />
					</div>

					{/* Chevron skeleton */}
					<Skeleton className="ml-auto size-4 rounded-sm" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
		</DropdownMenu>
	);
}
