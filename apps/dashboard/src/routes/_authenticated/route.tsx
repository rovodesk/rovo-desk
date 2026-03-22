import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@zero-heads-lab/auth/client";
import { z } from "zod";
import { DashboardLayout } from "@/layout";

export const Route = createFileRoute("/_authenticated")({
	component: DashboardLayout,
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession();
<<<<<<< HEAD
		if (!session) {
			console.log("NOT AUTHENTICATED, REDIRECTING TO SIGN IN");
=======
		console.log("Dashboard SEssion", session);

		if (!session) {
			console.log("NOT AUTHENTICATED, REDIRECTING TO SIGN IN");
			// throw Route.redirect({
			// 	to: "/sign-in",
			// 	search: {
			// 		redirectTo: window.location.href,
			// 	},
			// });
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
			throw Route.redirect({
				href: "http://localhost:3001/sign-in",
				search: {
					redirectFrom: encodeURI(window.location.href),
				},
			});
		}
	},
	validateSearch: z.object({
		redirectFrom: z
			.url()
			.transform((value) => decodeURI(value))
			.optional(),
	}),
});
