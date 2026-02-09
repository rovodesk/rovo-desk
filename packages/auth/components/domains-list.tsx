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
import {
	ChevronDown,
	Folder,
	Forward,
	Loader2,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { useListDomains, useSession, useSwitchDomain } from "../hooks";
import { AddDomainDialog } from "./add-domain-dialog";

export function DomainList() {
	const { isMobile } = useSidebar();

	const { session, isLoading: isAuthLoading } = useSession();
	const { domains = [], isLoading: isDomainsLoading } = useListDomains();

	const activeDomainId = session?.session?.activeOrganizationId;

	const { switchDomain, isPending } = useSwitchDomain({
		onError: () => {
			toast.error("Error switching organization");
		},
	});

	const isLoaded = !(isAuthLoading || isDomainsLoading);
	if (!isLoaded) return <DomainListSkeleton />;

	const handleSwitchDomain = (domainId: string) => {
		const domain = domains.find((d) => d.id === domainId);

		switchDomain(domainId, {
			onSuccess: () => {
				toast.success(`Organization switched to ${domain?.name}`);
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
				{domains.map((item) => (
					<SidebarMenuItem key={item.id}>
						<SidebarMenuButton
							className="bg-transparent! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!"
							data-active={item.id === activeDomainId}
							disabled={isPending}
							onClick={() => handleSwitchDomain(item.id)}
						>
							{item.icon && <item.icon />}
							<span>{item.name}</span>
						</SidebarMenuButton>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									{isPending ? <Loader2 /> : <MoreHorizontal />}
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>

							<DropdownMenuContent
								align={isMobile ? "end" : "start"}
								className="w-48 rounded-lg"
								side={isMobile ? "bottom" : "right"}
							>
								<DropdownMenuItem>
									<Folder className="text-muted-foreground" />
									<span>View Project</span>
								</DropdownMenuItem>

								<DropdownMenuItem>
									<Forward className="text-muted-foreground" />
									<span>Share Project</span>
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem>
									<Trash2 className="text-muted-foreground" />
									<span>Delete Project</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}

				{domains.length > 3 && (
					<SidebarMenuItem className="mt-2">
						<SidebarMenuButton className="items-center! justify-center bg-transparent!">
							<ChevronDown className="text-sidebar-foreground/70" />
						</SidebarMenuButton>
					</SidebarMenuItem>
				)}
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
