import { ConfirmDialog } from "@zero-heads-lab/design-system/components/confirm-dialog";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { LogOut } from "lucide-react";
import { keys } from "../../../../../packages/auth-old/client/keys";
import { useSignOut } from "../../../../../packages/auth-old/hooks";

interface SignOutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
	const signOutRedirectUrl = `${keys.VITE_SIGN_OUT_REDIRECT_URL}?redirectedFrom=${encodeURIComponent(
		window.location.href
	)}`;

	const { signOut, isPending } = useSignOut(signOutRedirectUrl, {
		onSuccess: () => onOpenChange(false),
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
			subtitle="You will need to sign in again to access your account."
			title="Sign out"
			trigger={
				<button
					className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-red-600 text-sm transition-colors hover:bg-red-500/10 focus:bg-red-500/10"
					type="button"
				>
					<LogOut className="h-4 w-4" />
					<span className="flex-1 text-left">Logout</span>
				</button>
			}
		/>
	);
}
