import { createFileRoute } from "@tanstack/react-router";
import { getLLMText, source } from "@/lib/source";

export const Route = createFileRoute("/llms-full.txt")({
	// @ts-expect-error: tanstack start types are not updated yet
	server: {
		handlers: {
			GET: async () => {
				const scan = source.getPages().map(getLLMText);
				const scanned = await Promise.all(scan);
				return new Response(scanned.join("\n\n"));
			},
		},
	},
});
