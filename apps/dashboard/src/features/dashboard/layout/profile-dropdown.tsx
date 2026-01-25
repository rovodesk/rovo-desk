import { useUser } from "@clerk/tanstack-react-start";
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

export function ProfileDropdown() {
	const { isMobile } = useSidebar();
	const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
	const { user, isLoaded } = useUser();

	// 🔑 Wait for Clerk session resolution
	if (!isLoaded) {
		return <ProfileDropdownSkeleton />;
	}

	// Safety guard (logged-out state)
	if (!user) return null;

	const name = user.fullName;
	const email = user.primaryEmailAddress?.emailAddress;
	const image = user.imageUrl;
	const abbreviation =
		(user.firstName?.[0]?.toUpperCase() ?? "") +
		(user.lastName?.[0]?.toUpperCase() ?? "");

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							size="lg"
						>
							<Avatar className="h-8 w-8 rounded-lg grayscale">
								<AvatarImage alt={name ?? ""} src={image} />
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
							<MoreVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="end"
						className="min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage alt={name ?? ""} src={image} />
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
								<UserCircle />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuItem asChild variant="destructive">
							<SignOutDialog
								onOpenChange={setSignOutDialogOpen}
								open={signOutDialogOpen}
							/>
						</DropdownMenuItem>
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
