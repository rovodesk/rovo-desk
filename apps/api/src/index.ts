import { Hono } from "hono";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { rpcMiddleware } from "./middlewares/rpc.middleware";
import { authRoute } from "./routes/auth.route";
import { chatRoomRoute } from "./routes/chatroom.route";
import { documentRoute } from "./routes/document.route";
import type { Bindings } from "./types";

export { ChatRoom } from "./lib/partykit/chat-room";
export { Document } from "./lib/partykit/document";

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use("/*", corsMiddleware);

// RPC
app.use("/rpc/*", rpcMiddleware);

// WebSocket
app.route("/ws/document", documentRoute);
app.route("/ws/chatroom", chatRoomRoute);

// Auth Routes
app.route("/auth", authRoute);

export default app;
