import { Hono } from "hono";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { rpcMiddleware } from "./middlewares/rpc.middleware";
import { authRoute } from "./routes/auth.route";
import type { Bindings } from "./types";

export { ChatRoom } from "./lib/partykit/chat-room";
export { Document } from "./lib/partykit/document";

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use("/*", corsMiddleware);

// RPC
app.use("/rpc/*", rpcMiddleware);

// WebSocket
app.all("/ws/document/:documentId?", async (c) => {
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
});

app.all("/ws/chatroom/:roomId?", async (c) => {
	console.log("WS CHAT REQUEST", c.req.url, c.req.query());
	const roomId =
		c.req.param("roomId") ?? c.req.query("roomId") ?? c.req.query("_pk");

	if (!roomId) {
		console.error("MISSING ROOM ID");
		return c.text("Missing roomId", 400);
	}

	const id = c.env.CHAT_ROOM.idFromName(roomId);
	const stub = c.env.CHAT_ROOM.get(id);

	const headers = new Headers(c.req.raw.headers);
	headers.set("x-partykit-room", roomId);
	headers.set("x-partykit-namespace", "ChatRoom");

	return await stub.fetch(
		new Request(c.req.raw, {
			headers,
		})
	);
});

// Auth Routes
app.route("/auth", authRoute);

export default app;
