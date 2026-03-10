import { Hono } from "hono";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { rpcMiddleware } from "./middlewares/rpc.middleware";
import { authRoute } from "./routes/auth.route";
import { documentRoute } from "./routes/document.route";
import { widgetRoute } from "./routes/widget.route";
import type { Bindings } from "./types";

export { default as ChatRoom } from "./lib/partykit/chatroom";
export { default as Document } from "./lib/partykit/document";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", corsMiddleware);
app.use("/rpc/*", rpcMiddleware);

app.route("/ws/document", documentRoute);
app.route("/auth", authRoute);
app.route("/widget", widgetRoute);

export default app;
