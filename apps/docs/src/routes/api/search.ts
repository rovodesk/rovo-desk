import { createFileRoute } from "@tanstack/react-router";
import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

const server = createFromSource(source, {
	// https://docs.orama.com/docs/orama-js/supported-languages
	language: "english",
});

export const Route = createFileRoute("/api/search")({
	// @ts-expect-error: tanstack start types are not updated yet
	server: {
		handlers: {
			GET: () => server.staticGET(),
		},
	},
});
