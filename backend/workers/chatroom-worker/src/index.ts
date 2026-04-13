import { Hono } from "hono";
import { getServerByName } from "partyserver";
import type { Bindings } from "./types";

type Env = {
	Bindings: Bindings;
};

const app = new Hono<Env>();
app.all("/ws/:roomId", async (c) => {
	const roomId = c.req.param("roomId");
	if (!roomId) return c.text("Missing roomId", 400);

	// Get or create Durable Object
	const stub = await getServerByName(c.env.CHAT_ROOM, roomId);

	// Set headers for PartyKit
	const headers = new Headers(c.req.raw.headers);
	headers.set("x-partykit-room", roomId);
	headers.set("x-partykit-namespace", "Chatroom");

	return stub.fetch(c.req.raw);
});

export { default as ChatRoom } from "./chatroom";
export default app;
