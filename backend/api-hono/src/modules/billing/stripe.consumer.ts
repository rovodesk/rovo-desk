import { Analytics } from "@zero-heads-lab/analytics/lib/analytics";
import { Logger } from "@zero-heads-lab/analytics/lib/logger";
import { Tracer } from "@zero-heads-lab/analytics/lib/tracer";
import type { LogLevel } from "@zero-heads-lab/analytics/types";
import type { STRIPE_WEBHOOK_MESSAGE_EVENT } from "@zero-heads-lab/contract/event/stripe";
import { createDatabase } from "@zero-heads-lab/database";
import { WebhookEventRepository } from "@zero-heads-lab/database/repositories/billing/webhook";
import { resolveSecret } from "@/lib/utils";
import type { Bindings } from "@/types";
import { processWebhookEvent } from "./billing";

export async function BillingConsumer(
	batch: MessageBatch<STRIPE_WEBHOOK_MESSAGE_EVENT>,
	env: Bindings,
	ctx: ExecutionContext
) {
	const posthogApiKey = await resolveSecret(env.POSTHOG_API_KEY);
	const analytics = new Analytics({
		env: {
			POSTHOG_API_KEY: posthogApiKey,
			POSTHOG_HOST: env.POSTHOG_HOST,
		},
	});

	const logger = new Logger({
		env: {
			LOG_LEVEL: env.LOG_LEVEL as LogLevel,
			ANALYTICS_ENABLED: env.ANALYTICS_ENABLED === "true",
		},
		analytics,
	});

	const tracer = new Tracer({
		app: "rovodesk",
		version: "1.0.0",
		logger: logger.derive({
			name: "stripe-consumer",
		}),
	});

	const databaseUrl = await resolveSecret(env.DATABASE_URL);
	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not defined");
	}
	const database = await createDatabase(databaseUrl, logger);
	const repo = new WebhookEventRepository(database.db, tracer);

	for (const message of batch.messages) {
		const { eventId } = message.body;

		try {
			const existing = await repo.getById({ id: eventId });

			if (!existing) {
				logger.warn(true, "Stripe webhook event not found", {
					eventId,
				});
				message.ack();
				continue;
			}

			if (existing.status === "processed" || existing.status === "ignored") {
				message.ack();
				continue;
			}

			await repo.incrementAttempt({ id: eventId });
			await repo.markProcessing({ id: eventId });

			try {
				await processWebhookEvent(eventId, repo, tracer);
				await repo.markProcessed({ id: eventId });
				message.ack();
			} catch (error) {
				await repo.markFailed({
					id: eventId,
					error,
				});
				message.retry();
			} finally {
				message.ack();
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);

			console.error(`Failed processing Stripe event ${eventId}`, error);

			await repo.markFailed({
				id: eventId,
				error: errorMessage,
			});

			logger.warn(true, "Failed processing Stripe event", {
				eventId,
				error: errorMessage,
				message: message.body,
				failedAt: new Date().toISOString(),
			});

			message.retry();
		}
	}
}
