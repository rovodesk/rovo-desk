import { SignOutDialog } from "@zero-heads-lab/auth/components/sign-out-dialog";
import { useUser } from "@zero-heads-lab/auth/hooks";
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
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { Bell, CreditCard } from "lucide-react";
import { useState } from "react";

function UserProfileDropdown() {
	const { isMobile } = useSidebar();
	const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

	const { user, isLoading: isUserLoading } = useUser();

	if (isUserLoading) return <ProfileDropdownSkeleton />;

	const name = user?.name;
	const email = user?.email;
	const image =
		user?.image || `https://api.dicebear.com/9.x/initials/svg?seed=${name}`;

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
						<div className="relative">
							<Avatar className="h-9 w-9 rounded-md border">
								<AvatarImage alt={name} src={image} />
								<AvatarFallback className="rounded-md">
									{abbreviation}
								</AvatarFallback>
							</Avatar>

							{/* Status indicator */}
							<span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
						</div>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="end"
						className="w-72 rounded-xl border bg-popover p-2 shadow-lg"
						side={isMobile ? "bottom" : "right"}
						sideOffset={6}
					>
						{/* PROFILE CARD */}
						<div className="relative mb-2 flex items-center gap-3 rounded-lg bg-muted/40 p-3">
							{/* Avatar wrapper */}
							<div className="relative">
								<Avatar className="h-9 w-9 rounded-md">
									<AvatarImage alt={name} src={image} />
									<AvatarFallback className="rounded-md">
										{abbreviation}
									</AvatarFallback>
								</Avatar>

								{/* Status indicator */}
								<span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
							</div>

							<div className="min-w-0 flex-1">
								<p className="truncate font-medium text-sm">{name}</p>
								<p className="truncate text-muted-foreground text-xs">
									{email}
								</p>
							</div>
						</div>

						<DropdownMenuSeparator />

						<DropdownMenuSeparator />
						{/* ACCOUNT */}
						<DropdownMenuItem className="flex items-center gap-2 rounded-md px-3 py-2">
							<Bell className="h-4 w-4 text-muted-foreground" />
							<span className="flex-1">Notifications</span>

							{/* Badge */}
							<span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
								3
							</span>
						</DropdownMenuItem>

						<DropdownMenuItem className="flex items-center gap-2 rounded-md px-3 py-2">
							<CreditCard className="h-4 w-4 text-muted-foreground" />
							Billing
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						{/* HELP */}
						<DropdownMenuItem className="rounded-md px-3 py-2">
							Help Center
						</DropdownMenuItem>

						<DropdownMenuItem className="rounded-md px-3 py-2">
							Community Forum
						</DropdownMenuItem>

						<DropdownMenuItem className="rounded-md px-3 py-2">
							Status Page
						</DropdownMenuItem>

						<DropdownMenuItem className="rounded-md px-3 py-2">
							Terms & Policies
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						{/* LOGOUT */}
						<DropdownMenuItem asChild className="rounded-md px-3 py-2">
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

export { UserProfileDropdown, ProfileDropdownSkeleton };
