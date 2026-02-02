import { useNavigate, useRouter } from "@tanstack/react-router";
import { NotFoundError as NotFoundErrorComponent } from "@zero-heads-lab/design-system/components/errors/not-found-error";

export function NotFoundError() {
	const navigate = useNavigate();
	const { history } = useRouter();
	return (
		<NotFoundErrorComponent
			onGoBack={() => history.go(-1)}
			onGoHome={() => navigate({ to: "/" })}
		/>
	);
}
