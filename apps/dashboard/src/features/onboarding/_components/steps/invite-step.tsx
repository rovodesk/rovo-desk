import { useOnboarding } from "@onboardjs/react";
import { InviteMembersForm } from "@zero-heads-lab/auth/components/forms/invite-members-form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { ArrowRight, UserPlus, Users } from "lucide-react";

export function InviteStep({ className }: React.ComponentProps<"div">) {
	const { next, loading, updateContext, skip } = useOnboarding();

	return (
		<div
			className={cn(
				"fade-in zoom-in-95 mx-auto w-full max-w-2xl animate-in px-4 py-10 duration-500",
				className
			)}
		>
			<div className="flex flex-col items-center gap-8 text-center">
				{/* Visual Cue */}
				<div className="relative">
					<div className="absolute -inset-4 rounded-full bg-primary/5 blur-xl" />
					<div className="relative flex size-16 items-center justify-center rounded-2xl border bg-background shadow-sm">
						<Users className="size-8 text-primary" />
					</div>
				</div>

				{/* Header Section */}
				<div className="space-y-3">
					<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
						Bring your team in
					</h1>
					<p className="mx-auto max-w-[500px] text-lg text-muted-foreground">
						Zero Heads works best when shared. Invite your collaborators to
						start automating your support together.
					</p>
				</div>

				{/* The Invitation Card */}
				<div className="w-full max-w-lg rounded-2xl border bg-card p-1 shadow-foreground/5 shadow-xl">
					<div className="rounded-[14px] bg-background px-6 py-8 sm:px-8">
						<div className="mb-6 flex items-center justify-between border-b pb-4">
							<div className="flex items-center gap-2 font-medium">
								<UserPlus className="size-4 text-muted-foreground" />
								<span>Invite via email</span>
							</div>
							<span className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
								Admin Access
							</span>
						</div>

						<InviteMembersForm
							isPending={loading.isAnyLoading}
							onCancel={() => skip()}
							onSubmit={(value) => {
								updateContext({
									flowData: { ...value },
								});
								next();
							}}
						/>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="flex flex-col items-center gap-4">
					<Button
						className="group text-muted-foreground transition-colors hover:text-foreground"
						onClick={() => skip()}
						variant="ghost"
					>
						I'll invite them later
						<ArrowRight className="ml-2 size-4 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
					</Button>

					<div className="flex items-center gap-4 py-2">
						<div className="h-px w-8 bg-border" />
						<span className="font-bold text-[10px] text-muted-foreground/60 uppercase tracking-tighter">
							Trusted by 500+ teams
						</span>
						<div className="h-px w-8 bg-border" />
					</div>
				</div>
			</div>
		</div>
	);
}
