import {
	GithubIcon,
	GoogleIcon,
} from "@zero-heads-lab/design-system/assets/icons";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Loader2Icon } from "lucide-react";
import { useLastLoginMethod, useOauthSignIn } from "../hooks";
import { LastLoginBadge } from "./last-login-badge";

type OauthButtonsProps = {
	isAnyLoading?: boolean;
	callbackURL: string;
};

export const OauthButtons = ({
	isAnyLoading,
	callbackURL,
}: OauthButtonsProps) => {
	const { signInWithOAuth, isPending, variables } = useOauthSignIn(
		callbackURL,
		{
			onError: () => {
				toast.error("Error signing in", {
					description: "Please try again later.",
				});
			},
		}
	);

	const { lastLoginMethod } = useLastLoginMethod();

	const loadingProvider = isPending ? variables : null;

	return (
		<div className="flex w-full flex-col gap-4">
			{/* Google SignIn Button */}

			<Button
				className="relative"
				disabled={isAnyLoading || isPending}
				onClick={() => signInWithOAuth("google")}
				size="lg"
				type="button"
			>
				{loadingProvider === "google" ? (
					<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<GoogleIcon className="mr-2 h-4 w-4" />
				)}
				Continue with Google
				{lastLoginMethod === "google" && (
					<div className="absolute -top-[1/2] right-3">
						<LastLoginBadge compact />
					</div>
				)}
			</Button>

			{/* GitHub SignIn Button */}
			<Button
				disabled={isAnyLoading || isPending}
				onClick={() => signInWithOAuth("github")}
				size="lg"
				type="button"
			>
				{loadingProvider === "github" ? (
					<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<GithubIcon className="mr-2 h-4 w-4" />
				)}
				Continue with GitHub
				{lastLoginMethod === "github" && (
					<div className="absolute -top-[1/2] right-3">
						<LastLoginBadge compact />
					</div>
				)}
			</Button>
		</div>
	);
};

export default OauthButtons;
