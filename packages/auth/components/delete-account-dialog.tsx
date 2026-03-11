import { ConfirmDialog } from "@zero-heads-lab/design-system/components/confirm-dialog";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { keys } from "../client/keys";
import { useUser } from "../hooks";

interface SignOutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
	open,
	onOpenChange,
}: SignOutDialogProps) {
	const signOutRedirectUrl = `${keys.VITE_SIGN_OUT_REDIRECT_URL}?redirectedFrom=${encodeURIComponent(
		window.location.href
	)}`;

	const { deleteUserAsync, isLoading } = useUser();

	const deleteUser = async () => {
		return await deleteUserAsync(signOutRedirectUrl);
	};

	return (
		<ConfirmDialog
			className="sm:max-w-sm"
			confirmText="Delete"
			destructive
			disabled={isLoading}
			onConfirm={deleteUser}
			onOpenChange={onOpenChange}
			open={open}
			subtitle="Are you sure to your delete account ?"
			title="Delete Account"
			trigger={<Button variant="destructive">Delete Account</Button>}
		/>
	);
}
