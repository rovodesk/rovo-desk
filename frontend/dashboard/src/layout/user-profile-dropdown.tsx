import { Link } from "@tanstack/react-router";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
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
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { useTheme } from "@zero-heads-lab/design-system/context/theme";
import { capitalize } from "@zero-heads-lab/shared/lib/utils";
import { Bell, ChevronRight, CreditCard, Settings, User2 } from "lucide-react";
// import { SignOutDialog } from "@/components/dialogs/";
import { useAuth } from "@/hooks/use-auth";
import { useUser } from "@/hooks/use-user";

// import { useProfile } from "@/hooks/use-profile";

// import { DomainSwitcher } from "@/layout/domain-switcher";

function UserProfileDropdown() {
	const { isMobile } = useSidebar();
	// const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

	const { logout } = useAuth();
	const { theme } = useTheme();

	const { data: user, isLoading: isUserLoading } = useUser();
	// const { userProfileQuery, toggleUserActiveMutation } = useProfile();

	const loading = isUserLoading;

	// const isUserActive = useMemo(() => {
	// 	return userProfileQuery.data?.isActive === true;
	// }, [userProfileQuery.data?.isActive]);

	if (loading) return <ProfileDropdownSkeleton />;

	const name = user?.name;
	const email = user?.email;
	const image = user?.picture;

	// Improved abbreviation logic
	const abbreviation = (
		name
			?.split(" ")
			.map((n: string) => n[0])
			.join("")
			.slice(0, 2) || "??"
	).toUpperCase();

	// const handleUserActiveToggle = async (checked: boolean) => {
	// 	try {
	// 		await toggleUserActiveMutation.mutateAsync({ active: checked });
	// 		toast.success(`User is ${checked ? "Available" : "Away"} now.`);
	// 	} catch (error) {
	// 		console.error("Failed to update user active status", error);
	// 		toast.error("Failed to update user active status");
	// 	}
	// };

	const handleLogout = () => {
		try {
			logout();
			toast.success("Logged out successfully");
		} catch (error) {
			console.error("Failed to log out", error);
			toast.error("Failed to log out");
		}
	};

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
							{/* <span
								className={`absolute right-0 bottom-0 h-3 w-3 rounded-full ring-2 ring-background ${isUserActive ? "bg-green-500" : "bg-slate-500"
									}`}
							/> */}
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
								{/* <span
									className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background ${isUserActive ? "bg-green-500" : "bg-slate-500"
										}`}
								/> */}
							</div>

							<div className="min-w-0 flex-1">
								<p className="truncate font-medium text-sm">{name}</p>
								<p className="truncate text-muted-foreground text-xs">
									{email}
								</p>
							</div>
						</div>

						{/* AWAY TOGGLE */}
						{/* <div className="flex items-center justify-between px-2 py-2 text-sm">
							<span className="text-muted-foreground">
								Status: {isUserActive ? "Available" : "Away"}
							</span>
							<Switch
								checked={isUserActive}
								onCheckedChange={handleUserActiveToggle}
							/>
						</div> */}

						<DropdownMenuSeparator />

						{/* Domain Switcher */}
						<div className="px-2 py-2">
							{/* <DomainSwitcher workspaceSettingsRouteLink="/settings/workspace" /> */}
						</div>

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

						<DropdownMenuItem
							asChild
							className="flex items-center gap-2 rounded-md px-3 py-2"
						>
							<Link to="/settings">
								<User2 className="h-4 w-4 text-muted-foreground" />
								Profile
							</Link>
						</DropdownMenuItem>

						<DropdownMenuItem className="flex items-center gap-2 rounded-md px-3 py-2">
							<CreditCard className="h-4 w-4 text-muted-foreground" />
							Billing
						</DropdownMenuItem>

						<DropdownMenuItem
							asChild
							className="flex items-center gap-2 rounded-md px-3 py-2"
						>
							<Link to="/settings">
								<Settings className="h-4 w-4 text-muted-foreground" />
								Settings
							</Link>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						{/* SETTINGS NAVIGATION */}
						<DropdownMenuItem
							asChild
							className="flex items-center justify-between rounded-md px-3 py-2"
						>
							<Link to="/settings/appearance">
								<span>Theme: {capitalize(theme)}</span>
								<ChevronRight className="h-4 w-4 text-muted-foreground" />
							</Link>
						</DropdownMenuItem>

						{/* TODO: Add language switcher (internationalization support) */}
						<DropdownMenuItem
							asChild
							className="flex items-center justify-between rounded-md px-3 py-2"
						>
							<Link to="/settings/workspace">
								<span>Language: English (US)</span>
								<ChevronRight className="h-4 w-4 text-muted-foreground" />
							</Link>
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
							{/* <SignOutDialog
								onOpenChange={setSignOutDialogOpen}
								open={signOutDialogOpen}
							/> */}
							<Button onClick={() => handleLogout()}>Logout</Button>
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
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

export { UserProfileDropdown, ProfileDropdownSkeleton };
