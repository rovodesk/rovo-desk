import { ConfirmDialog } from "@zero-heads-lab/design-system/components/confirm-dialog";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { LogOut } from "lucide-react";
import { useSignOut } from "../hooks";

interface SignOutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
	const { signOut, isPending } = useSignOut({
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
			desc="Are you sure you want to sign out? You will need to sign in again to access your account."
			destructive
			handleConfirm={signOut}
			isLoading={isPending}
			onOpenChange={onOpenChange}
			open={open}
			title="Sign out"
			trigger={
				<button
					className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-destructive/30 hover:bg-destructive/20 hover:shadow-sm"
					type="button"
				>
					<LogOut className="h-4 w-4 text-destructive" />
					<span className="font-medium text-destructive text-sm">Sign Out</span>
				</button>
			}
		/>
	);
}
