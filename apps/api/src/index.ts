import { AUTH_CONFIG } from "@zero-heads-lab/auth/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { rpcMiddleware } from "./middlewares/rpc.middleware";
import { authRoute } from "./routes/auth.route";
import type { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use("/*", cors(AUTH_CONFIG.CORS));

// ORPC
app.use("/rpc/*", rpcMiddleware);

// Auth Routes
app.route("/auth", authRoute);

export default app;
