import { Hono } from "hono";
import type { Bindings } from "../types";

export const chatRoomRoute = new Hono<{ Bindings: Bindings }>();

chatRoomRoute.all("/:roomId?", async (c) => {
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
