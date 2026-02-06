import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "./lib/utils";
import { rpcMiddleware } from "./middlewares/rpc.middleware";
import { authRoute } from "./routes/auth.route";
import type { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use(
	"/*",
	cors({
		origin: (requestOrigin, c) => {
			const allowed = getAllowedOrigins(c);
			return allowed.includes(requestOrigin) ? requestOrigin : null;
		},
		allowHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	})
);

// ORPC
app.use("/rpc/*", rpcMiddleware);

// Auth Routes
app.route("/auth", authRoute);

export default app;
