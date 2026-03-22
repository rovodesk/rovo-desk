import { Hono } from "hono";
import { analyticsMiddleware } from "./middlewares/analytics.middleware";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { rpcMiddleware } from "./middlewares/rpc.middleware";
import { authRoute } from "./routes/auth.route";
import { documentRoute } from "./routes/document.route";
import type { Bindings } from "./types";
import { widgetRoute } from "./routes/widget.route";

export { default as ChatRoom } from "./lib/partykit/chatroom";
export { default as Document } from "./lib/partykit/document";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", corsMiddleware);
<<<<<<< HEAD
app.use("*", analyticsMiddleware);
=======
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
app.use("/rpc/*", rpcMiddleware);

app.route("/ws/document", documentRoute);
app.route("/auth", authRoute);
app.route("/widget", widgetRoute);

export default app;
