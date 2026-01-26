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
	SidebarMenuButton,
	useSidebar,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useDomains } from "@/hooks/use-domains";
import { AddDomainDialog } from "./add-domain-dialog";

export function DomainSwitcher() {
	const { isMobile } = useSidebar();

	const { activeDomain, domains, isLoading, switchDomain } = useDomains();
	const [switchingId, setSwitchingId] = useState<string | null>(null);

	if (isLoading) return <DomainSwitcherSkeleton />;
	if (!activeDomain) return null;

	const handleSwitch = async (domainId: string) => {
		if (domainId === activeDomain.id || switchingId) return;

		try {
			setSwitchingId(domainId);
			// Use mutateAsync so the 'finally' block waits for completion
			await switchDomain.mutateAsync(domainId);
		} catch (error) {
			console.error("Failed to switch domain:", error);
		} finally {
			setSwitchingId(null);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					className="bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					size="lg"
				>
					<Avatar className="size-8 rounded-lg">
						<AvatarImage
							src={`https://api.dicebear.com/9.x/shapes/svg?seed=${activeDomain.name}`}
						/>
						<AvatarFallback className="rounded-lg text-xs">
							{activeDomain.name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>

					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{activeDomain.name}</span>
						<span className="truncate text-muted-foreground text-xs">
							Workspace
						</span>
					</div>

					<ChevronsUpDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align={isMobile ? "start" : "end"}
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
				side={isMobile ? "bottom" : "right"}
				sideOffset={isMobile ? 0 : 16}
			>
				<div className="flex h-12 items-center justify-between border-sidebar-accent border-b">
					<DropdownMenuLabel className="text-muted-foreground text-xs">
						All Workspaces
					</DropdownMenuLabel>
					<AddDomainDialog />
				</div>

				{domains.map((domain, index) => {
					const isSwitching = switchingId === domain.id;

					return (
						<DropdownMenuItem
							className="mt-2 cursor-pointer gap-2 p-2"
							disabled={Boolean(switchingId)}
							key={domain.id}
							onSelect={(e) => {
								e.preventDefault();
								handleSwitch(domain.id);
							}}
						>
							<Avatar className="size-6 rounded-sm">
								<AvatarImage
									src={`https://api.dicebear.com/9.x/shapes/svg?seed=${domain.name}`}
								/>
								<AvatarFallback className="text-[10px]">
									{domain.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<span className="flex-1 truncate">{domain.name}</span>

							{isSwitching ? (
								<span className="animate-pulse text-muted-foreground text-xs">
									Switching…
								</span>
							) : (
								index < 9 && (
									<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
								)
							)}
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
