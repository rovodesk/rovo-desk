import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "@zero-heads-lab/auth/server";

// Splat or catch-all route
export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				console.log("GET /api/auth/$_");
				const auth = await createAuth();
				return auth.handler(request);
			},
			POST: async ({ request }: { request: Request }) => {
				console.log("POST /api/auth/$_");
				const auth = await createAuth();
				return auth.handler(request);
			},
		},
	},
});
