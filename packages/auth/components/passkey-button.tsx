<<<<<<< HEAD
<<<<<<< HEAD
=======
"use client";

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { KeyRoundIcon, Loader2Icon } from "lucide-react";
import { usePasskeySignIn } from "../hooks/use-passkey-signin";

type PasskeyButtonProps = {
	isAnyLoading?: boolean;
};

export function PasskeyButton({ isAnyLoading }: PasskeyButtonProps) {
	const { signInWithPasskey, isPending } = usePasskeySignIn({
		onError: (error: Error) => {
			toast.error("Authentication Error", {
				description: error.message,
			});
		},
	});

	const isLoading = isPending || isAnyLoading;

	return (
		<div className="flex w-full flex-col gap-4">
			<Input autoComplete="username webauthn" hidden name="name" type="text" />
			<Input
				autoComplete="current-password webauthn"
				hidden
				name="password"
				type="password"
			/>

			<Button
				className="w-full"
				disabled={isLoading}
				onClick={() => signInWithPasskey()}
				size="lg"
				type="button"
			>
				{isLoading ? (
					<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<KeyRoundIcon className="mr-2 h-4 w-4" />
				)}
				Continue with Passkey
			</Button>
		</div>
	);
}
