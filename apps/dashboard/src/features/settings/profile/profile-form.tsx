import { useSession } from "@zero-heads-lab/auth/hooks";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import {
	AtSignIcon,
	CheckCircle2Icon,
	GlobeIcon,
	UserIcon,
	XCircleIcon,
} from "lucide-react";

export function ProfilePage() {
	const { session, loading } = useSession();

	if (loading) return <ProfileSkeleton />;
	if (!session?.user) return null;

	const user = session.user;

	return (
		<div className="min-h-screen bg-background">
			{/* ===================== COVER ===================== */}
			<div className="relative h-56 w-full bg-muted">
				<img
					alt="Cover"
					className="h-full w-full object-cover"
					src="https://images.unsplash.com/photo-1772202289452-e9e87552527a?q=80&w=3538&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				/>

				{/* Avatar */}
				<div className="absolute -bottom-12 left-10">
					<Avatar className="h-24 w-24 border-4 border-background shadow-sm">
						{user.image ? (
							<AvatarImage src={user.image} />
						) : (
							<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
						)}
					</Avatar>
				</div>
			</div>

			{/* ===================== PROFILE HEADER ===================== */}
			<div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
				<div className="flex items-start justify-between">
					<div>
						<h1 className="font-semibold text-2xl">{user.name}</h1>
						<p className="text-muted-foreground text-sm">{user.email}</p>
					</div>

					<Button size="sm" variant="outline">
						Edit Profile
					</Button>
				</div>

				<Separator className="my-8" />

				{/* ===================== GRID LAYOUT ===================== */}
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
					{/* ========== LEFT SIDEBAR ========== */}
					<div className="space-y-6">
						{/* About */}
						<div className="rounded-lg border bg-card p-5 shadow-sm">
							<h3 className="mb-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
								About
							</h3>

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

						{/* Account Info */}
						<div className="rounded-lg border bg-card p-5 shadow-sm">
							<h3 className="mb-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
								Account
							</h3>

							<div className="space-y-4 text-sm">
								<div className="flex items-center justify-between">
									<span className="flex items-center gap-2">
										<AtSignIcon className="size-4 text-muted-foreground" />
										Email
									</span>

									{user.emailVerified ? (
										<span className="flex items-center gap-1 text-emerald-500 text-xs">
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

								<p className="text-muted-foreground text-xs">{user.email}</p>
							</div>
						</div>
					</div>

					{/* ========== RIGHT CONTENT ========== */}
					<div className="space-y-6 lg:col-span-2">
						{/* Worked On */}
						<div className="rounded-lg border bg-card shadow-sm">
							<div className="flex items-center justify-between border-b px-5 py-4">
								<h3 className="font-semibold text-sm">Worked on</h3>
								<Button size="sm" variant="link">
									View all
								</Button>
							</div>

							<div className="divide-y">
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
							</div>
						</div>

						{/* Spaces / Projects */}
						<div className="rounded-lg border bg-card shadow-sm">
							<div className="border-b px-5 py-4">
								<h3 className="font-semibold text-sm">Places you work</h3>
							</div>

							<div className="divide-y">
								<ProfileListItem title="Sales CRM" />
								<ProfileListItem title="Customer Support" />
								<ProfileListItem title="Marketing Automation" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ===================== LIST ITEM ===================== */

function ProfileListItem({ title, meta }: { title: string; meta?: string }) {
	return (
		<div className="cursor-pointer px-5 py-4 transition hover:bg-muted/40">
			<p className="font-medium text-sm">{title}</p>
			{meta && <p className="mt-1 text-muted-foreground text-xs">{meta}</p>}
		</div>
	);
}

/* ===================== SKELETON ===================== */

function ProfileSkeleton() {
	return (
		<div className="space-y-10">
			<Skeleton className="h-56 w-full" />
			<div className="mx-auto max-w-6xl px-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="mt-4 h-64 w-full" />
			</div>
		</div>
	);
}
