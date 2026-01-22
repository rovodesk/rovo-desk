import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { authClient } from "@/lib/auth/client";

interface SignOutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	trigger?: React.ReactNode;
}

export function SignOutDialog({
	open,
	onOpenChange,
	trigger,
}: SignOutDialogProps) {
	const handleSignOut = async () => {
		try {
			await authClient.signOut();
		} catch (error) {
			console.log(error);
		} finally {
			// Preserve current location for redirect after sign-in
			// navigate({
			// 	to: "/sign-in",
			// 	search: { redirect: location.href },
			// 	replace: true,
			// });
			location.reload();
		}
	};

	return (
		<ConfirmDialog
			className="sm:max-w-sm"
			confirmText="Sign out"
			desc="Are you sure you want to sign out? You will need to sign in again to access your account."
			destructive
			handleConfirm={handleSignOut}
			onOpenChange={onOpenChange}
			open={open}
			title="Sign out"
			trigger={
				trigger ? trigger : <Button variant="destructive">Logout</Button>
			}
		/>
	);
}
