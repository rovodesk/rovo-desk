import { Hono } from "hono";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { databaseMiddleware } from "./middlewares/database.middleware";
import { observabilityMiddleware } from "./middlewares/observability.middleware";
import { rpcMiddleware } from "./middlewares/rpc.middleware";
import { authRoute } from "./routes/auth.route";
import { documentRoute } from "./routes/document.route";
import { widgetRoute } from "./routes/widget.route";
import type { Bindings, Variables } from "./types";

export { default as ChatRoom } from "./lib/partykit/chatroom";
export { default as Document } from "./lib/partykit/document";

type AppEnv = {
	Bindings: Bindings;
	Variables: Variables;
};

const app = new Hono<AppEnv>();

app.use("*", corsMiddleware);
app.use("*", observabilityMiddleware);
app.use("*", databaseMiddleware);
app.use("/rpc/*", rpcMiddleware);

app.route("/ws/document", documentRoute);
app.route("/auth", authRoute);
app.route("/widget", widgetRoute);

export default app;
