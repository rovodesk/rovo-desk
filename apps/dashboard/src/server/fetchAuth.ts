import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";

export const fetchAuth = createServerFn({ method: "GET" }).handler(async () => {
	const { isAuthenticated, userId, getToken } = await auth();

	const token = await getToken({ template: "convex" });

	return {
		isAuthenticated,
		userId,
		token,
	};
});
