import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
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
<<<<<<< HEAD
import { determineAccessRole } from "../helpers";
import { useUser } from "../hooks";
=======
import { useSession } from "../hooks";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
import { SignOutDialog } from "./sign-out-dialog";

function ProfileDropdown() {
	const { isMobile } = useSidebar();
	const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

<<<<<<< HEAD
	const { user, isLoading } = useUser();
=======
	const { session, isLoading } = useSession();
	const user = session?.user;
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
	if (!user || isLoading) return <ProfileDropdownSkeleton />;

	const name = user.name;
	const email = user.email;
	const image =
		user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${name}`;
	const role = user.role;

	// Improved abbreviation logic
	const abbreviation = (
		name
			?.split(" ")
			.map((n: string) => n[0])
			.join("")
			.slice(0, 2) || "??"
	).toUpperCase();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							className="h-12 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
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
						<DropdownMenuLabel className="h-12 px-2 py-1 font-normal">
							<div className="flex items-center justify-between gap-3">
								<div className="flex min-w-0 items-center gap-2">
									<Avatar className="h-8 w-8 shrink-0 rounded-lg">
										<AvatarImage alt={name} src={image} />
										<AvatarFallback className="rounded-lg">
											{abbreviation}
										</AvatarFallback>
									</Avatar>

									<div className="grid min-w-0 text-left text-sm leading-tight">
										<span className="truncate font-medium">{name}</span>
										<span className="truncate text-muted-foreground text-xs">
											{email}
										</span>
									</div>
								</div>

								<Badge className="shrink-0" variant="destructive">
									{determineAccessRole(role)}
								</Badge>
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
						<div className="rounded border-destructive/20 p-1">
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

export { ProfileDropdown, ProfileDropdownSkeleton };
