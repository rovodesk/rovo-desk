import { Link } from "@tanstack/react-router";
import { MagicLinkForm } from "@zero-heads-lab/auth/components/magic-link-form";
import { OauthButtons } from "@zero-heads-lab/auth/components/oauth-buttons";
// import { PasskeyButton } from "@zero-heads-lab/auth/components/passkey-button";
import { Logo } from "@zero-heads-lab/design-system/components/logo";
import { Particles } from "@zero-heads-lab/design-system/components/particles";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

type AuthProps = {
	variant?: "sign-in" | "sign-up";
};

export function Auth({ variant = "sign-in" }: AuthProps) {
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
							{variant === "sign-in" ? "Sign In" : "Sign Up"}
						</h1>
						<p className="text-base text-muted-foreground">
							{variant === "sign-in"
								? "Sign in to your account."
								: "Sign up to create your account."}
						</p>
					</div>

					<OauthButtons />
					{/* FIXME: NEED TO FIX */}
					{/* <PasskeyButton /> */}
					<MagicLinkForm />

					<p className="mt-8 text-muted-foreground text-sm">
						By clicking continue, you agree to our{" "}
						<Link
							className="underline underline-offset-4 hover:text-primary"
							to="/"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							className="underline underline-offset-4 hover:text-primary"
							to="/"
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
