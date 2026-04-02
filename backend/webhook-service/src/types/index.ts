import type { BaseEvent } from "@zero-heads-lab/events";
import type { WorkerEnv } from "@zero-heads-lab/global";

export type WebhookQueueMessage = {
	version: 1;
	enqueuedAt: string;
	event: BaseEvent;
};

export type WebhooksServiceBindings = WorkerEnv["Bindings"] & {
	WebhooksEventQueue: Queue<WebhookQueueMessage>;
	DatabaseUrl: string;
	KindeWebhookSecret: string;
};

export type WebhookServiceVariables = WorkerEnv["Variables"];

export type WebhookServiceEnv = WorkerEnv<
	WebhooksServiceBindings,
	WebhookServiceVariables
>;
