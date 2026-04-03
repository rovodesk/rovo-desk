import type { JwtPayload } from "@zero-heads-lab/auth";
import type { BaseEvent } from "@zero-heads-lab/events";
import type { WorkerEnv } from "@zero-heads-lab/global";

export type AuthQueueMessage = {
	version: 1;
	enqueuedAt: string;
	event: BaseEvent;
};

export type ApiGatewayServiceBindings = WorkerEnv["Bindings"] & {
	AUTH_SERVICE_QUEUE: Queue<AuthQueueMessage>;
	DATABASE_URL: string;
	KINDE_DOMAIN: string;
	KINDE_CLIENT_ID: string;
	KINDE_CLIENT_SECRET: string;
};

export type ApiGatewayServiceVariables = WorkerEnv["Variables"] & {
	token: string;
	claims: JwtPayload;
};

export type ApiGatewayServiceEnv = WorkerEnv<
	ApiGatewayServiceBindings,
	ApiGatewayServiceVariables
>;
