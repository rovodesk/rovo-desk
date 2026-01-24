import { createServerFn } from "@tanstack/react-start";
import { getToken } from "@/lib/auth/server";

// Get auth information for SSR using available cookies
export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
	return await getToken();
});
