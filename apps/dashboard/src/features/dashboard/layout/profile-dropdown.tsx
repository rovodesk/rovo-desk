import { useQuery } from "@tanstack/react-query";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@zero-heads-lab/design-system/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { Bell, CreditCard, MoreVertical, UserCircle } from "lucide-react";
import { useState } from "react";
import { SignOutDialog } from "@/components/sign-out-dialog";
import { authQueries } from "@/lib/queries/auth";
// ... (rest of your imports)

export function ProfileDropdown() {
	const { isMobile } = useSidebar();
	const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

	// 🔑 Use the cached session data directly
	const { data: session, isLoading } = useQuery(authQueries.session());

	// Wait for the cache to hydrate
	if (isLoading) {
		return <ProfileDropdownSkeleton />;
	}

	const user = session?.user;
	if (!user) return null;

	const name = user.name;
	const email = user.email;
	const image =
		user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${name}`;

	// Improved abbreviation logic
	const abbreviation = (
		name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.slice(0, 2) || "??"
	).toUpperCase();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							size="lg"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage alt={name} src={image} />
								<AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									{abbreviation}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{name}</span>
								<span className="truncate text-muted-foreground text-xs">
									{email}
								</span>
							</div>
							<MoreVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="end"
						className="min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						{/* Dropdown Header */}
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage alt={name} src={image} />
									<AvatarFallback className="rounded-lg">
										{abbreviation}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{name}</span>
									<span className="truncate text-muted-foreground text-xs">
										{email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem>
								<UserCircle className="mr-2 h-4 w-4" />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCard className="mr-2 h-4 w-4" />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell className="mr-2 h-4 w-4" />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						{/* Sign Out Trigger */}
						<div className="p-1">
							<SignOutDialog
								onOpenChange={setSignOutDialogOpen}
								open={signOutDialogOpen}
							/>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

function ProfileDropdownSkeleton() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div className="flex items-center gap-3 p-2">
					{/* Avatar */}
					<Skeleton className="h-8 w-8 shrink-0 rounded-full" />

					{/* Text */}
					<div className="flex min-w-0 flex-col gap-1">
						<Skeleton className="h-3 w-24 rounded-md" />
						<Skeleton className="h-3 w-36 rounded-md" />
					</div>

					{/* Kebab menu placeholder */}
					<Skeleton className="ml-auto h-4 w-4 shrink-0 rounded-sm" />
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
