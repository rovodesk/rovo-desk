import { useAuth } from "@clerk/tanstack-react-start";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface SignOutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
	const [isLoading, setIsLoading] = useState(false);

	const { signOut } = useAuth();

	const handleSignOut = async () => {
		try {
			setIsLoading(true);
			await signOut();
		} catch (error) {
			console.error("Error Signing out", error);
			setIsLoading(false);
			onOpenChange(false);
		} finally {
			setIsLoading(false);
			onOpenChange(false);

			console.log("Signed out");
		}
	};

	return (
		<ConfirmDialog
			className="sm:max-w-sm"
			confirmText="Sign out"
			desc="Are you sure you want to sign out? You will need to sign in again to access your account."
			destructive
			handleConfirm={handleSignOut}
			isLoading={isLoading}
			onOpenChange={onOpenChange}
			open={open}
			title="Sign out"
			trigger={
				<button
					className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/20 hover:shadow-sm"
					type="button"
				>
					<LogOut className="h-4 w-4 text-red-500" />
					<span className="font-medium text-red-500 text-sm">Sign Out</span>
				</button>
			}
		/>
	);
}
