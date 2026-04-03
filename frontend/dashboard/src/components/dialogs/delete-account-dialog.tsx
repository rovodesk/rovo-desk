import { ConfirmDialog } from "@zero-heads-lab/design-system/components/confirm-dialog";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
// import { env } from "@/env";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";

interface SignOutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
	open,
	onOpenChange,
}: SignOutDialogProps) {
	// const signOutRedirectUrl = `${env.VITE_KINDE_LOGOUT_URI}?redirectedFrom=${encodeURIComponent(
	// 	window.location.href
	// )}`;

	// const { deleteUserAsync, isLoading } = useUser();

	const deleteUser = () => {
		// return await deleteUserAsync(signOutRedirectUrl);
		toast.success("not implemented");
	};

	return (
		<ConfirmDialog
			className="sm:max-w-sm"
			confirmText="Delete"
			destructive
			// disabled={isLoading}
			onConfirm={deleteUser}
			onOpenChange={onOpenChange}
			open={open}
			subtitle="Are you sure to your delete account ?"
			title="Delete Account"
			trigger={<Button variant="destructive">Delete Account</Button>}
		/>
	);
}
