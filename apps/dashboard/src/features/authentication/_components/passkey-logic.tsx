import { useMutation } from "@tanstack/react-query";
import { authClient } from "@zero-heads-lab/auth/client";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { KeyRoundIcon, Loader2Icon } from "lucide-react";
import { useEffect } from "react";

type PasskeyButtonProps = {
	isAnyLoading?: boolean;
};

export default function PasskeyButton({ isAnyLoading }: PasskeyButtonProps) {
	const { mutate: handlePasskeySignIn, isPending } = useMutation({
		mutationFn: async () => {
			// BetterAuth handles the WebAuthn ceremony internally
			const { data, error } = await authClient.signIn.passkey({
				// autoFill: true enables the browser's "Conditional UI"
				// (suggesting passkeys in the email/username field)
				autoFill: true,
			});

			if (error) {
				throw new Error(error.message || "Passkey authentication failed");
			}

			return data;
		},
		onSuccess: () => {
			toast.success("Welcome back!", {
				description: "Successfully authenticated with passkey.",
			});
			// BetterAuth usually handles session persistence;
			// a hard redirect ensures the auth state is synced globally.
			window.location.href = "/";
		},
		onError: (error: Error) => {
			// Check if user cancelled to avoid "scary" error toasts on cancel
			if (
				error.message.includes("User cancelled") ||
				error.message.includes("abort")
			) {
				return;
			}

			toast.error("Authentication Error", {
				description: error.message,
			});
		},
	});

	const isLoading = isPending || isAnyLoading;

	useEffect(() => {
		if (!PublicKeyCredential.isConditionalMediationAvailable?.()) {
			return;
		}

		authClient.signIn.passkey({ autoFill: true });
	}, []);

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
				onClick={() => handlePasskeySignIn()}
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
