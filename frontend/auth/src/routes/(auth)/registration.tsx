import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@zero-heads-lab/auth/use-auth";

export const Route = createFileRoute("/(auth)/registration")({
	beforeLoad: ({ context }) => {
		const { isAuthenticated } = context.auth;
		if (isAuthenticated) {
			throw redirect({ to: "/" });
		}

		const { register } = useAuth();
		register({
			loginHint: "john@doe.com",
		});
	},
});

// function SignUp() {
// 	// Save redirectFrom in cookie if it is allowed
// 	// const { redirectFrom } = Route.useSearch();
// 	// const allowedOrigins = extractOrigins(env.VITE_ALLOWED_REDIRECT_FROM_URLS);
// 	// if (redirectFrom && allowedOrigins.includes(redirectFrom)) {
// 	// 	setCookie("redirectFrom", redirectFrom, 60 * 60 * 1);
// 	// }

// 	const { register, isAuthenticated } = useAuth();

// 	useEffect(() => {
// 		if (isAuthenticated) {
// 			router.navigate({ to: "/" });
// 		}
// 		register({
// 			loginHint: "john@doe.com",
// 		});
// 	}, [register]);

// 	return <Auth variant="sign-up" />;
// }
