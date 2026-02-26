import { Hono } from "hono";
import { documenttMiddleware } from "../middlewares/document.middleware";
import type { Bindings } from "../types";

export const documentRoute = new Hono<{ Bindings: Bindings }>();

documentRoute
	.all("/:documentId?", async (c) => {
		console.log("WS DOCUMENT REQUEST", c.req.url, c.req.query());
		const documentId =
			c.req.param("documentId") ??
			c.req.query("documentId") ??
			c.req.query("_pk");

		if (!documentId) {
			console.error("MISSING DOCUMENT ID");
			return c.text("Missing documentId", 400);
		}

		const id = c.env.KNOWLEDGE_BASE.idFromName(documentId);
		const stub = c.env.KNOWLEDGE_BASE.get(id);

		const headers = new Headers(c.req.raw.headers);
		headers.set("x-partykit-room", documentId);
		headers.set("x-partykit-namespace", "Document");

		return await stub.fetch(new Request(c.req.raw, { headers }));
	})
	.use(documenttMiddleware);
