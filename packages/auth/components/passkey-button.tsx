import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { KeyRoundIcon, Loader2Icon } from "lucide-react";
import { useSignIn } from "../hooks";

type PasskeyButtonProps = {
	isAnyLoading?: boolean;
};

export function PasskeyButton({ isAnyLoading }: PasskeyButtonProps) {
	const { signInWithPasskey, loading } = useSignIn();

	const isLoading = loading || isAnyLoading;

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
