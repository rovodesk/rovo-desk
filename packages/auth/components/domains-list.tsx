import { ConfirmDialog } from "@zero-heads-lab/design-system/components/confirm-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@zero-heads-lab/design-system/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { useModal } from "@zero-heads-lab/design-system/hooks/use-modal";
import {
	Glasses,
	IdCardLanyard,
	Loader2,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { useOrganization } from "../hooks";
import { AddDomainDialog } from "./add-domain-dialog";
import { InviteMembersForm } from "./forms/invite-members-form";

export function DomainList() {
	const { isMobile } = useSidebar();

	const {
		allOrganizations = [],
		activeOrganizationId,
		loading,
		switchOrganization,
		deleteOrganization,
	} = useOrganization();

	const { openModal: openInviteMembersModal } = useModal<string>(
		"invite-members",
		<InviteMembersForm maxValues={30} />,
		"Invite Members",
		"Invite members to your organization",
		{
			shouldAllowBackdropClick: false,
		}
	);

	if (loading) return <DomainListSkeleton />;

	const handleSwitchDomain = (domainId: string) => {
		if (domainId === activeOrganizationId) return;

		const domain = allOrganizations.find((d) => d.id === domainId);

		switchOrganization(domainId, {
			onSuccess: () => {
				toast.success(`Organization switched to ${domain?.name}`);
			},
			onError: () => {
				toast.error("Error switching organization");
			},
		});
	};

	const handleDeleteDomain = (domainId: string) => {
		deleteOrganization(domainId, {
			onSuccess: () => {
				toast.success("Organization deleted");
			},
			onError: () => {
				toast.error("Error deleting organization");
			},
		});
	};

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>All Domains</SidebarGroupLabel>

			<SidebarGroupAction asChild>
				<AddDomainDialog />
			</SidebarGroupAction>

			<SidebarMenu>
				{allOrganizations.map((item) => (
					<SidebarMenuItem key={item.id}>
						<SidebarMenuButton
							className="bg-transparent! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!"
							data-active={item.id === activeOrganizationId}
							disabled={loading}
							onClick={() => handleSwitchDomain(item.id)}
						>
							<span>{item.name}</span>
						</SidebarMenuButton>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									{loading ? <Loader2 /> : <MoreHorizontal />}
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>

							<DropdownMenuContent
								align={isMobile ? "end" : "start"}
								className="w-48 rounded-lg"
								side={isMobile ? "bottom" : "right"}
							>
								<DropdownMenuItem>
									<Glasses className="text-muted-foreground" />
									<span>Manage</span>
								</DropdownMenuItem>

								<DropdownMenuItem onClick={() => openInviteMembersModal()}>
									<IdCardLanyard className="text-muted-foreground" />
									<span>Invite Members</span>
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<div className="rounded border-destructive/20 p-1">
									<ConfirmDialog
										className="sm:max-w-sm"
										confirmText="Delete"
										desc="Are you sure you want to delete this domain?"
										destructive
										handleConfirm={() => handleDeleteDomain(item.id)}
										isLoading={loading}
										title="Delete Domain"
										trigger={
											<DropdownMenuItem
												onSelect={(e) => {
													e.preventDefault(); // 🚨 critical
												}}
											>
												<Trash2 className="h-4 w-4 text-base" />
												<span className="font-medium text-white">Delete</span>
											</DropdownMenuItem>
										}
									/>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

function DomainListSkeleton() {
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>All Domains</SidebarGroupLabel>
			<SidebarGroupAction asChild>
				<Skeleton className="h-4 w-4" />
			</SidebarGroupAction>
			<SidebarMenu>
				{Array.from({ length: 3 }).map((_, i) => (
					<SidebarMenuItem key={i}>
						<SidebarMenuButton className="bg-transparent! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!">
							<Skeleton className="h-4 w-4" />
							<Skeleton className="h-4 w-12" />
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
				<SidebarMenuItem>
					<SidebarMenuButton className="bg-transparent! text-sidebar-foreground/70 hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!">
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-12" />
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
