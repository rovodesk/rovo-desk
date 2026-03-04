import { ConfirmDialog } from "@zero-heads-lab/design-system/components/confirm-dialog";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { LogOut } from "lucide-react";
import { keys } from "../client/keys";
import { useSignOut } from "../hooks";

interface SignOutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
	const signOutRedirectUrl = `${keys.VITE_SIGN_OUT_REDIRECT_URL}?redirectedFrom=${encodeURIComponent(window.location.href)}`;

	const { signOut, isPending } = useSignOut(signOutRedirectUrl, {
		onSuccess: () => {
			onOpenChange(false);
		},
		onError: () => {
			toast.error("Error Signing out", {
				description: "Please try again later!",
			});
		},
	});

	return (
		<ConfirmDialog
			className="sm:max-w-sm"
			confirmText="Sign out"
			destructive
			disabled={isPending}
			onConfirm={signOut}
			onOpenChange={onOpenChange}
			open={open}
			subtitle="Are you sure you want to sign out? You will need to sign in again to access your account."
			title="Sign out"
			trigger={
				<button
					className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-white/30 hover:bg-destructive/20 hover:shadow-sm"
					type="button"
				>
					<LogOut className="h-4 w-4 text-muted-foreground" />
					<span className="font-medium text-muted-foreground text-sm">
						Sign Out
					</span>
				</button>
			}
		/>
	);
}
