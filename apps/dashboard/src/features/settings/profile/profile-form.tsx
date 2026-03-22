import { DeleteAccountDialog } from "@zero-heads-lab/auth/components/delete-account-dialog";
import { useSession } from "@zero-heads-lab/auth/hooks";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@zero-heads-lab/design-system/components/ui/input-group";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";

import {
	AtSignIcon,
	CheckCircle2Icon,
	GlobeIcon,
	Pencil,
	UserIcon,
	XCircleIcon,
} from "lucide-react";
import { useState } from "react";

export function ProfilePage() {
	const { session, loading } = useSession();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

	if (loading) return <ProfileSkeleton />;
	if (!session?.user) return null;

	const user = session.user;

	return (
		<div className="flex min-h-screen flex-col bg-muted/30">
			{/* ================= COVER ================= */}
			<div className="relative h-52 w-full border-b bg-muted">
				<img
					alt="Cover"
					className="h-full w-full object-cover"
					src="https://images.unsplash.com/photo-1772202289452-e9e87552527a?q=80&w=3538&auto=format&fit=crop"
				/>

				<Button
					className="absolute top-4 right-4 bg-muted/50!"
					size="lg"
					variant="outline"
				>
					<Pencil className="mr-2 h-4 w-4" />
					Change Cover Picture
				</Button>

				{/* Avatar */}
				<div className="absolute -bottom-12 left-10">
					<div className="group relative z-10">
						<Avatar className="h-24 w-24 border-4 border-muted transition-colors hover:border-primary">
							{user.image ? (
								<AvatarImage src={user.image} />
							) : (
								<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
							)}
						</Avatar>

						<Button
							className="absolute right-0 bottom-0 h-8 w-8 bg-muted/50 opacity-0 transition group-hover:opacity-100"
							size="icon-lg"
							variant="ghost"
						>
							<Pencil className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* ================= PROFILE BODY ================= */}
			<div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-12">
				{/* Header */}
				<div className="group flex items-center justify-between">
					<div className="group relative flex flex-col gap-2 pr-10">
						<Badge variant="outline">{user.role}</Badge>

						<div className="flex flex-col gap-1">
							<h1 className="font-semibold text-2xl tracking-tight">
								{user.name}
							</h1>
							<p className="text-muted-foreground text-sm">{user.email}</p>
						</div>

						<Button
							className="absolute top-0 right-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
							size="icon"
							variant="ghost"
						>
							<Pencil className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex items-center gap-4">
						<Button size="sm" variant="outline">
							<GlobeIcon className="mr-2 h-4 w-4" />
							View Public Profile
						</Button>
					</div>
				</div>

				<Separator className="my-8" />

				{/* ================= GRID ================= */}
				<div className="grid gap-10 lg:grid-cols-[280px_1fr]">
					{/* LEFT SIDEBAR */}
					<div className="space-y-6">
						{/* ABOUT */}
						<div className="rounded-lg border bg-background p-5">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="font-medium text-muted-foreground text-sm">
									About
								</h3>

								<Button size="icon" variant="ghost">
									<Pencil className="h-4 w-4" />
								</Button>
							</div>

							<div className="space-y-3 text-sm">
								<div className="flex items-center gap-3">
									<UserIcon className="size-4 text-muted-foreground" />
									Product Designer
								</div>

								<div className="flex items-center gap-3">
									<GlobeIcon className="size-4 text-muted-foreground" />
									English
								</div>
							</div>
						</div>

						{/* ACCOUNT */}
						<div className="space-y-4 rounded-lg border bg-background p-5">
							<div className="flex items-center justify-between">
								<h3 className="font-medium text-muted-foreground text-sm">
									Account
								</h3>

								<Button size="sm" variant="outline">
									<Pencil className="h-4 w-4" />
									Update Email
								</Button>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-start text-sm">
									{user.emailVerified ? (
										<span className="flex items-center gap-1 text-emerald-600 text-xs">
											<CheckCircle2Icon className="size-3" />
											Verified
										</span>
									) : (
										<span className="flex items-center gap-1 text-amber-500 text-xs">
											<XCircleIcon className="size-3" />
											Unverified
										</span>
									)}
								</div>

								<InputGroup>
									<InputGroupAddon>
										<AtSignIcon className="size-4 text-muted-foreground" />
									</InputGroupAddon>
									<InputGroupInput
										className="w-full truncate"
										readOnly
										value={user.email}
									/>
								</InputGroup>
							</div>
						</div>
					</div>

					{/* RIGHT CONTENT */}
					<div className="space-y-6">
						<CardSection title="Recent Activity">
							<ProfileListItem
								meta="Edited today · Zero Heads"
								title="CRM Dashboard Revamp"
							/>
							<ProfileListItem
								meta="Published yesterday"
								title="Support Automation Flow"
							/>
							<ProfileListItem
								meta="Edited 3 days ago"
								title="Customer Segmentation Docs"
							/>
						</CardSection>

						<CardSection title="Workspaces">
							<ProfileListItem title="Sales CRM" />
							<ProfileListItem title="Customer Support" />
							<ProfileListItem title="Marketing Automation" />
						</CardSection>
					</div>
				</div>

				<Separator className="my-8" />

				{/* Danger Zone */}
				<div className="w-full rounded-lg border border-destructive/40 bg-destructive/10 p-6">
					<div className="flex flex-col gap-6">
						{/* Header */}
						<div>
							<h3 className="font-semibold text-destructive text-lg">
								Danger Zone
							</h3>
							<p className="text-muted-foreground text-sm">
								These actions are destructive and cannot be undone.
							</p>
						</div>
						{/* Delete Account */}
						<div className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-background p-4 md:flex-row md:items-center md:justify-between">
							<div className="space-y-1">
								<p className="font-medium">Delete Account</p>
								<p className="text-muted-foreground text-sm">
									Permanently delete your account and all associated data. This
									action cannot be reversed.
								</p>
							</div>

							<DeleteAccountDialog
								onOpenChange={setDeleteDialogOpen}
								open={deleteDialogOpen}
							/>
						</div>
					</div>

					{/* FOOTER */}
					<div className="flex items-center justify-between border-t py-6">
						<p className="text-muted-foreground text-xs">
							Last updated on {session?.user.updatedAt.toLocaleDateString()}
						</p>
						<Button className="min-w-[120px]">
							Save Changes
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ================= CARD SECTION ================= */

function CardSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="rounded-lg border bg-background">
			<div className="border-b px-5 py-4">
				<h3 className="font-medium text-sm">{title}</h3>
			</div>

			<div className="divide-y">{children}</div>
		</div>
	);
}

/* ================= LIST ITEM ================= */

function ProfileListItem({ title, meta }: { title: string; meta?: string }) {
	return (
		<div className="cursor-pointer px-5 py-4 transition hover:bg-muted/40">
			<p className="font-medium text-sm">{title}</p>
			{meta && <p className="mt-1 text-muted-foreground text-xs">{meta}</p>}
		</div>
	);
}

/* ================= SKELETON ================= */

function ProfileSkeleton() {
	return (
		<div className="space-y-10">
			<Skeleton className="h-52 w-full" />
			<div className="mx-auto max-w-6xl px-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="mt-4 h-64 w-full" />
			</div>
		</div>
	);
}
