import { Link, useRouter } from "@tanstack/react-router";
import { useAdmin } from "@zero-heads-lab/auth/hooks";
import { CognitoIcon } from "@zero-heads-lab/design-system/assets/icons/cognito-icon";
// import { PasskeyButton } from "@zero-heads-lab/auth/components/passkey-button";
import { Logo } from "@zero-heads-lab/design-system/components/logo";
import { Particles } from "@zero-heads-lab/design-system/components/particles";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

type AuthProps = {
	redirectFrom?: string;
};

export function Auth({ redirectFrom }: AuthProps) {
	return (
		<div className="relative w-full md:h-screen md:overflow-hidden">
			<Particles
				className="absolute inset-0"
				color="#666666"
				ease={20}
				quantity={120}
			/>
			<div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4">
				<Button asChild className="absolute top-4 left-4" variant="ghost">
					<Link to="/">
						<ChevronLeftIcon />
						Home
					</Link>
				</Button>

				<div className="mx-auto space-y-4 sm:w-sm">
					<Logo className="h-6" />
					<div className="flex flex-col space-y-1">
						<h1 className="font-bold text-2xl tracking-wide">
							Sign in to Admin Dashboard
						</h1>
						<p className="text-base text-muted-foreground">
							Sign in to Admin Dashboard.
						</p>
					</div>

					<div className="flex w-full flex-col justify-center gap-4">
						<CognitoLoginButton />
					</div>

					<p className="mt-8 text-muted-foreground text-sm">
						By clicking continue, you agree to our{" "}
						<Link
							className="underline underline-offset-4 hover:text-primary"
							to={redirectFrom}
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							className="underline underline-offset-4 hover:text-primary"
							to={redirectFrom}
						>
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	);
}

const CognitoLoginButton = () => {
	const { adminSignInMutationAsync } = useAdmin();
	const router = useRouter();

	const handleSignIn = async () => {
		const res = await adminSignInMutationAsync();
		if (res.data?.redirect && res.data.url) {
			return router.navigate({ href: res.data.url });
		}
	};

	return (
		<Button
			className="relative py-6 text-md leading-1"
			onClick={handleSignIn}
			size="lg"
			variant="outline"
		>
			<CognitoIcon className="mr-2 h-6 w-6" />
			Continue with Cognito
		</Button>
	);
};
