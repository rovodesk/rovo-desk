import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { IWebhookEventRepository } from "../../../../api/src/infra/database/repositories/billing/webhook/webhook.types";

export async function processWebhookEvent(
	eventId: string,
	repo: IWebhookEventRepository,
	tracer: ITracer
): Promise<void> {
	await tracer.withSpan("billing.processWebhookEvent", async () => {
		const event = await repo.getById({ id: eventId });
		console.log("Processing webhook event", event?.id);
	});
}
