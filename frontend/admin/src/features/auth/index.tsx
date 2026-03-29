// import { PasskeyButton } from "@zero-heads-lab/auth/components/passkey-button";
import { CognitoLoginButton } from "@zero-heads-lab/auth/components/cognito-button";
import { Logo } from "@zero-heads-lab/design-system/components/logo";
import { Particles } from "@zero-heads-lab/design-system/components/particles";

export function Auth() {
	return (
		<div className="relative w-full md:h-screen md:overflow-hidden">
			<Particles
				className="absolute inset-0"
				color="#666666"
				ease={20}
				quantity={120}
			/>
			<div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4">
				<div className="mx-auto space-y-4 sm:w-sm">
					<Logo className="h-6" />
					<div className="flex flex-col space-y-1">
						<h1 className="font-bold text-2xl tracking-wide">Welcome Admin</h1>
						<p className="text-base text-muted-foreground">
							Sign in to your admin account.
						</p>
					</div>

					<CognitoLoginButton redirect="/" />
				</div>
			</div>
		</div>
	);
}
