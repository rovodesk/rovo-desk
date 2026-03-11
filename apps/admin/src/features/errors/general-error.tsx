import type { ErrorComponentProps } from "@tanstack/react-router";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { GeneralError as GeneralErrorComponent } from "@zero-heads-lab/design-system/components/errors/general-error";

export function GeneralError({ error }: Partial<ErrorComponentProps>) {
	if (error) {
		console.error(error);
	}

	const navigate = useNavigate();
	const { history } = useRouter();

	return (
		<GeneralErrorComponent
			onGoBack={() => history.go(-1)}
			onGoHome={() => navigate({ to: "/" })}
		/>
	);
}
