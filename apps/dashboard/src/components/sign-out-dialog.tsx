import { useMutation, useQueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { authClient } from "@zero-heads-lab/auth/client";
import { LogOut } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface SignOutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
	const queryClient = useQueryClient();

	const { mutate: handleSignOut, isPending } = useMutation({
		mutationFn: async () => await authClient.signOut(),
		onMutate: () => {
			// 1. Wipe the cache so no sensitive data remains
			queryClient.resetQueries();
			queryClient.clear();
		},
		onSuccess: () => {
			// 2. Close the dialog
			onOpenChange(false);

			// 3. Redirect to sign-in
			throw redirect({
				to: "/sign-in",
			});
		},
		onError: (error) => {
			console.error("Error Signing out", error);
			// If you have a toast utility in your AuthContext, you'd call it here
		},
	});

	return (
		<ConfirmDialog
			className="sm:max-w-sm"
			confirmText="Sign out"
			desc="Are you sure you want to sign out? You will need to sign in again to access your account."
			destructive
			handleConfirm={() => handleSignOut()} // Trigger the mutation
			isLoading={isPending} // useMutation's state
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
