import {
	GithubIcon,
	GoogleIcon,
} from "@zero-heads-lab/design-system/assets/icons";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useSignIn } from "../hooks";
import { LastLoginBadge } from "./last-login-badge";

type OauthButtonsProps = {
	isAnyLoading?: boolean;
};

const OauthButtons = ({ isAnyLoading }: OauthButtonsProps) => {
	const { signInWithOAuth, loading, lastLoginMethod } = useSignIn();

	const [activeProvider, setActiveProvider] = useState<
		"google" | "github" | null
	>(null);

	const handleSignIn = (provider: "google" | "github") => {
		setActiveProvider(provider);
		signInWithOAuth(provider);
	};

	const isGoogleLoading = loading && activeProvider === "google";
	const isGithubLoading = loading && activeProvider === "github";

	return (
		<div className="flex w-full flex-col gap-4">
			{/* Google */}
			<Button
				className="relative"
				disabled={isAnyLoading || loading}
				onClick={() => handleSignIn("google")}
				size="lg"
				type="button"
			>
				{isGoogleLoading ? (
					<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<GoogleIcon className="mr-2 h-4 w-4" />
				)}
				Continue with Google
				{lastLoginMethod === "google" && (
					<span className="absolute top-1/2 right-3 -translate-y-1/2">
						<LastLoginBadge compact />
					</span>
				)}
			</Button>

			{/* GitHub */}
			<Button
				className="relative"
				disabled={isAnyLoading || loading}
				onClick={() => handleSignIn("github")}
				size="lg"
				type="button"
			>
				{isGithubLoading ? (
					<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<GithubIcon className="mr-2 h-4 w-4" />
				)}
				Continue with GitHub
				{lastLoginMethod === "github" && (
					<span className="absolute top-1/2 right-3 -translate-y-1/2">
						<LastLoginBadge compact />
					</span>
				)}
			</Button>
		</div>
	);
};

export default OauthButtons;
export { OauthButtons };
