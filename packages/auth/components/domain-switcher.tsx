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
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { ChevronsUpDown, Loader2, Settings } from "lucide-react";
import { useMemo } from "react";
import { useListDomains, useSession, useSwitchDomain } from "../hooks";
import { AddDomainDialog } from "./add-domain-dialog";

export function DomainSwitcher() {
	const { isMobile } = useSidebar();

	// 1. Fetch Data
	const { session, isLoading: isAuthLoading } = useSession();
	const { domains, isLoading: isOrgsLoading } = useListDomains();

	// 2. Mutation for switching the active organization
	const { switchDomain, isPending, switchingId } = useSwitchDomain({
		onSuccess: () => {
			toast.success(`Organization switched to ${activeDomain?.name}`);
		},
		onError: () => {
			toast.error("Error switching organization");
		},
	});

	// 3. Derive active organization from cached data
	const activeDomain = useMemo(() => {
		return domains?.find(
			(org) => org.id === session?.session?.activeOrganizationId
		);
	}, [domains, session?.session?.activeOrganizationId]);
<<<<<<< HEAD
=======

<<<<<<< HEAD
	console.log("activeDomain", activeDomain);
	console.log("domains", domains);
	console.log("session", session);
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
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
									src={`https://api.dicebear.com/9.x/shapes/svg?seed=${activeDomain?.name}`}
								/>
								<AvatarFallback className="rounded-lg text-xs">
									{activeDomain?.name?.at(0)?.toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{activeDomain?.name ?? "Select Workspace"}
								</span>
								<span className="truncate text-muted-foreground text-xs">
									{activeDomain?.slug}
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

						{domains?.map((domain) => {
							// Check if THIS specific item is the one currently being switched to
							const isSwitchingThis = isPending && switchingId === domain.id;
							const isActive = activeDomain?.id === domain.id;

							return (
								<DropdownMenuItem
									className={`mt-2 cursor-pointer gap-2 p-2 ${isActive ? "bg-sidebar-accent" : "bg-transparent"}`}
									disabled={isPending}
									key={domain.id}
									onSelect={(e) => {
										e.preventDefault();
										if (!isActive) switchDomain(domain.id);
									}}
								>
									<Avatar className="size-6 rounded-sm">
										<AvatarImage
											src={`https://api.dicebear.com/9.x/shapes/svg?seed=${domain.name}`}
										/>
										<AvatarFallback className="text-[10px]">
											{domain.name.at(0)?.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									{isSwitchingThis ? (
										<span className="animate-pulse text-muted-foreground text-xs">
											Switching…
										</span>
									) : (
										<span className="flex-1 truncate">{domain.name}</span>
									)}
									<DropdownMenuShortcut>
										{isSwitchingThis ? (
											<>
												<Loader2 className="ml-auto size-4 animate-spin" />
												<span className="sr-only">Switching...</span>
											</>
										) : // biome-ignore lint/style/noNestedTernary: Need to show different icons based on active state
										isActive ? (
											<a href="/">
												<Settings className="ml-auto size-4" />
												<span className="sr-only">Settings</span>
											</a>
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
