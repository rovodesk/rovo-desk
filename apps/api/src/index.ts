import { Hono } from "hono";
import { analyticsMiddleware } from "./middlewares/analytics.middleware";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { rpcMiddleware } from "./middlewares/rpc.middleware";
import { authRoute } from "./routes/auth.route";
import { documentRoute } from "./routes/document.route";
import { widgetRoute } from "./routes/widget.route";
import type { Bindings, Variables } from "./types";

export { default as ChatRoom } from "./lib/partykit/chatroom";
export { default as Document } from "./lib/partykit/document";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use("*", corsMiddleware);
app.use("*", analyticsMiddleware);
app.use("*", analyticsMiddleware);
app.use("/rpc/*", rpcMiddleware);

app.route("/ws/document", documentRoute);
app.route("/auth", authRoute);
app.route("/widget", widgetRoute);

export default app;
