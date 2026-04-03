import { Hono } from "hono";
import type { ApiGatewayServiceEnv } from "src/types";

export const createUserRoute = () => {
	const app = new Hono<ApiGatewayServiceEnv>();

	return app;
};
