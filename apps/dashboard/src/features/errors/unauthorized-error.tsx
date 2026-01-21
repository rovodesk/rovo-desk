import { useNavigate, useRouter } from "@tanstack/react-router";
import { UnauthorisedError as UnauthorisedErrorComponent } from "@zero-heads-lab/design-system/components/errors/unauthorized";

export function UnauthorisedError() {
	const navigate = useNavigate();
	const { history } = useRouter();
	return (
		<UnauthorisedErrorComponent
			onGoBack={() => history.go(-1)}
			onGoHome={() => navigate({ to: "/" })}
		/>
	);
}
