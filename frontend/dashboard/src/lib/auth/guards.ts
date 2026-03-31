import { redirect } from "@tanstack/react-router";

export function requireAuth(context: {
	auth: {
		isAuthenticated: boolean;
	};
}) {
	if (!context.auth.isAuthenticated) {
		throw redirect({
			href: "http://localhost:3001/login",
		});
	}
}

export function requireGuest(context: {
	auth: {
		isAuthenticated: boolean;
	};
}) {
	if (context.auth.isAuthenticated) {
		throw redirect({ to: "/" });
	}
}

export function requireOnboarding(context: {
	onboarding:
		| {
				complete: boolean;
				step: string;
		  }
		| undefined;
}) {
	if (!context.onboarding?.complete) {
		throw redirect({
			to: "/get-started",
			search: {
				step: context.onboarding?.step,
			},
		});
	}
}

export function requireRole(
	context: {
		auth: {
			kindeUser?: {
				roles?: Array<{ key?: string } | string>;
			} | null;
		};
	},
	requiredRoles: string[]
) {
	const roles =
		context.auth.kindeUser?.roles?.map((role) =>
			typeof role === "string" ? role : (role.key ?? "")
		) ?? [];

	const hasRole = requiredRoles.some((role) => roles.includes(role));

	if (!hasRole) {
		throw redirect({ to: "/403" });
	}
}
