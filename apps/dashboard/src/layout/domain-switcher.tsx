import { AddDomainDialog } from "@zero-heads-lab/auth/components/add-domain-dialog";
import { useOrganization } from "@zero-heads-lab/auth/hooks";
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
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { useIsMobile } from "@zero-heads-lab/design-system/hooks/use-mobile";
import { ChevronsUpDown, Loader2, Settings } from "lucide-react";
import { useMemo } from "react";

type DomainSwitcherProps = {
	workspaceSettingsRouteLink?: string;
};

export function DomainSwitcher({
	workspaceSettingsRouteLink,
}: DomainSwitcherProps) {
	const isMobile = useIsMobile();

	const {
		allOrganizations,
		activeOrganizationId,
		switchOrganization,
		loading,
	} = useOrganization();

	const activeDomain = useMemo(
		() => allOrganizations.find((org) => org.id === activeOrganizationId),
		[allOrganizations, activeOrganizationId]
	);

	if (loading) return <DomainSwitcherSkeleton />;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild disabled={loading}>
				<button
					className="flex h-full w-full items-center justify-between gap-2"
					disabled={loading}
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

					<ChevronsUpDown className="ml-4 size-4 text-muted-foreground" />
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align={isMobile ? "start" : "end"}
				alignOffset={isMobile ? -16 : 0}
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
				side={isMobile ? "bottom" : "right"}
				sideOffset={isMobile ? 0 : 16}
			>
				<div className="flex h-12 items-center justify-between border-sidebar-accent border-b px-2">
					<DropdownMenuLabel className="text-muted-foreground text-xs">
						My Workspaces
						<AddDomainDialog />
					</DropdownMenuLabel>
				</div>

				{allOrganizations?.map((domain) => {
					// Check if THIS specific item is the one currently being switched to
					const isSwitchingThis = loading && activeOrganizationId === domain.id;
					const isActive = activeOrganizationId === domain.id;

					return (
						<DropdownMenuItem
							className={`mt-2 cursor-pointer gap-2 p-2 ${isActive ? "bg-sidebar-accent" : "bg-transparent"}`}
							disabled={loading}
							key={domain.id}
							onSelect={(e) => {
								e.preventDefault();
								if (!isActive) switchOrganization(domain.id);
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
									<a href={workspaceSettingsRouteLink ?? "/"}>
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
	);
}

function DomainSwitcherSkeleton() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
					{/* Avatar skeleton */}
					<Skeleton className="size-8 rounded-lg" />

					{/* Text skeleton */}
					<div className="flex flex-1 flex-col gap-1">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-3 w-20" />
					</div>

					{/* Chevron skeleton */}
					<Skeleton className="ml-auto size-4 rounded-sm" />
				</button>
			</DropdownMenuTrigger>
		</DropdownMenu>
	);
}
