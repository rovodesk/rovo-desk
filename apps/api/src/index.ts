import { Hono } from "hono";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { rpcMiddleware } from "./middlewares/rpc.middleware";
import { authRoute } from "./routes/auth.route";
import type { Bindings } from "./types";

export { Document } from "./lib/document";

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use("/*", corsMiddleware);

// RPC
app.use("/rpc/*", rpcMiddleware);

// WebSocket
app.all("/ws/:roomId", async (c) => {
	const roomId = c.req.param("roomId");
	const id = c.env.KNOWLEDGE_BASE.idFromName(roomId);
	const stub = c.env.KNOWLEDGE_BASE.get(id);

	// 1. Create a new set of headers based on the original request
	const headers = new Headers(c.req.raw.headers);

	// 2. Add the headers that 'partyserver' expects to see
	headers.set("x-partykit-room", roomId);
	headers.set("x-partykit-namespace", "chat"); // Usually matches your binding name or DO class

	// 3. Create a new Request object with these headers
	const newRequest = new Request(c.req.raw, {
		headers,
	});

	// 4. Forward this "enriched" request to the Durable Object
	const response = await stub.fetch(newRequest as unknown as Request);

	// 5.  Re-wrap response for Hono
	return response as unknown as Response;
});

// Auth Routes
app.route("/auth", authRoute);

export default app;
