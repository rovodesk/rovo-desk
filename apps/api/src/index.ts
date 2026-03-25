import { Hono } from "hono";
import { corsMiddleware } from "./middlewares/cors.middleware";
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
app.use("/rpc/*", rpcMiddleware);

app.route("/ws/document", documentRoute);
app.route("/auth", authRoute);
app.route("/widget", widgetRoute);

// const config: ResolveConfigFn<Bindings> = (env) => ({
// 	exporter: {
// 		url: `https://${env.AXIOM_DOMAIN}/v1/traces`,
// 		headers: {
// 			Authorization: `Bearer ${env.AXIOM_TOKEN}`,
// 			"X-Axiom-Dataset": `${env.AXIOM_DATASET}`,
// 		},
// 	},
// 	service: {
// 		name: `rovodesk-${name}`,
// 		version,
// 	},
// });

// export default instrument<
// 	AppEnv,
// 	Request<unknown, IncomingRequestCfProperties<unknown>>,
// 	ResolveConfigFn<Bindings>
// >(
// 	{
// 		fetch: (request, env, ctx) => app.fetch(request, env, ctx),
// 	},
// 	config
// )
