import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { baseUrl } from "@/lib/api-client";

async function callAPI(path: string, method: string, body?: unknown) {
	const res = await fetch(baseUrl(path), {
		method,
		headers: { "Content-Type": "application/json" },
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!res.ok) {
		throw new Error("Request failed");
	}

	return res.json(); // MUST return { txid }
}

export const documentCollection = createCollection(
	electricCollectionOptions({
		shapeOptions: {
			url: "/help-center/documents",
		},
		// Get the primary key of the document
		getKey: (document: Record<string, unknown>) => document.id as string,

		// INSERT
		onInsert: async ({ transaction }) => {
			const newItem = transaction.mutations[0].modified;
			const { txid } = await callAPI("/docs", "POST", newItem);

			return { txid };
		},

		// ✅ UPDATE
		onUpdate: async ({ transaction }) => {
			const { original, changes } = transaction.mutations[0];
			const { txid } = await callAPI(`/docs/${original.id}`, "PATCH", changes);

			return { txid };
		},

		// DELETE
		onDelete: async ({ transaction }) => {
			const { original } = transaction.mutations[0];
			const { txid } = await callAPI(`/docs/${original.id}`, "DELETE");

			return { txid };
		},
	})
);
