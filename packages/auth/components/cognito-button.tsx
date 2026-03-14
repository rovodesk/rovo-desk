import { CognitoIcon } from "@zero-heads-lab/design-system/assets/icons/cognito-icon";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { useAuthContext } from "../client/context";
import { useAdmin } from "../hooks";

type CognitoLoginButtonProps = {
	className?: string;
	redirect?: string;
};

export const CognitoLoginButton = ({
	className,
	redirect,
}: CognitoLoginButtonProps) => {
	const { adminSignInAsync } = useAdmin();
	const { replace } = useAuthContext();

	const handleSignIn = async () => {
		const res = await adminSignInAsync(redirect);

		if (res.data?.redirect && res.data.url) {
			return replace(res.data.url);
		}
	};

	return (
		<Button
			className={cn("relative w-full py-6 text-md leading-1", className)}
			onClick={handleSignIn}
			size="lg"
			variant="outline"
		>
			<CognitoIcon className="mr-2 h-6 w-6" />
			Continue with Cognito
		</Button>
	);
};

export default CognitoLoginButton;
