import { useNavigate, useRouter } from "@tanstack/react-router";
import { ForbiddenError as ForbiddenErrorComponent } from "@zero-heads-lab/design-system/components/errors/forbidden-error";

export function ForbiddenError() {
	const navigate = useNavigate();
	const { history } = useRouter();

	return (
		<ForbiddenErrorComponent
			onGoBack={() => history.back()}
			onGoHome={() => navigate({ to: "/" })}
		/>
	);
}
