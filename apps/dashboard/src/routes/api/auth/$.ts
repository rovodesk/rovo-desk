// biome-ignore lint/style/useFilenamingConvention: This is a splat/catch-all route

import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "@zero-heads-lab/auth/server";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			GET: ({ request }: { request: Request }) => {
				console.log("GET /api/auth/$_");
				const auth = createAuth();
				return auth.handler(request);
			},
			POST: ({ request }: { request: Request }) => {
				console.log("POST /api/auth/$_");
				const auth = createAuth();
				return auth.handler(request);
			},
		},
	},
});
