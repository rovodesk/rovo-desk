// TODO: Add Sync

import {
	useOrganization,
	useOrganizationList,
} from "@clerk/tanstack-react-start";
import { convexQuery } from "@convex-dev/react-query";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@zero-heads-lab/backend/convex/_generated/api";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@zero-heads-lab/design-system/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { useMutation } from "convex/react";
import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { AddDomainDialog } from "./add-domain-dialog";

export function NavDomainsList() {
	const { isMobile } = useSidebar();
	const queryClient = useQueryClient();

	const {
		isLoaded: isClerkLoaded,
		userMemberships,
		setActive,
	} = useOrganizationList({
		userMemberships: { infinite: true },
	});

	const { organization: activeOrg } = useOrganization();

	const { data: convexDomains } = useSuspenseQuery(
		convexQuery(api.functions.organizations.listUserDomains, {})
	);

	const createDomain = useMutation(api.functions.organizations.createDomain);

	// 1. MEMOIZE THE SYNC FUNCTION
	const createDomainAndSync = useCallback(
		async (args: {
			name: string;
			slug: string;
			clerkId: string;
			imageUrl?: string;
		}) => {
			await createDomain(args);

			// This triggers TanStack Query to refresh the list automatically
			queryClient.invalidateQueries({
				queryKey: convexQuery(api.functions.organizations.listUserDomains, {})
					.queryKey,
			});
		},
		[createDomain, queryClient]
	); // Stable dependencies

	// 2. MERGED LIST (Stable references)
	const domains = useMemo(() => {
		if (!isClerkLoaded) return [];
		const clerkOrgs = userMemberships.data?.map((m) => m.organization) ?? [];

		return clerkOrgs.map((org) => {
			const convex = convexDomains.find((d) => d.clerkId === org.id);
			return {
				key: convex?._id ?? `clerk_${org.id}`,
				clerkId: org.id,
				name: org.name,
				imageUrl: org.imageUrl,
				isSynced: Boolean(convex),
			};
		});
	}, [isClerkLoaded, userMemberships.data, convexDomains]);

	// 3. CLEAN AUTO-SYNC EFFECT
	useEffect(() => {
		// Only run if we have an active org and the Convex list is ready
		if (!(isClerkLoaded && activeOrg)) return;

		const exists = convexDomains.some((d) => d.clerkId === activeOrg.id);

		if (!exists) {
			createDomainAndSync({
				name: activeOrg.name,
				slug: activeOrg.slug ?? "",
				clerkId: activeOrg.id,
				imageUrl: activeOrg.imageUrl,
			});
		}
		// Only re-run if the active ID changes or the list length changes
	}, [activeOrg, convexDomains, createDomainAndSync, isClerkLoaded]);

	const handleSetActive = useCallback(
		(orgId: string) => {
			setActive?.({ organization: orgId });
		},
		[setActive]
	);

	if (!isClerkLoaded) return null;

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<div className="flex items-center justify-between pr-2">
				<SidebarGroupLabel>My Domains</SidebarGroupLabel>
				<AddDomainDialog />
			</div>

			<SidebarMenu className="gap-1">
				{domains.map((domain) => {
					const isActive = activeOrg?.id === domain.clerkId;

					return (
						<SidebarMenuItem key={domain.key}>
							<SidebarMenuButton
								className="bg-transparent! hover:bg-sidebar-accent/40!"
								isActive={isActive}
								onClick={() => handleSetActive(domain.clerkId)}
								tooltip={domain.name}
							>
								<Avatar className="size-6 rounded-md">
									<AvatarImage src={domain.imageUrl} />
									<AvatarFallback className="text-[10px]">
										{domain.name[0]?.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span className="truncate font-medium">{domain.name}</span>
							</SidebarMenuButton>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuAction showOnHover>
										<MoreHorizontal />
									</SidebarMenuAction>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align={isMobile ? "end" : "start"}
									className="w-48"
									side={isMobile ? "bottom" : "right"}
								>
									<DropdownMenuItem>
										<Folder className="mr-2 size-4" />
										View Project
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Forward className="mr-2 size-4" />
										Share Project
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem className="text-destructive">
										<Trash2 className="mr-2 size-4" />
										Delete Project
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
